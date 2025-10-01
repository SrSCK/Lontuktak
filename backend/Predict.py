import pandas as pd
import numpy as np
import os
import joblib
from xgboost import XGBRegressor
from sklearn.model_selection import TimeSeriesSplit
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score, mean_absolute_percentage_error
import optuna
import time
import copy
#df = ""
# -----------------------------
# Parameters
# -----------------------------
ROLLING_WINDOW = 12        # Last 12 months of data
TEST_MONTHS = 6            # Last 6 months for validation
N_FORECAST = 1             # Forecast next n months
MODEL_FILE = "xgb_sales_model.pkl"

# -----------------------------
# Feature Engineering Functions
# -----------------------------
def create_lags(data, lags=[1, 12]):
    for lag in lags:
        data[f'Total_quantity_lag_{lag}'] = data.groupby('Product_SKU')['Total_quantity'].shift(lag)
    return data

def create_rolling(data, windows=[3,6]):
    for window in windows:
        data[f'Total_quantity_roll_mean_{window}'] = data.groupby('Product_SKU')['Total_quantity'].shift(1).rolling(window).mean()
    return data

# -----------------------------
# Hyperparameter Tuning
# -----------------------------
def tune_xgboost(X, y):
    def objective(trial):
        params = {
            "n_estimators": trial.suggest_int("n_estimators", 500, 1500),
            "max_depth": trial.suggest_int("max_depth", 3, 10),
            "learning_rate": trial.suggest_float("learning_rate", 0.01, 0.2),
            "subsample": trial.suggest_float("subsample", 0.6, 1.0),
            "colsample_bytree": trial.suggest_float("colsample_bytree", 0.6, 1.0),
            "reg_alpha": trial.suggest_float("reg_alpha", 0.0, 1.0),
            "reg_lambda": trial.suggest_float("reg_lambda", 0.0, 5.0),
            "random_state": 42,
            "n_jobs": 1
        }
        model = XGBRegressor(**params)
        tscv = TimeSeriesSplit(n_splits=3)
        scores = []
        for train_idx, valid_idx in tscv.split(X):
            X_train, X_valid = X.iloc[train_idx], X.iloc[valid_idx]
            y_train, y_valid = y.iloc[train_idx], y.iloc[valid_idx]
            model.fit(X_train, y_train, eval_set=[(X_valid, y_valid)], verbose=False)
            preds = model.predict(X_valid)
            scores.append(mean_absolute_error(y_valid, preds))
        return np.mean(scores)
    
    study = optuna.create_study(direction="minimize")
    study.optimize(objective, n_trials=30)
    
    print("Best params:", study.best_params)
    print("Best MAE:", study.best_value)
    
    best_model = XGBRegressor(**study.best_params, random_state=42, n_jobs=1)
    best_model.fit(X, y)
    return best_model

# -----------------------------
# Model Training
# -----------------------------
def update_model_and_train(df):
    start_time = time.time()
    print("Starting model update and training...")

    # Rolling window
    latest_date = df['Date'].max()
    df_window = df[df['Date'] > latest_date - pd.DateOffset(months=ROLLING_WINDOW)].copy()

    # Drop rows with missing SKU
    df_window = df_window.dropna(subset=['Product_SKU'])
    
    # Save SKU for forecast reconstruction
    product_sku_last = df_window[df_window['Date'] == df_window['Date'].max()]['Product_SKU'].values

    # Feature engineering
    df_window = create_lags(df_window)
    df_window = create_rolling(df_window)
    df_window.fillna(0, inplace=True)
    df_window = pd.get_dummies(df_window, columns=['Product_SKU'], drop_first=True)

    # Train/Test split
    train = df_window[df_window['Date'] < df_window['Date'].max() - pd.DateOffset(months=TEST_MONTHS)]
    test = df_window[df_window['Date'] >= df_window['Date'].max() - pd.DateOffset(months=TEST_MONTHS)]
    X_train = train.drop(['Total_quantity','Year','Month','Date'], axis=1)
    y_train = train['Total_quantity']
    X_test = test.drop(['Total_quantity','Year','Month','Date'], axis=1)
    y_test = test['Total_quantity']

    # Load or train model
    if os.path.exists(MODEL_FILE):
        print("Loading existing model...")
        base_model = joblib.load(MODEL_FILE)
    else:
        print("Tuning and training new model...")
        base_model = tune_xgboost(X_train, y_train)
    
    # Train model once
    base_model.fit(X_train, y_train, verbose=10)
    joblib.dump(base_model, MODEL_FILE)
    print(f"Model saved to {MODEL_FILE}")

    # Validation
    y_pred = base_model.predict(X_test)
    mae = mean_absolute_error(y_test, y_pred)
    print("Validation MAE:", mae)
    
    end_time = time.time()
    print(f"Process completed in {end_time - start_time:.2f} seconds.")

    return df_window, base_model, X_train, y_train, X_test, y_test, product_sku_last

