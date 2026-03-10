import "./Logo.css"

export default function Logo({ size = "md" }) {
  return (
    <div className={`logo logo--${size}`}>
      <svg className="logo-mark" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Outer circle */}
        <circle cx="18" cy="18" r="16.5" stroke="var(--aw)" strokeWidth="1" opacity="0.6"/>
        {/* Inner circle */}
        <circle cx="18" cy="18" r="9" stroke="var(--aw)" strokeWidth="1.2"/>
        {/* Arrow pointing outward — right */}
        <line x1="21" y1="18" x2="32" y2="18" stroke="var(--aw)" strokeWidth="1.2" strokeLinecap="round"/>
        <polyline points="28,14.5 32,18 28,21.5" stroke="var(--aw)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
        {/* Arrow pointing inward — left */}
        <line x1="4" y1="18" x2="15" y2="18" stroke="var(--aw)" strokeWidth="1.2" strokeLinecap="round" opacity="0.5"/>
        <polyline points="8,14.5 4,18 8,21.5" stroke="var(--aw)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity="0.5"/>
        {/* Center dot */}
        <circle cx="18" cy="18" r="2.2" fill="var(--aw)"/>
      </svg>

      <div className="logo-text">
        <span className="logo-text-inside">Inside</span>
        <span className="logo-text-dash">—</span>
        <span className="logo-text-out">Out</span>
      </div>
    </div>
  )
}