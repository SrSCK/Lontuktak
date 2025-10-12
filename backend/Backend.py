from fastapi import FastAPI, UploadFile, File, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
from datetime import datetime
import os
import pandas as pd
import joblib
import uvicorn

from Auto_cleaning import auto_cleaning
from DB_server import engine
from Predict import update_model_and_train, forcast_loop, Evaluate
from analysis.data_analyzer import size_mix_pivot, performance_table, best_sellers_by_month

app = FastAPI(title="Sales Analysis & Forecast API")

# Configure CORS
origins = [
    "http://localhost:5173",
    "http://localhost:3000",
    "http://127.0.0.1:5173",
    "https://lontuktak.netlify.app"  # Add your production domain
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["Content-Type", "Authorization", "X-Requested-With"],
)

# Models
class PredictionRequest(BaseModel):
    product_id: str
    quantity: int
    date: str

class AuthRequest(BaseModel):
    email: str
    password: str
    name: Optional[str] = None

# -------------------------
# Upload & Training Endpoint
# -------------------------
@app.post("/train")
async def train_model(
    sales_file: UploadFile = File(...),
    product_file: UploadFile = File(None)  # optional
):
    os.makedirs("tmp", exist_ok=True)

    # Save sales file
    sales_path = f"tmp/{sales_file.filename}"
    with open(sales_path, "wb") as f:
        f.write(await sales_file.read())

    # Check if product file is needed
    try:
        result = pd.read_sql("SELECT COUNT(*) FROM all_products", engine)
        product_count = result.iloc[0, 0]
    except Exception:
        product_count = 0

    product_path = None
    if product_count == 0:
        if product_file is None:
            raise HTTPException(status_code=400, detail="Product file required for first-time upload")
        product_path = f"tmp/{product_file.filename}"
        with open(product_path, "wb") as f:
            f.write(await product_file.read())
    elif product_file is not None:
        product_path = f"tmp/{product_file.filename}"
        with open(product_path, "wb") as f:
            f.write(await product_file.read())

    # --- Auto cleaning ---
    df_base = auto_cleaning(sales_path, product_path, engine)

    # --- Train/update model ---
    df_window, base_model, X_train, y_train, X_test, y_test, product_sku_last = update_model_and_train(df_base)

    artifacts = {
        "model": base_model,
        "X_train": X_train,
        "y_train": y_train,
        "df_window": df_window,
        "product_sku_last": product_sku_last
    }
    joblib.dump(artifacts, "training_artifacts.pkl")

    # --- Evaluate ---
    metrics = Evaluate(X_train, y_train, X_test, y_test, base_model)

    return {
        "status": "training completed",
        "rows_uploaded": len(df_base),
        "metrics": metrics
    }

# -------------------------
# Forecast Endpoint
# -------------------------
@app.post("/predict")
async def predict_sales(
    n_forecast: int = Query(3, gt=0, description="Number of months to forecast")
):
    artifacts = joblib.load("training_artifacts.pkl")

    X_train = artifacts["X_train"]
    y_train = artifacts["y_train"]
    df_window = artifacts["df_window"]
    product_sku_last = artifacts["product_sku_last"]
    base_model = artifacts["model"]

    # Run forecast without retraining from scratch
    long_forecast = forcast_loop(
        X_train,
        y_train,
        df_window,
        product_sku_last,
        base_model,
        n_forecast=n_forecast,
        retrain_each_step=True
    )
    return {
        "status": "prediction completed",
        "forecast_rows": len(long_forecast),
        "n_forecast": n_forecast,
        "forecast": long_forecast.to_dict(orient="records")
    }

# -------------------------------------------------------------------
# 1) Historical Sales
# -------------------------------------------------------------------
@app.get("/historical")
def get_historical(base_sku: str = Query(..., description="Base SKU")):
    """
    Returns historical sales for a base SKU:
      - Chart: monthly sales quantity by size
      - Table: detailed transaction rows
    """
    df = pd.read_sql("SELECT * FROM base_data", engine)

    # 1) Chart data
    pivot = size_mix_pivot(df, base_sku)
    chart_data = {
        "months": pivot.index.strftime("%b").tolist(),  # Jan, Feb, ...
        "series": [
            {"size": col, "values": pivot[col].tolist()}
            for col in pivot.columns
        ]
    }

    # 2) Table data
    df_filtered = df[df["product_sku"].str.startswith(base_sku)]
    table_data = df_filtered[["sales_date", "Size", "Total_quantity", "Total_Amount_baht"]]
    table_data = table_data.sort_values("sales_date", ascending=False)

    # Normalize keys for frontend
    records = []
    for _, row in table_data.iterrows():
        records.append({
            "date": row["sales_date"],
            "size": row["Size"],
            "quantity": int(row["Total_quantity"]),
            "income": float(row["Total_Amount_baht"]),
        })

    return {
        "chart": chart_data,
        "table": records
    }


