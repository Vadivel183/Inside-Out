import { useState, useEffect, useRef } from "react"
import "./SIPCalculator.css"

function formatINR(val) {
  if (val >= 10000000) return `₹${(val / 10000000).toFixed(2)} Cr`
  if (val >= 100000)   return `₹${(val / 100000).toFixed(2)} L`
  return `₹${Math.round(val).toLocaleString("en-IN")}`
}

function calcSIP(monthly, rate, years) {
  const n = years * 12
  const r = rate / 100 / 12
  if (r === 0) return { invested: monthly * n, returns: 0, total: monthly * n }
  const total    = monthly * ((Math.pow(1 + r, n) - 1) / r) * (1 + r)
  const invested = monthly * n
  return { invested, returns: total - invested, total }
}

export default function SIPCalculator({ onClose }) {
  const [monthly, setMonthly] = useState(10000)
  const [rate,    setRate]    = useState(12)
  const [years,   setYears]   = useState(10)
  const overlayRef = useRef(null)

  const { invested, returns, total } = calcSIP(monthly, rate, years)
  const returnPct = total > 0 ? (returns / total) * 100 : 0
  const investedPct = 100 - returnPct

  // Close on overlay click
  const handleOverlay = (e) => {
    if (e.target === overlayRef.current) onClose()
  }

  // Close on Escape
  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") onClose() }
    document.addEventListener("keydown", handler)
    return () => document.removeEventListener("keydown", handler)
  }, [onClose])

  return (
    <div className="sip-overlay" ref={overlayRef} onClick={handleOverlay}>
      <div className="sip-modal">

        {/* Header */}
        <div className="sip-header">
          <div>
            <p className="sip-eyebrow">Financial Tools</p>
            <h2 className="sip-title">SIP Calculator</h2>
          </div>
          <button className="sip-close" onClick={onClose}>✕</button>
        </div>

        <div className="sip-body">

          {/* ── Inputs ── */}
          <div className="sip-inputs">

            <div className="sip-field">
              <div className="sip-field-top">
                <label className="sip-label">Monthly Investment</label>
                <span className="sip-value">₹{Number(monthly).toLocaleString("en-IN")}</span>
              </div>
              <input
                type="range" className="sip-range"
                min={500} max={200000} step={500}
                value={monthly}
                onChange={e => setMonthly(+e.target.value)}
              />
              <div className="sip-range-bounds"><span>₹500</span><span>₹2,00,000</span></div>
            </div>

            <div className="sip-field">
              <div className="sip-field-top">
                <label className="sip-label">Expected Annual Return</label>
                <span className="sip-value">{rate}%</span>
              </div>
              <input
                type="range" className="sip-range"
                min={1} max={30} step={0.5}
                value={rate}
                onChange={e => setRate(+e.target.value)}
              />
              <div className="sip-range-bounds"><span>1%</span><span>30%</span></div>
            </div>

            <div className="sip-field">
              <div className="sip-field-top">
                <label className="sip-label">Time Period</label>
                <span className="sip-value">{years} yr{years > 1 ? "s" : ""}</span>
              </div>
              <input
                type="range" className="sip-range"
                min={1} max={40} step={1}
                value={years}
                onChange={e => setYears(+e.target.value)}
              />
              <div className="sip-range-bounds"><span>1 yr</span><span>40 yrs</span></div>
            </div>

          </div>

          {/* ── Results ── */}
          <div className="sip-results">

            {/* Donut chart */}
            <div className="sip-donut-wrap">
              <svg className="sip-donut" viewBox="0 0 120 120">
                {/* Background track */}
                <circle cx="60" cy="60" r="48" fill="none" stroke="var(--border)" strokeWidth="14"/>
                {/* Returns arc */}
                <circle
                  cx="60" cy="60" r="48"
                  fill="none"
                  stroke="var(--aw)"
                  strokeWidth="14"
                  strokeDasharray={`${returnPct * 3.016} ${100 * 3.016}`}
                  strokeDashoffset={investedPct * 3.016 * -1}
                  strokeLinecap="round"
                  style={{ transition: "stroke-dasharray 0.6s cubic-bezier(0.16,1,0.3,1)" }}
                />
                {/* Invested arc */}
                <circle
                  cx="60" cy="60" r="48"
                  fill="none"
                  stroke="var(--surface2)"
                  strokeWidth="14"
                  strokeDasharray={`${investedPct * 3.016} ${100 * 3.016}`}
                  strokeLinecap="round"
                  style={{ transition: "stroke-dasharray 0.6s cubic-bezier(0.16,1,0.3,1)" }}
                />
              </svg>
              <div className="sip-donut-center">
                <span className="sip-donut-total">{formatINR(total)}</span>
                <span className="sip-donut-label">Total Value</span>
              </div>
            </div>

            {/* Stats */}
            <div className="sip-stats">
              <div className="sip-stat">
                <span className="sip-stat-dot invested" />
                <div>
                  <span className="sip-stat-label">Invested</span>
                  <span className="sip-stat-val">{formatINR(invested)}</span>
                </div>
              </div>
              <div className="sip-stat">
                <span className="sip-stat-dot returns" />
                <div>
                  <span className="sip-stat-label">Est. Returns</span>
                  <span className="sip-stat-val returns">{formatINR(returns)}</span>
                </div>
              </div>
              <div className="sip-stat-divider" />
              <div className="sip-stat">
                <span className="sip-stat-dot total" />
                <div>
                  <span className="sip-stat-label">Total Value</span>
                  <span className="sip-stat-val total">{formatINR(total)}</span>
                </div>
              </div>

              {/* Progress bar */}
              <div className="sip-bar-wrap">
                <div className="sip-bar-track">
                  <div
                    className="sip-bar-fill"
                    style={{ width: `${investedPct}%`, transition: "width 0.6s cubic-bezier(0.16,1,0.3,1)" }}
                  />
                </div>
                <div className="sip-bar-labels">
                  <span>Invested {investedPct.toFixed(0)}%</span>
                  <span>Returns {returnPct.toFixed(0)}%</span>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  )
}