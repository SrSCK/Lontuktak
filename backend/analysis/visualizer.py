import pandas as pd
import matplotlib.pyplot as plt
import matplotlib.font_manager as fm
import textwrap
from typing import Optional

# -----------------------------
# Thai font setup
# -----------------------------
def _use_thai_font():
    candidates = [
        "Leelawadee UI", "Leelawadee", "Tahoma",
        "Noto Sans Thai", "TH Sarabun New", "Sarabun",
        "Cordia New", "Angsana New"
    ]
    available = {f.name for f in fm.fontManager.ttflist}
    for name in candidates:
        if name in available:
            plt.rcParams["font.family"] = name
            plt.rcParams["axes.unicode_minus"] = False
            print(f"[Visualizer] Using font: {name}")
            return
    print("[Visualizer] Thai font not found. Install 'Noto Sans Thai' or 'TH Sarabun New' and rerun.")
_use_thai_font()

def _wrap_labels(series: pd.Series, width: int = 40):
    return [textwrap.fill(str(s), width=width) for s in series.fillna("")]

# -----------------------------
# Grouped bar chart (size mix per month)
# -----------------------------
def plot_size_mix_grouped_bars(pivot_df: pd.DataFrame, title: str = "", save_path: Optional[str] = None):
    """
    Grouped bar chart:
      index = YearMonth, columns = Size, values = quantity.
    Expects a pivot from data_analyzer.size_mix_pivot().
    """
    if pivot_df is None or pivot_df.empty:
        print("[plot_size_mix_grouped_bars] Nothing to plot.")
        return

    ax = pivot_df.plot(kind="bar", figsize=(12, 6))
    ax.set_title(title[:90] + ("…" if len(title) > 90 else ""))
    ax.set_xlabel("Month")
    ax.set_ylabel("Quantity")
    ax.legend(title="Size", bbox_to_anchor=(1.02, 1), loc="upper left")
    plt.xticks(rotation=45, ha="right")
    plt.tight_layout()
    if save_path:
        plt.savefig(save_path, dpi=150, bbox_inches="tight")
    plt.show()
