import { useApp } from "../../context/AppContext"
import "./wealth.css"

const CARDS = [
  { id: "expense",   label: "Expense",   icon: "◈", desc: "Track spending & budgets",  stat: "$0.00", statLbl: "this month"   },
  { id: "portfolio", label: "Portfolio", icon: "◉", desc: "Investments & holdings",    stat: "$0.00", statLbl: "total value"  },
  { id: "income",    label: "Income",    icon: "◎", desc: "Earnings & revenue",        stat: "$0.00", statLbl: "this month"   },
  { id: "analytics", label: "Analytics", icon: "◇", desc: "Trends & insights",        stat: "—",     statLbl: "last updated" },
  { id: "liability", label: "Liability", icon: "◆", desc: "Debts, loans & obligations", stat: "$0.00", statLbl: "total owed"   },
]

export default function Wealth() {
  const { setView } = useApp()
  return (
    <div className="wo-page">
      <div className="wo-header">
        <div>
          <p className="wo-eyebrow">Wealth</p>
          <h1 className="wo-title">Overview</h1>
        </div>
        <span className="wo-badge">5 modules</span>
      </div>
      <div className="wo-grid">
        {CARDS.map(({ id, label, icon, desc, stat, statLbl }) => (
          <div key={id} className="wo-card" onClick={() => setView(id)}>
            <div className="wc-top">
              <span className="wc-icon">{icon}</span>
              <span className="wc-arrow">→</span>
            </div>
            <div>
              <h2 className="wc-label">{label}</h2>
              <p className="wc-desc">{desc}</p>
            </div>
            <div className="wc-bottom">
              <span className="wc-stat">{stat}</span>
              <span className="wc-slbl">{statLbl}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}