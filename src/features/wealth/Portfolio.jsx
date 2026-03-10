import { useState } from "react"
import SIPCalculator from "../tools/SIPCalculator"
import "./wealth.css"
import "./portfolio.css"

const CHIPS = ["Stocks", "Crypto", "Real Estate", "Cash"]

export default function Portfolio() {
  const [showSIP, setShowSIP] = useState(false)

  return (
    <>
      <div className="sp-page pf-page">
        <div className="sp-header">
          <div>
            <p className="sp-eyebrow">Wealth · Portfolio</p>
            <h1 className="sp-title">Portfolio</h1>
          </div>
        </div>

        <div className="sp-chips">
          {CHIPS.map((c) => <span key={c} className="sp-chip">{c}</span>)}
        </div>

        {/* Two-column layout */}
        <div className="pf-layout">

          {/* Left — main placeholder */}
          <div className="sp-placeholder pf-main">
            <span className="sp-ph-icon">◉</span>
            <span className="sp-ph-label">Portfolio Manager</span>
            <span className="sp-ph-sub">Monitor your investments</span>
          </div>

          {/* Right — quick tools */}
          <div className="pf-tools">
            <p className="pf-tools-heading">Quick Tools</p>

            {/* SIP — featured, grows to fill */}
            <button className="pf-tool-card" onClick={() => setShowSIP(true)}>
              <div className="pf-tool-top">
                <span className="pf-tool-icon">◈</span>
                <span className="pf-tool-arrow">→</span>
              </div>
              <span className="pf-tool-label">SIP Calculator</span>
              <span className="pf-tool-desc">
                Plan your systematic investments and estimate future corpus
              </span>
              {/* spacer pushes CTA to bottom */}
              <span style={{ flex: 1 }} />
              <span className="pf-tool-cta">Open Calculator →</span>
            </button>

            {/* Soon slots */}
            <div className="pf-tool-empty">
              <span className="pf-tool-empty-icon">◉</span>
              <span className="pf-tool-empty-label">EMI Calculator</span>
              <span className="pf-tool-empty-badge">Soon</span>
            </div>
            <div className="pf-tool-empty">
              <span className="pf-tool-empty-icon">◎</span>
              <span className="pf-tool-empty-label">FIRE Calculator</span>
              <span className="pf-tool-empty-badge">Soon</span>
            </div>

          </div>
        </div>
      </div>

      {showSIP && <SIPCalculator onClose={() => setShowSIP(false)} />}
    </>
  )
}