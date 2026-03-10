import "./health.css"
const CHIPS = ["Calories", "Macros", "Meals", "Water"]
export default function Nutrition() {
  return (
    <div className="hs-page">
      <div className="hs-header">
        <div><p className="hs-eyebrow">Health · Nutrition</p><h1 className="hs-title">Nutrition</h1></div>
      </div>
      <div className="hs-chips">{CHIPS.map((c) => <span key={c} className="hs-chip">{c}</span>)}</div>
      <div className="hs-placeholder">
        <span className="hs-ph-icon">◉</span>
        <span className="hs-ph-label">Nutrition Log</span>
        <span className="hs-ph-sub">Track meals, macros and hydration</span>
      </div>
    </div>
  )
}