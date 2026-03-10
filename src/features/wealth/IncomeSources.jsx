import "./wealth.css"

const CHIPS = ["Salary", "Freelance", "Dividends", "Other"]

export default function IncomeSources() {
  return (
    <div className="sp-page">
      <div className="sp-header">
        <div>
          <p className="sp-eyebrow">Wealth · Income</p>
          <h1 className="sp-title">Income</h1>
        </div>
      </div>
      <div className="sp-chips">
        {CHIPS.map((c) => <span key={c} className="sp-chip">{c}</span>)}
      </div>
      <div className="sp-placeholder">
        <span className="sp-ph-icon">◎</span>
        <span className="sp-ph-label">Income Sources</span>
        <span className="sp-ph-sub">Track all revenue streams</span>
      </div>
    </div>
  )
}