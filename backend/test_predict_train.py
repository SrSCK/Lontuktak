from Predict import forcast_loop, update_model_and_train, Evaluate
import joblib
from Auto_cleaning import auto_cleaning
from DB_server import engine

sales_path = r'D:\Lontuktak\Sales Order 1.xlsx'
product_path = r'D:\Lontuktak\Stock.xlsx'

df_base=auto_cleaning(sales_path, product_path, engine)
df_base.to_csv('cleaned_data.csv', index=False)
print("Cleaned data saved to cleaned_data.csv")
df_window_raw, df_window, base_model, X_train, y_train, X_test, y_test, product_sku_last = update_model_and_train(df_base)
base_model = base_model.fit(X_train, y_train, verbose=10)
#pint(df_window_raw.columns)
#print(df_window_raw.head())
#forecast_df, _ = forcast_loop(X_train, y_train, df_window_raw, product_sku_last, base_model, n_forecast=4, retrain_each_step=False)

Evaluate(X_train, y_train, X_test, y_test, model_file='xgb_sales_model.pkl')         