from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

import os

app = FastAPI(title="Kafaa OE API", version="0.1.0")

allow_origins = os.getenv("ALLOW_ORIGINS", "*").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=allow_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class FinanceIn(BaseModel):
    revenue: float
    cogs: float
    depreciation: float
    ga: float
    finexp: float
    inventory: float
    curAssets: float
    curLiab: float
    salesTarget: float
    budgetCOGS: float
    budgetGA: float
    budgetDep: float
    budgetFin: float
    targetProfit: float

@app.get("/healthz")
def health():
    return {"ok": True}

@app.post("/compute/finance")
def compute(fin: FinanceIn):
    # Basic KPIs
    cash_ratio = 0 if fin.curLiab==0 else (fin.curAssets - fin.inventory) / fin.curLiab
    quick_ratio = 0 if fin.curLiab==0 else fin.curAssets / fin.curLiab
    profit = fin.revenue - (fin.cogs + fin.depreciation + fin.ga + fin.finexp)
    profit_margin = 0 if fin.revenue==0 else profit / fin.revenue

    # Targets
    target_profit = fin.targetProfit
    gap = max(0.0, target_profit - profit)

    # Simple 3-year glidepath (60/30/10 split) as example
    y1 = round(gap * 0.6, 2)
    y2 = round(gap * 0.3, 2)
    y3 = round(gap * 0.1, 2)

    comments = {
        "cash_ratio": "≥ 1.0 is healthy for immediate liabilities; < 1.0 indicates potential cash tightness.",
        "quick_ratio": "≥ 1.0 suggests you can cover short-term obligations without selling inventory.",
        "profit_margin": "Benchmarks vary by industry; rising margin YoY is the priority.",
    }

    return {
        "kpis": {
            "cash_ratio": cash_ratio,
            "quick_ratio": quick_ratio,
            "profit_margin": profit_margin,
            "profit_abs": profit
        },
        "targets": {
            "year1_sar": y1,
            "year2_sar": y2,
            "year3_sar": y3,
            "gap_to_target": gap
        },
        "explanation": "Glidepath distributes the profit gap over three years (60/30/10). Adjust later per client strategy.",
        "comments": comments
    }