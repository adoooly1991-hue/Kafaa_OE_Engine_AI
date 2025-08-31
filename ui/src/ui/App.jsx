import React, { useState } from 'react'

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8000'

export default function App() {
  const [loading, setLoading] = useState(false)
  const [resp, setResp] = useState(null)
  const [form, setForm] = useState({
    revenue: 1000000, cogs: 600000, depreciation: 30000, ga: 120000,
    finexp: 20000, inventory: 250000, curAssets: 400000, curLiab: 220000,
    salesTarget: 1200000, budgetCOGS: 580000, budgetGA: 110000, budgetDep: 28000, budgetFin: 18000, targetProfit: 150000
  })

  const compute = async () => {
    setLoading(true)
    try {
      const res = await fetch(`${API_BASE}/compute/finance`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(form)
      })
      const data = await res.json()
      setResp(data)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="shell">
      <div className="row" style={{justifyContent:'space-between', marginBottom:16}}>
        <div className="brand">
          <img src="https://dummyimage.com/120x28/ef4444/ffffff&text=KAFAA" alt="Kafaa"/>
          <span className="pill">OE Assessment Engine</span>
        </div>
        <div className="row">
          <a href="https://kafaa-oe-api.onrender.com/docs" target="_blank" rel="noreferrer">API Docs</a>
        </div>
      </div>

      <div className="grid">
        <div className="tile" style={{gridColumn:'span 12'}}>
          <div className="h1">Welcome, let’s size the opportunity</div>
          <div className="muted">This starter UI fetches Finance KPIs from the API. Replace with your full dashboard later.</div>
        </div>

        <div className="tile" style={{gridColumn:'span 4'}}>
          <div className="cardh">Inputs</div>
          {Object.entries(form).map(([k,v]) => (
            <div key={k} style={{marginBottom:10}}>
              <label>{k}</label>
              <input type="number" value={v} onChange={e => setForm({...form, [k]: Number(e.target.value)})} />
            </div>
          ))}
          <button className="btn" onClick={compute} disabled={loading}>{loading? 'Computing…':'Generate insights'}</button>
        </div>

        <div className="tile" style={{gridColumn:'span 8'}}>
          <div className="cardh">Results</div>
          {!resp && <div className="muted">No results yet. Enter inputs and click <b>Generate insights</b>.</div>}
          {resp && (
            <div className="grid" style={{gridTemplateColumns:'repeat(12,1fr)'}}>
              <div className="tile" style={{gridColumn:'span 4'}}>
                <div className="muted">Cash Ratio</div>
                <div className="kpi">{resp.kpis.cash_ratio.toFixed(2)}</div>
                <div className="muted">{resp.comments.cash_ratio}</div>
              </div>
              <div className="tile" style={{gridColumn:'span 4'}}>
                <div className="muted">Quick Ratio</div>
                <div className="kpi">{resp.kpis.quick_ratio.toFixed(2)}</div>
                <div className="muted">{resp.comments.quick_ratio}</div>
              </div>
              <div className="tile" style={{gridColumn:'span 4'}}>
                <div className="muted">Profit Margin</div>
                <div className="kpi">{(resp.kpis.profit_margin*100).toFixed(1)}%</div>
                <div className="muted">{resp.comments.profit_margin}</div>
              </div>

              <div className="tile" style={{gridColumn:'span 12'}}>
                <div className="cardh">Cost-Reduction Target (Year 1)</div>
                <div className="kpi">{resp.targets.year1_sar.toLocaleString()} SAR</div>
                <div className="muted">{resp.explanation}</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}