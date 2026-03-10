import { useState } from "react"
import "./auth.css"

export default function Login({ onNavigate, onLogin }) {
  const [showPw, setShowPw]     = useState(false)
  const [remember, setRemember] = useState(false)
  const [email, setEmail]       = useState("")
  const [password, setPassword] = useState("")

  const handleSubmit = (e) => {
    e.preventDefault()
    // TODO: call your API here, then:
    onLogin()
  }

  return (
    <div className="auth-root">
      <div className="auth-card">

        {/* ── Left — branding ── */}
        <div className="auth-left">
          <div className="auth-logo">
            <span className="al-inside">Inside</span>
            <span className="al-dash">—</span>
            <span className="al-out">Out</span>
          </div>

          <div className="auth-tagline">
            <h2 className="at-headline">
              Your life,<br /><em>measured.</em>
            </h2>
            <p className="at-sub">
              Track wealth, health and personal growth — all in one refined personal OS.
            </p>
          </div>

          <div className="auth-chips">
            <span className="auth-chip w">Wealth</span>
            <span className="auth-chip h">Health</span>
            <span className="auth-chip p">Personal</span>
          </div>
        </div>

        {/* ── Right — form ── */}
        <div className="auth-right">
          <div className="auth-form-header">
            <p className="auth-eyebrow">Welcome back</p>
            <h1 className="auth-heading">Sign in</h1>
            <p className="auth-sub">Enter your credentials to continue.</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="auth-fields">
              <div className="auth-field">
                <label className="auth-label">Email</label>
                <div className="auth-input-wrap">
                  <input
                    className="auth-input" type="email" placeholder="you@example.com"
                    value={email} onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email" required
                  />
                  <span className="auth-input-line" />
                </div>
              </div>

              <div className="auth-field">
                <label className="auth-label">Password</label>
                <div className="auth-input-wrap auth-input-toggle">
                  <input
                    className="auth-input" type={showPw ? "text" : "password"} placeholder="••••••••"
                    value={password} onChange={(e) => setPassword(e.target.value)}
                    autoComplete="current-password" required
                  />
                  <span className="auth-input-line" />
                  <button type="button" className="auth-toggle-btn" onClick={() => setShowPw(p => !p)}>
                    {showPw ? "hide" : "show"}
                  </button>
                </div>
              </div>
            </div>

            <div className="auth-meta-row">
              <label className="auth-check-label">
                <input type="checkbox" className="auth-checkbox" checked={remember} onChange={e => setRemember(e.target.checked)} />
                Remember me
              </label>
              <button type="button" className="auth-text-link" onClick={() => onNavigate("forgot")}>
                Forgot password?
              </button>
            </div>

            <button type="submit" className="auth-btn">Sign in →</button>
          </form>

          <div className="auth-switch">
            Don't have an account?
            <button onClick={() => onNavigate("register")}>Create one</button>
          </div>
        </div>

      </div>
    </div>
  )
}