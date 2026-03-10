import "./personal.css"
const CHIPS = ["Books", "Courses", "Skills", "Notes"]
export default function Learning() {
  return (
    <div className="ps-page">
      <div className="ps-header">
        <div><p className="ps-eyebrow">Personal · Learning</p><h1 className="ps-title">Learning</h1></div>
      </div>
      <div className="ps-chips">{CHIPS.map((c) => <span key={c} className="ps-chip">{c}</span>)}</div>
      <div className="ps-placeholder">
        <span className="ps-ph-icon">◉</span>
        <span className="ps-ph-label">Learning Log</span>
        <span className="ps-ph-sub">Track books, courses and new skills</span>
      </div>
    </div>
  )
}