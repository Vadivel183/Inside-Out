import { useState } from "react"
import { useAuth } from "../context/AuthContext"
import { api } from "../config/api"

export default function Login({ onNavigate }) {
  const { login }   = useAuth()
  const [form, setForm]     = useState({ email: "", password: "" })
  const [error, setError]   = useState("")
  const [loading, setLoading] = useState(false)
  const [showPw, setShowPw] = useState(false)

  const set = (k) => (e) => setForm(p => ({ ...p, [k]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)
    try {
      const data = await api("/api/auth/login", {
        method: "POST",
        body: JSON.stringify(form),
      })
      login(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
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
              Welcome<br /><em>back.</em>
            </h2>
            <p className="at-sub">
              Your personal OS is waiting. Sign in to continue tracking, reflecting and growing.
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

          {error && (
            <div style={{ color: "#c87a7a", fontSize: "11px", marginBottom: "12px" }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="auth-fields">

              <div className="auth-field">
                <label className="auth-label">Email</label>
                <div className="auth-input-wrap">
                  <input
                    className="auth-input" type="email"
                    placeholder="you@example.com"
                    value={form.email} onChange={set("email")} required
                  />
                  <span className="auth-input-line" />
                </div>
              </div>

              <div className="auth-field">
                <label className="auth-label">Password</label>
                <div className="auth-input-wrap auth-input-toggle">
                  <input
                    className="auth-input"
                    type={showPw ? "text" : "password"}
                    placeholder="Your password"
                    value={form.password} onChange={set("password")} required
                  />
                  <span className="auth-input-line" />
                  <button type="button" className="auth-toggle-btn"
                    onClick={() => setShowPw(p => !p)}>
                    {showPw ? "hide" : "show"}
                  </button>
                </div>
              </div>

            </div>

            <div className="auth-meta-row">
              <span />
              <button type="button" className="auth-text-link"
                onClick={() => onNavigate("forgot")}>
                Forgot password?
              </button>
            </div>

            <button type="submit" className="auth-btn" disabled={loading}>
              {loading ? "Signing in..." : "Sign in →"}
            </button>
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