# -----------------------------
# Forecasting
# -----------------------------
def forcast_loop(X_train, y_train, df_window, product_sku_last, base_model, n_forecast=N_FORECAST, retrain_each_step=True):
    start_time = time.time()
    print("Starting forecasting loop...")

    future = df_window[df_window['Date'] == df_window['Date'].max()].copy()
    future['Product_SKU'] = product_sku_last
    long_forecast_rows = []
    current_model = copy.deepcopy(base_model)

    for i in range(n_forecast):
        future['Date'] = future['Date'] + pd.DateOffset(months=1)
        forecast_date = future['Date'].iloc[0]
        future['Year'] = future['Date'].dt.year
        future['Month'] = future['Date'].dt.month
        future['Total_quantity_lag_1'] = future['Total_quantity']

        future['Total_quantity_lag_12'] = future.groupby('Product_SKU')['Total_quantity'].shift(12).fillna(0)
        future['Total_quantity_roll_mean_3'] = future.groupby('Product_SKU')['Total_quantity'].shift(1).rolling(3).mean().fillna(0)

        X_future = future.drop(['Total_quantity','Year','Month','Product_SKU'], axis=1)
        X_future = pd.get_dummies(X_future)
        for col in X_train.columns:
            if col not in X_future.columns:
                X_future[col] = 0
        X_future = X_future[X_train.columns]

        y_pred_future = current_model.predict(X_future)
        y_pred_future = np.maximum(np.round(y_pred_future).astype(int), 0)
        future['Total_quantity'] = y_pred_future

        for sku, pred in zip(product_sku_last, y_pred_future):
            # get last known actuals for this SKU
            last_row = df_window[df_window['Product_SKU'] == sku].sort_values('Date').iloc[-1]
            current_sales = int(last_row['Total_quantity'])
            current_date_col = last_row['Date']

            long_forecast_rows.append({
                "Product_SKU": sku,
                "forecast_date": forecast_date,
                "predicted_sales": int(pred),
                "current_sales": current_sales,
                "current_date_col": current_date_col
            })


        print(f"✅ {i+1} month prediction ({forecast_date.date()}): {y_pred_future}")

        if retrain_each_step:
            X_train = pd.concat([X_train, X_future], axis=0)
            y_train = pd.concat([y_train, pd.Series(y_pred_future)], axis=0)
            current_model.fit(X_train, y_train, xgb_model=current_model.get_booster())

    long_forecast = pd.DataFrame(long_forecast_rows)
    return long_forecast

# -----------------------------
# Evaluation
# -----------------------------
def Evaluate(X_train, y_train, X_test, y_test, model_file=MODEL_FILE):
    model = joblib.load(model_file)
    y_pred = model.predict(X_test)
    mae = mean_absolute_error(y_test, y_pred)
    mape = mean_absolute_percentage_error(y_test, y_pred)
    rmse = np.sqrt(mean_squared_error(y_test, y_pred))
    r2 = r2_score(y_test, y_pred)
    print(f"MAE: {mae}\nMAPE: {mape}\nRMSE: {rmse}\nR2: {r2}")

import matplotlib.pyplot as plt

# -----------------------------
# Plot Validation Results
# -----------------------------
def plot_validation(X_test, y_test, model_file=MODEL_FILE):
    # Load model and predict
    model = joblib.load(model_file)
    y_pred_test = model.predict(X_test)

    # Plot
    plt.figure(figsize=(12, 6))
    plt.plot(y_test.values, label='Actual', marker='o')
    plt.plot(y_pred_test, label='Predicted', marker='x')
    plt.title("Actual vs Predicted Total_quantity (Validation)")
    plt.xlabel("Index")
    plt.ylabel("Total_quantity")
    plt.legend()
    plt.grid(True)
    plt.show()