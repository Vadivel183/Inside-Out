import "./health.css"
const CHIPS = ["Strength", "Cardio", "Flexibility", "Recovery"]
export default function Workout() {
  return (
    <div className="hs-page">
      <div className="hs-header">
        <div><p className="hs-eyebrow">Health · Workout</p><h1 className="hs-title">Workout</h1></div>
      </div>
      <div className="hs-chips">{CHIPS.map((c) => <span key={c} className="hs-chip">{c}</span>)}</div>
      <div className="hs-placeholder">
        <span className="hs-ph-icon">◈</span>
        <span className="hs-ph-label">Workout Tracker</span>
        <span className="hs-ph-sub">Log and track your training sessions</span>
      </div>
    </div>
  )
}