# -------------------------------------------------------------------
# 2) Performance Comparison
# -------------------------------------------------------------------
@app.get("/performance")
def get_performance(sku_list: list[str] = Query(..., description="List of SKUs or Base SKUs (max 3)")):
    """
    Returns comparison data for up to 3 SKUs/Base SKUs.
    """
    df = pd.read_sql("SELECT * FROM base_data", engine)

    tbl = performance_table(df, sku_list)

    scatter_data = [
        {
            "item": row["Item"],
            "quantity": int(row["Quantity"]),
        }
        for _, row in tbl.iterrows()
    ]

    return {"scatter": scatter_data}


# -------------------------------------------------------------------
# 3) Best Sellers
# -------------------------------------------------------------------
@app.get("/best_sellers")
def get_best_sellers(year: int = Query(...), month: int = Query(...), top_n: int = Query(10)):
    """
    Returns top-N best sellers in a given month.
    """
    df = pd.read_sql("SELECT * FROM base_data", engine)

    tbl = best_sellers_by_month(df, year, month, top_n)

    records = []
    for _, row in tbl.iterrows():
        records.append({
            "base_sku": row["Base_SKU"],
            "best_size": row["Best_Size"],
            "quantity": int(row["Quantity"]),
        })
    
    return {"table": records}

@app.get("/api/notifications")
def get_notifications():
    # Get last 2 week_date values
    query = """
        SELECT DISTINCT week_date
        FROM stock_data
        ORDER BY week_date DESC
        LIMIT 2
    """
    week_dates = pd.read_sql(query, engine)["week_date"].tolist()
    if len(week_dates) < 2:
        raise HTTPException(status_code=400, detail="Need at least 2 weeks of data")

    week_date_curr, week_date_prev = week_dates[0], week_dates[1]

    # Load dataframes for both weeks
    df_prev = pd.read_sql(f"SELECT * FROM stock_data WHERE week_date = '{week_date_prev}'", engine)
    df_curr = pd.read_sql(f"SELECT * FROM stock_data WHERE week_date = '{week_date_curr}'", engine)

    if df_curr.empty:
        raise HTTPException(status_code=404, detail="No stock data found")

    # Generate report (reusing your logic)
    report = generate_stock_report(df_prev, df_curr)

    return report.to_dict(orient="records")


@app.get("/api/notifications/{product_name}")
def get_notification(product_name: str):
    query = """
        SELECT DISTINCT week_date
        FROM stock_data
        ORDER BY week_date DESC
        LIMIT 2
    """
    week_dates = pd.read_sql(query, engine)["week_date"].tolist()
    if len(week_dates) < 2:
        raise HTTPException(status_code=400, detail="Need at least 2 weeks of data")

    week_date_curr, week_date_prev = week_dates[0], week_dates[1]

    df_prev = pd.read_sql(
        f"SELECT * FROM stock_data WHERE week_date = '{week_date_prev}' AND product_name = '{product_name}'",
        engine
    )
    df_curr = pd.read_sql(
        f"SELECT * FROM stock_data WHERE week_date = '{week_date_curr}' AND product_name = '{product_name}'",
        engine
    )

    if df_curr.empty:
        raise HTTPException(status_code=404, detail=f"No data for product: {product_name}")

    report = generate_stock_report(df_prev, df_curr)

    return report.to_dict(orient="records")[0]

@app.get("/analysis/dashboard")
async def get_analytics():
    try:
        from analysis.data_analyzer import get_dashboard_data
        data = get_dashboard_data()
        return {"success": True, "data": data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/stock/levels")
async def get_stock_levels():
    try:
        # Import your stock management module
        from DB_server import get_stock_levels
        levels = get_stock_levels()
        return {"success": True, "data": levels}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Analysis endpoints
@app.get("/analysis/historical-sales")
async def get_historical_sales():
    try:
        # Read your sales data
        sales_data = pd.read_csv('cleaned_data.csv')
        historical = sales_data.groupby('sales_date')['total_quantity'].sum().reset_index()
        return {
            "data": historical.to_dict('records'),
            "message": "Historical sales data retrieved successfully"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/analysis/performance")
async def get_performance_comparison():
    try:
        sales_data = pd.read_csv('cleaned_data.csv')
        performance = sales_data.groupby('product_sku')['total_quantity'].sum().sort_values(ascending=False).head(10)
        return {
            "data": [{"sku": sku, "quantity": qty} for sku, qty in performance.items()],
            "message": "Performance comparison retrieved successfully"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/analysis/best-sellers")
async def get_best_sellers():
    try:
        sales_data = pd.read_csv('cleaned_data.csv')
        best_sellers = sales_data.groupby('product_name')['total_quantity'].sum().sort_values(ascending=False).head(10)
        return {
            "data": [{"product": prod, "quantity": qty} for prod, qty in best_sellers.items()],
            "message": "Best sellers retrieved successfully"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/analysis/total-income")
async def get_total_income():
    try:
        sales_data = pd.read_csv('cleaned_data.csv')
        monthly_income = sales_data.groupby(['sales_date']).agg({
            'total_amount': 'sum'
        }).reset_index()
        return {
            "data": monthly_income.to_dict('records'),
            "message": "Total income retrieved successfully"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
