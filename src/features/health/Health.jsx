import { useApp } from "../../context/AppContext"
import "./health.css"

const CARDS = [
  { id: "h-workout",   label: "Workout",   icon: "◈", desc: "Log workouts & progress", stat: "0",     statLbl: "sessions"   },
  { id: "h-nutrition", label: "Nutrition", icon: "◉", desc: "Track meals & calories",  stat: "0 kcal",statLbl: "today"      },
  { id: "h-routine",   label: "Routine",   icon: "◎", desc: "Track daily habits & care",stat: "0",     statLbl: "routines"   },
]

export default function Health() {
  const { setView } = useApp()
  return (
    <div className="ho-page">
      <div className="ho-header">
        <div>
          <p className="ho-eyebrow">Health</p>
          <h1 className="ho-title">Overview</h1>
        </div>
        <span className="ho-badge">3 modules</span>
      </div>
      <div className="ho-grid">
        {CARDS.map(({ id, label, icon, desc, stat, statLbl }) => (
          <div key={id} className="ho-card" onClick={() => setView(id)}>
            <div className="hc-top">
              <span className="hc-icon">{icon}</span>
              <span className="hc-arrow">→</span>
            </div>
            <div>
              <h2 className="hc-label">{label}</h2>
              <p className="hc-desc">{desc}</p>
            </div>
            <div className="hc-bottom">
              <span className="hc-stat">{stat}</span>
              <span className="hc-slbl">{statLbl}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}