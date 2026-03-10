import { useState } from "react"
import { useApp } from "../context/AppContext"
import { NAV } from "../context/navConfig"
import "./Sidebar.css"

export default function Sidebar({ className = "", onNavClick }) {
  const { view, setView } = useApp()

  const [collapsed, setCollapsed] = useState({})
  const toggle = (label) => setCollapsed(p => ({ ...p, [label]: !p[label] }))

  const activeSection = NAV.find(s => s.links.some(l => l.id === view))?.label

  const navigate = (id) => {
    setView(id)
    if (onNavClick) onNavClick()
  }

  return (
    <aside className={`sidebar ${className}`}>

      {/* ── Home ── */}
      <button
        className={`sb-home ${view === "dashboard" ? "active" : ""}`}
        onClick={() => navigate("dashboard")}
      >
        <span className="sb-home-icon">⌂</span>
        <span className="sb-home-lbl">Dashboard</span>
      </button>

      <div className="sb-rule" />

      {/* ── Sections ── */}
      {NAV.map(({ label, icon, links, overviewId }) => {
        const open          = !collapsed[label]
        const sectionActive = activeSection === label

        return (
          <div className="sb-section" key={label} data-s={label}>

            {/* Section header row */}
            <div className={`sb-head ${sectionActive ? "section-active" : ""}`}>
              <button
                className="sb-head-btn"
                onClick={() => {
                  navigate(overviewId)
                  setCollapsed(p => ({ ...p, [label]: false }))
                }}
              >
                <span className="sb-icon" data-s={label}>{icon}</span>
                <span className="sb-lbl"  data-s={label}>{label}</span>
              </button>

              <button className="sb-tog" onClick={() => toggle(label)}>
                {open ? "−" : "+"}
              </button>
            </div>

            {/* Sub-links */}
            <div className={`sb-links ${open ? "" : "closed"}`}>
              {links.map(({ id, label: linkLabel }) => (
                <button
                  key={id}
                  className={`sb-link ${view === id ? "active" : ""}`}
                  onClick={() => navigate(id)}
                >
                  {linkLabel}
                </button>
              ))}
            </div>

          </div>
        )
      })}

      <div className="sb-footer">
        <div className="sb-meta">
          {new Date().toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}<br />
          All systems nominal
        </div>
      </div>

    </aside>
  )
}