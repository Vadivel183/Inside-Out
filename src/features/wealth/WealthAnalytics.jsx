import "./wealth.css"

const CHIPS = ["Net Worth", "Cash Flow", "Forecast", "Reports"]

export default function WealthAnalytics() {
  return (
    <div className="sp-page">
      <div className="sp-header">
        <div>
          <p className="sp-eyebrow">Wealth · Analytics</p>
          <h1 className="sp-title">Analytics</h1>
        </div>
      </div>
      <div className="sp-chips">
        {CHIPS.map((c) => <span key={c} className="sp-chip">{c}</span>)}
      </div>
      <div className="sp-placeholder">
        <span className="sp-ph-icon">◇</span>
        <span className="sp-ph-label">Analytics Engine</span>
        <span className="sp-ph-sub">Visualise financial trends</span>
      </div>
    </div>
  )
}