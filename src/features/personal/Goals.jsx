import "./personal.css"
const CHIPS = ["Short-term", "Long-term", "Habits", "Milestones"]
export default function Goals() {
  return (
    <div className="ps-page">
      <div className="ps-header">
        <div><p className="ps-eyebrow">Personal · Goals</p><h1 className="ps-title">Goals</h1></div>
      </div>
      <div className="ps-chips">{CHIPS.map((c) => <span key={c} className="ps-chip">{c}</span>)}</div>
      <div className="ps-placeholder">
        <span className="ps-ph-icon">◈</span>
        <span className="ps-ph-label">Goals Tracker</span>
        <span className="ps-ph-sub">Define and pursue meaningful goals</span>
      </div>
    </div>
  )
}