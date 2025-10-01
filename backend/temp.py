# ================= Backend: Postgres Version =================
import pandas as pd
from DB_server import engine  # your SQLAlchemy engine

# Manual overrides
manual_minstock = {}  # {'Product': value}
manual_buffer = {}    # {'Product': value}

SAFETY_FACTOR = 1.5
WEEKS_TO_COVER = 2
MAX_BUFFER = 50

# ================= Get latest stock per product =================
def get_data(week_date):
    query = f"""
        SELECT product_name, stock
        FROM stock_data
        WHERE week_date = '{week_date}'
        AND uploaded_at = (
            SELECT MAX(sub.uploaded_at)
            FROM stock_data AS sub
            WHERE sub.product_name = stock_data.product_name
            AND sub.week_date = stock_data.week_date
        )
    """
    df = pd.read_sql(query, engine)
    return df

# ================= Generate Stock Report =================
def generate_stock_report(df_prev, df_curr):
    merged_df = pd.merge(
        df_curr,
        df_prev,
        on='product_name',
        how='left',
        suffixes=('_current', '_previous')
    )

    results = []
    for _, p in merged_df.iterrows():
        name = p['product_name']
        stock = p['stock_current']
        last_stock = p.get('stock_previous', stock)

        weekly_sale = max(last_stock - stock, 1)
        decrease_rate = (last_stock - stock) / last_stock * 100 if last_stock > 0 else 0
        weeks_to_empty = round(stock / max(weekly_sale, 1), 2)

        min_stock = manual_minstock.get(name, int(weekly_sale * WEEKS_TO_COVER * SAFETY_FACTOR))

        dynamic_buffer = 20 if decrease_rate > 50 else 10 if decrease_rate > 20 else 5
        dynamic_buffer = min(dynamic_buffer, MAX_BUFFER)
        buffer = manual_buffer.get(name, dynamic_buffer)

        reorder_qty = max(min_stock + buffer - stock, int(weekly_sale * SAFETY_FACTOR))

        state = "Green"
        desc = "สินค้ายังเพียงพอ"
        if stock < min_stock or decrease_rate > 50:
            state = "Red"
            desc = f"ลดลงเร็วและใกล้หมดสต๊อก! แนะนำเติม {reorder_qty} ชิ้น"
        elif decrease_rate > 20:
            state = "Yellow"
            desc = f"ลดลงเร็ว ควรเตรียมเติมสินค้า แนะนำเติม {reorder_qty} ชิ้น"

        results.append({
            "Product": name,
            "Stock": stock,
            "Last_Stock": last_stock,
            "Decrease_Rate(%)": round(decrease_rate, 1),
            "Weeks_To_Empty": weeks_to_empty,
            "MinStock": min_stock,
            "Buffer": buffer,
            "Reorder_Qty": reorder_qty,
            "Status": state,
            "Description": desc
        })

    return pd.DataFrame(results)

# ================= Main =================
if __name__ == "__main__":
    # ดึง 2 week_date ล่าสุด
    week_dates_query = """
        SELECT DISTINCT week_date
        FROM stock_data
        ORDER BY week_date DESC
        LIMIT 2
    """
    week_dates = pd.read_sql(week_dates_query, engine)["week_date"].tolist()

    if len(week_dates) < 2:
        print("❌ ต้องมีข้อมูลอย่างน้อย 2 ชุดเพื่อเปรียบเทียบ")
    else:
        week_date_curr, week_date_prev = week_dates[0], week_dates[1]

        df_prev = get_data(week_date_prev)
        df_curr = get_data(week_date_curr)

        if df_prev.empty or df_curr.empty:
            print("❌ ไม่มีข้อมูลสำหรับวันที่ล่าสุด")
        else:
            report = generate_stock_report(df_prev, df_curr)
            output_file = f"stock_report_{week_date_prev}_vs_{week_date_curr}.csv"
            report.to_csv(output_file, index=False, encoding="utf-8-sig")
            print(f"✅ Report saved: {output_file}")

@app.get("/notifications")
def get_notifications():
    """
    Returns notification list (summary view).
    """
    week_dates_query = """
        SELECT DISTINCT week_date
        FROM stock_data
        ORDER BY week_date DESC
        LIMIT 2
    """
    week_dates = pd.read_sql(week_dates_query, engine)["week_date"].tolist()
    if len(week_dates) < 2:
        return {"error": "Not enough data"}

    week_date_curr, week_date_prev = week_dates[0], week_dates[1]
    df_prev = get_data(week_date_prev)
    df_curr = get_data(week_date_curr)

    if df_prev.empty or df_curr.empty:
        return {"error": "No stock data available"}

    report = generate_stock_report(df_prev, df_curr)
    return {"notifications": report.to_dict(orient="records")}


@app.get("/notification_detail")
def get_notification_detail(product: str = Query(..., description="Product name")):
    """
    Returns detailed metrics for one product.
    """
    week_dates_query = """
        SELECT DISTINCT week_date
        FROM stock_data
        ORDER BY week_date DESC
        LIMIT 2
    """
    week_dates = pd.read_sql(week_dates_query, engine)["week_date"].tolist()
    if len(week_dates) < 2:
        return {"error": "Not enough data"}

    week_date_curr, week_date_prev = week_dates[0], week_dates[1]
    df_prev = get_data(week_date_prev)
    df_curr = get_data(week_date_curr)

    if df_prev.empty or df_curr.empty:
        return {"error": "No stock data available"}

    report = generate_stock_report(df_prev, df_curr)
    row = report.loc[report["product"] == product]

    if row.empty:
        return {"error": f"Product '{product}' not found"}

    record = row.iloc[0].to_dict()

    # Adjust keys to match your frontend detail view
    detail = {
        "current_stock": record["stock"],
        "decrease_rate_per_week": f"{record['decrease_rate']}%/week",
        "time_to_run_out": f"{record['weeks_to_empty']} weeks",
        "min_stock": record["min_stock"],
        "buffer": record["buffer"],
        "recommended_restock": record["reorder_qty"],
    }

    return {"detail": detail}