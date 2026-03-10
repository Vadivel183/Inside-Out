import { useState } from "react"
import "./auth.css"

export default function ForgotPassword({ onNavigate }) {
  const [email, setEmail] = useState("")
  const [sent, setSent]   = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    // TODO: call your API here
    setSent(true)
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
              Reset &<br /><em>recover.</em>
            </h2>
            <p className="at-sub">
              We'll send a secure link to your inbox. It expires in 15 minutes.
            </p>
          </div>

          <div className="auth-chips">
            <span className="auth-chip w">Email link</span>
            <span className="auth-chip h">Expires 15m</span>
          </div>
        </div>

        {/* ── Right — form ── */}
        <div className="auth-right">
          {sent ? (
            <div className="auth-success">
              <span className="auth-success-icon">◎</span>
              <h2 className="auth-success-title">Check your inbox</h2>
              <p className="auth-success-msg">
                A reset link has been sent to{" "}
                <strong style={{ color: "#f0f0f8" }}>{email}</strong>.
                {" "}It expires in 15 minutes.
              </p>
              <button
                className="auth-text-link"
                style={{ marginTop: 12 }}
                onClick={() => onNavigate("login")}
              >
                ← Back to sign in
              </button>
            </div>
          ) : (
            <>
              <div className="auth-form-header">
                <p className="auth-eyebrow">Account recovery</p>
                <h1 className="auth-heading">Forgot password</h1>
                <p className="auth-sub">We'll send a reset link to your email address.</p>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="auth-fields">
                  <div className="auth-field">
                    <label className="auth-label">Email address</label>
                    <div className="auth-input-wrap">
                      <input
                        className="auth-input" type="email" placeholder="you@example.com"
                        value={email} onChange={e => setEmail(e.target.value)} required
                      />
                      <span className="auth-input-line" />
                    </div>
                  </div>
                </div>

                <button type="submit" className="auth-btn">Send reset link →</button>
              </form>

              <div className="auth-switch">
                Remembered it?
                <button onClick={() => onNavigate("login")}>Back to sign in</button>
              </div>
            </>
          )}
        </div>

      </div>
    </div>
  )
}