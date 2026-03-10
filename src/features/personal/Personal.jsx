import { useApp } from "../../context/AppContext"
import "./personal.css"

const CARDS = [
  { id: "p-goals",    label: "Goals",    icon: "◈", desc: "Set and track life goals",    stat: "0",  statLbl: "active"  },
  { id: "p-learning", label: "Learning", icon: "◉", desc: "Books, courses & skills",     stat: "0",  statLbl: "in progress" },
]

export default function Personal() {
  const { setView } = useApp()
  return (
    <div className="po-page">
      <div className="po-header">
        <div>
          <p className="po-eyebrow">Personal</p>
          <h1 className="po-title">Overview</h1>
        </div>
        <span className="po-badge">2 modules</span>
      </div>
      <div className="po-grid">
        {CARDS.map(({ id, label, icon, desc, stat, statLbl }) => (
          <div key={id} className="po-card" onClick={() => setView(id)}>
            <div className="pc-top">
              <span className="pc-icon">{icon}</span>
              <span className="pc-arrow">→</span>
            </div>
            <div>
              <h2 className="pc-label">{label}</h2>
              <p className="pc-desc">{desc}</p>
            </div>
            <div className="pc-bottom">
              <span className="pc-stat">{stat}</span>
              <span className="pc-slbl">{statLbl}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}