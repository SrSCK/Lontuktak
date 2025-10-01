# app.py
import os
import pandas as pd

from data_loader import load_data
from data_analyzer import (
    size_mix_pivot, performance_table, best_sellers_by_month, total_income_table
)
from visualizer import plot_size_mix_grouped_bars

# ---- CONFIG ----
FILE_PATH = r"C:\Users\soraw\Desktop\Lontuktak\startup\dataset\sorted_combined_summary_output.csv"
OUT_DIR = "outputs"
os.makedirs(OUT_DIR, exist_ok=True)

def run_historical_sales(df: pd.DataFrame):
    print("\n=== Historical Sales (Grouped Bars) ===")
    sku = input("Enter SKU (or Base SKU): ").strip()

    # FIX: no color keyword argument anymore
    pivot = size_mix_pivot(df, sku_or_base=sku)
    if pivot.empty:
        print("No data found for that selection.")
        return

    title = f"Size Mix per Month — {sku}"
    plot_size_mix_grouped_bars(
        pivot, title=title, save_path=os.path.join(OUT_DIR, "historical_size_mix.png")
    )
    pivot.to_csv(os.path.join(OUT_DIR, "historical_size_mix_table.csv"), encoding="utf-8-sig")
    print("Saved table to outputs/historical_size_mix_table.csv and chart to outputs/historical_size_mix.png")

def run_performance_comparison(df: pd.DataFrame):
    print("\n=== Performance Comparison (Table; max 3 SKUs) ===")
    items = input("Enter up to 3 SKUs, comma-separated: ").strip()
    sku_list = [s.strip() for s in items.split(",") if s.strip()]
    if not sku_list:
        print("No SKUs provided.")
        return
    if len(sku_list) > 3:
        print("More than 3 entered; only the first 3 will be used.")
        sku_list = sku_list[:3]

    tbl = performance_table(df, sku_list)
    if tbl.empty:
        print("No matching SKUs found.")
        return

    print("\nPerformance Table:")
    print(tbl.to_string(index=False))
    tbl.to_csv(os.path.join(OUT_DIR, "performance_comparison.csv"), index=False, encoding="utf-8-sig")
    print("Saved to outputs/performance_comparison.csv")

def run_best_sellers(df: pd.DataFrame):
    print("\n=== Best Sellers (Top 10) — by month ===")
    ym = input("Enter month as YYYY-MM (e.g., 2025-06): ").strip()
    try:
        year, month = map(int, ym.split("-"))
    except Exception:
        print("Invalid format. Use YYYY-MM.")
        return

    top10 = best_sellers_by_month(df, year, month, top_n=10)
    if top10.empty:
        print("No data for that month.")
        return

    print("\nTop 10 Best Sellers (with Best Size):")
    print(top10.to_string(index=False))
    fn = os.path.join(OUT_DIR, f"best_sellers_{year}-{month:02d}.csv")
    top10.to_csv(fn, index=False, encoding="utf-8-sig")
    print(f"Saved to {fn}")

def run_total_income(df: pd.DataFrame):
    print("\n=== Total Income (All SKUs) ===")
    tbl, grand_total = total_income_table(df)
    print(f"Grand Total Revenue: {grand_total:,.2f} Baht\n")
    print(tbl.head(20).to_string(index=False))  # preview first 20
    tbl.to_csv(os.path.join(OUT_DIR, "total_income_all_skus.csv"), index=False, encoding="utf-8-sig")
    print("Saved to outputs/total_income_all_skus.csv")

def main():
    df = load_data(FILE_PATH)
    print(f"Loaded {len(df):,} rows")

    while True:
        print("\nSelect an action:")
        print("  1) Historical sales (grouped bars by size) – choose SKU/Base")
        print("  2) Performance comparison table (up to 3 SKUs)")
        print("  3) Best sellers (Top 10) by month (table + best size)")
        print("  4) Total income (table for all SKUs)")
        print("  0) Exit")
        choice = input("Your choice: ").strip()

        if choice == "1":
            run_historical_sales(df)
        elif choice == "2":
            run_performance_comparison(df)
        elif choice == "3":
            run_best_sellers(df)
        elif choice == "4":
            run_total_income(df)
        elif choice == "0":
            print("Bye!")
            break
        else:
            print("Invalid choice. Try again.")

if __name__ == "__main__":
    main()
