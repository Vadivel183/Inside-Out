import { useState, useEffect, useRef } from "react"
import { useTheme } from "../context/Themecontext"
import Logo from "./Logo"
import SIPCalculator from "../features/tools/SIPCalculator"
import "./Navbar.css"

const THEME_LABELS = { dark: "Dark", light: "Light", pink: "Pink" }

const TOOLS = [
  { id: "sip",      icon: "◈", label: "SIP Calculator",   desc: "Systematic investment planner" },
  { id: "emi",      icon: "◉", label: "EMI Calculator",    desc: "Loan & mortgage estimator"     },
  { id: "compound", icon: "◎", label: "Compound Interest", desc: "Growth over time"              },
  { id: "budget",   icon: "◇", label: "Budget Planner",    desc: "50/30/20 rule helper"          },
  { id: "networth", icon: "◆", label: "Net Worth Tracker", desc: "Assets minus liabilities"      },
  { id: "fire",     icon: "◑", label: "FIRE Calculator",   desc: "Financial independence number" },
]

export default function Navbar({ onLogout, sidebarOpen, onHamburger }) {
  const { theme, cycle }          = useTheme()
  const [time, setTime]           = useState("")
  const [toolsOpen, setToolsOpen] = useState(false)
  const [activeTool, setActiveTool] = useState(null)
  const dropRef = useRef(null)

  useEffect(() => {
    const tick = () => setTime(
      new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false })
    )
    tick()
    const id = setInterval(tick, 10000)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    const handler = (e) => {
      if (dropRef.current && !dropRef.current.contains(e.target)) setToolsOpen(false)
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [])

  return (
    <>
      <nav className="navbar">

        {/* ── Left: Hamburger (mobile) + Logo ── */}
        <div className="nb-left">
          <button
            className={`nb-hamburger ${sidebarOpen ? "open" : ""}`}
            onClick={onHamburger}
            aria-label="Toggle menu"
          >
            <span />
            <span />
            <span />
          </button>
          <Logo size="md" />
        </div>

        {/* ── Right cluster ── */}
        <div className="nb-right">

          <div className="nb-clock">
            <span className="nb-time">{time}</span>
            <span className="nb-tlabel">local</span>
          </div>

          <div className="nb-divider" />

          {/* Tools dropdown */}
          <div className="nb-tools" ref={dropRef}>
            <button
              className={`nb-tools-btn ${toolsOpen ? "open" : ""}`}
              onClick={() => setToolsOpen(o => !o)}
            >
              <span className="nb-tools-icon">⊞</span>
              <span className="nb-tools-text">Tools</span>
              <span className="nb-tools-chevron">{toolsOpen ? "▲" : "▼"}</span>
            </button>

            {toolsOpen && (
              <div className="nb-dropdown">
                <div className="nb-dropdown-header"><span>Financial Tools</span></div>
                <div className="nb-dropdown-grid">
                  {TOOLS.map(({ id, icon, label, desc }) => (
                    <button
                      key={id}
                      className={`nb-tool-item ${activeTool === id ? "active" : ""}`}
                      onClick={() => { setActiveTool(id); setToolsOpen(false) }}
                    >
                      <span className="nb-tool-icon">{icon}</span>
                      <span className="nb-tool-label">{label}</span>
                      <span className="nb-tool-desc">{desc}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="nb-divider" />

          <button className="nb-theme-btn" onClick={cycle} title="Switch theme">
            <span className={`nb-theme-swatch ${theme}`} />
            <span className="nb-theme-text">{THEME_LABELS[theme]}</span>
          </button>

          <button className="nb-exit" onClick={onLogout}>← Exit</button>

        </div>
      </nav>

      {activeTool === "sip" && <SIPCalculator onClose={() => setActiveTool(null)} />}
    </>
  )
}