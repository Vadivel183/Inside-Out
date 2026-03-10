import "./wealth.css"

const CHIPS = ["Loans", "Credit Cards", "Mortgage", "Other"]

export default function Liability() {
  return (
    <div className="sp-page">
      <div className="sp-header">
        <div>
          <p className="sp-eyebrow">Wealth · Liability</p>
          <h1 className="sp-title">Liability</h1>
        </div>
      </div>
      <div className="sp-chips">
        {CHIPS.map((c) => <span key={c} className="sp-chip">{c}</span>)}
      </div>
      <div className="sp-placeholder">
        <span className="sp-ph-icon">◇</span>
        <span className="sp-ph-label">Liability Tracker</span>
        <span className="sp-ph-sub">Track debts, loans and obligations</span>
      </div>
    </div>
  )
}