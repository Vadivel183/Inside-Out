import { useState } from "react"
import "./auth.css"

function getStrength(pw) {
  if (!pw) return 0
  let s = 0
  if (pw.length >= 8)          s++
  if (/[A-Z]/.test(pw))        s++
  if (/[0-9]/.test(pw))        s++
  if (/[^A-Za-z0-9]/.test(pw)) s++
  return s
}
const STR_LABEL = ["", "Weak", "Fair", "Good", "Strong"]
const STR_CLASS = ["", "weak", "fair", "fair", "strong"]

export default function Register({ onNavigate, onLogin }) {
  const [showPw, setShowPw] = useState(false)
  const [form, setForm]     = useState({ firstName: "", lastName: "", email: "", password: "", confirm: "" })
  const set = (k) => (e) => setForm(p => ({ ...p, [k]: e.target.value }))

  const strength  = getStrength(form.password)
  const pwMatch   = form.confirm && form.password === form.confirm
  const pwNoMatch = form.confirm && form.password !== form.confirm

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
              Begin your<br /><em>journey.</em>
            </h2>
            <p className="at-sub">
              Set up your personal OS in seconds. Everything you need to track, reflect and grow.
            </p>
          </div>

          <div className="auth-chips">
            <span className="auth-chip w">Expense</span>
            <span className="auth-chip w">Portfolio</span>
            <span className="auth-chip h">Workout</span>
            <span className="auth-chip p">Goals</span>
          </div>
        </div>

        {/* ── Right — form ── */}
        <div className="auth-right">
          <div className="auth-form-header">
            <p className="auth-eyebrow">New account</p>
            <h1 className="auth-heading">Create account</h1>
            <p className="auth-sub">Takes less than a minute.</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="auth-fields">

              <div className="auth-field-row">
                <div className="auth-field">
                  <label className="auth-label">First name</label>
                  <div className="auth-input-wrap">
                    <input className="auth-input" type="text" placeholder="Ada" value={form.firstName} onChange={set("firstName")} required />
                    <span className="auth-input-line" />
                  </div>
                </div>
                <div className="auth-field">
                  <label className="auth-label">Last name</label>
                  <div className="auth-input-wrap">
                    <input className="auth-input" type="text" placeholder="Lovelace" value={form.lastName} onChange={set("lastName")} required />
                    <span className="auth-input-line" />
                  </div>
                </div>
              </div>

              <div className="auth-field">
                <label className="auth-label">Email</label>
                <div className="auth-input-wrap">
                  <input className="auth-input" type="email" placeholder="you@example.com" value={form.email} onChange={set("email")} required />
                  <span className="auth-input-line" />
                </div>
              </div>

              <div className="auth-field">
                <label className="auth-label">Password</label>
                <div className="auth-input-wrap auth-input-toggle">
                  <input
                    className="auth-input" type={showPw ? "text" : "password"} placeholder="Min. 8 characters"
                    value={form.password} onChange={set("password")} required
                  />
                  <span className="auth-input-line" />
                  <button type="button" className="auth-toggle-btn" onClick={() => setShowPw(p => !p)}>
                    {showPw ? "hide" : "show"}
                  </button>
                </div>
                {form.password && (
                  <div className="auth-strength">
                    <div className="auth-strength-bars">
                      {[1,2,3,4].map(i => (
                        <div key={i} className={`auth-strength-bar ${i <= strength ? STR_CLASS[strength] : ""}`} />
                      ))}
                    </div>
                    <span className="auth-strength-label">{STR_LABEL[strength]}</span>
                  </div>
                )}
              </div>

              <div className="auth-field">
                <label className="auth-label">Confirm password</label>
                <div className="auth-input-wrap">
                  <input className="auth-input" type="password" placeholder="Repeat password" value={form.confirm} onChange={set("confirm")} required />
                  <span className="auth-input-line" />
                </div>
                {pwMatch   && <span className="auth-hint ok">Passwords match ✓</span>}
                {pwNoMatch && <span className="auth-hint error">Passwords do not match</span>}
              </div>

            </div>

            <button type="submit" className="auth-btn" disabled={!!pwNoMatch}>
              Create account →
            </button>
          </form>

          <div className="auth-switch">
            Already have an account?
            <button onClick={() => onNavigate("login")}>Sign in</button>
          </div>
        </div>

      </div>
    </div>
  )
}