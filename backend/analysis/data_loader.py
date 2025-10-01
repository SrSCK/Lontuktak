import pandas as pd

def load_data(file_path: str) -> pd.DataFrame:
    """
    Load cleaned sales data from a CSV file.
    Required columns:
      Product_name, Product_SKU, Date, Year, Month,
      Total_quantity, Original price, Total_Amount(baht)
    """
    df = pd.read_csv(file_path)

    # Parse date if present (won't error if missing)
    if 'Date' in df.columns:
        df['Date'] = pd.to_datetime(df['Date'], errors='coerce')

    # Sort by Year/Month if present
    if {'Year', 'Month'}.issubset(df.columns):
        df = df.sort_values(['Year', 'Month']).reset_index(drop=True)

    return df
