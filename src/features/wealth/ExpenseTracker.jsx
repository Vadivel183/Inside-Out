import { useState, useEffect, useCallback } from "react"
import { createPortal } from "react-dom"
import { api } from "../../config/api"
import "./wealth.css"
import "./expense.css"

/* ── Constants ──────────────────────────────────────────────── */
const CATEGORIES = [
  "Essentials","Rent","Food","Outings","Fuel",
  "EMIs","Wants","Healthcare","Subscriptions",
  "Education","Travel","Utilities","Savings","Other"
]
const PAYMENT_MODES = ["Cash","UPI","Card","Net Banking","Wallet"]
const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]
const YEARS  = Array.from({ length: 6 }, (_, i) => new Date().getFullYear() - 2 + i)

const todayStr = () => new Date().toISOString().slice(0, 10)
const uid      = () => Math.random().toString(36).slice(2, 8)
const emptyRow = () => ({ id: uid(), name: "", amount: "", category: "", mode: "", note: "" })

const formatINR = (n) => {
  const num = parseFloat(n)
  if (isNaN(num) || n === "") return "—"
  return "₹" + num.toLocaleString("en-IN", { minimumFractionDigits: 0, maximumFractionDigits: 2 })
}

const addDays = (dateStr, n) => {
  const d = new Date(dateStr)
  d.setDate(d.getDate() + n)
  return d.toISOString().slice(0, 10)
}

const formatDate = (dateStr) =>
  new Date(dateStr).toLocaleDateString("en-IN", {
    weekday: "short", day: "2-digit", month: "short", year: "numeric"
  })

const apiToRow = (r) => ({
  id: uid(), name: r.name || "", amount: r.amount != null ? String(r.amount) : "",
  category: r.category || "", mode: r.mode || "", note: r.note || "",
})

/* ── Sub-components ─────────────────────────────────────────── */
function SectionHead({ eyebrow, label, action }) {
  return (
    <div className="et-section-head">
      <div>
        <p className="et-eyebrow">{eyebrow}</p>
        <h2 className="et-section-title">{label}</h2>
      </div>
      {action}
    </div>
  )
}

function ExpenseRow({ row, onChange, onRemove, canRemove }) {
  return (
    <div className="et-row">
      <input className="et-input et-name" placeholder="Expense name"
        value={row.name} onChange={e => onChange(row.id, "name", e.target.value)} />
      <div className="et-input-prefix">
        <span className="et-currency">₹</span>
        <input className="et-input et-amount" placeholder="0.00" type="number" min="0"
          value={row.amount} onChange={e => onChange(row.id, "amount", e.target.value)} />
      </div>
      <select className="et-input et-select" value={row.category}
        onChange={e => onChange(row.id, "category", e.target.value)}>
        <option value="">Category</option>
        {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
      </select>
      <select className="et-input et-select" value={row.mode}
        onChange={e => onChange(row.id, "mode", e.target.value)}>
        <option value="">Mode</option>
        {PAYMENT_MODES.map(m => <option key={m} value={m}>{m}</option>)}
      </select>
      <input className="et-input et-note" placeholder="Note (optional)"
        value={row.note} onChange={e => onChange(row.id, "note", e.target.value)} />
      <button className={`et-row-remove${canRemove ? "" : " disabled"}`}
        onClick={() => canRemove && onRemove(row.id)} title="Remove row">✕</button>
    </div>
  )
}

function RowTotal({ rows }) {
  const total  = rows.reduce((s, r) => s + (parseFloat(r.amount) || 0), 0)
  const filled = rows.filter(r => r.name || r.amount).length
  return (
    <div className="et-day-total">
      <span className="et-day-count">{filled} entr{filled === 1 ? "y" : "ies"}</span>
      <span className="et-day-sum">{formatINR(total)}</span>
    </div>
  )
}

/* ══════════════════════════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════════════════════════ */
export default function ExpenseTracker() {
  const now = new Date()

  const [toast, setToast] = useState(null)
  const showToast = (msg, type = "ok") => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3000)
  }

  const [savingDaily,    setSavingDaily]    = useState(false)
  const [savingMonthly,  setSavingMonthly]  = useState(false)
  const [savingDeferred, setSavingDeferred] = useState(false)

  /* ── Daily log ── */
  const [currentDate,   setCurrentDate]   = useState(todayStr())
  const [dailyLog,      setDailyLog]      = useState({})
  const [loadingDaily,  setLoadingDaily]  = useState(false)

  const getDayRows   = (d)           => dailyLog[d] || [emptyRow()]
  const setDayRows   = (d, rows)     => setDailyLog(prev => ({ ...prev, [d]: rows }))
  const updateRow    = (d, id, f, v) => setDayRows(d, getDayRows(d).map(r => r.id === id ? { ...r, [f]: v } : r))
  const addDayRow    = (d)           => setDayRows(d, [...getDayRows(d), emptyRow()])
  const removeDayRow = (d, id)       => { const rows = getDayRows(d).filter(r => r.id !== id); setDayRows(d, rows.length ? rows : [emptyRow()]) }

  const loadDaily = useCallback(async (date) => {
    setLoadingDaily(true)
    try {
      const data = await api(`/api/expenses/daily?date=${date}`)
      setDayRows(date, data.length ? data.map(apiToRow) : [emptyRow()])
    } catch {
      setDayRows(date, [emptyRow()])
    } finally {
      setLoadingDaily(false)
    }
  }, [])

  useEffect(() => { loadDaily(currentDate) }, [currentDate])

  const saveDaily = async () => {
    const rows = getDayRows(currentDate).filter(r => r.name || r.amount)
    if (!rows.length) { showToast("Nothing to save", "err"); return }
    setSavingDaily(true)
    try {
      await api(`/api/expenses/daily?date=${currentDate}`, {
        method: "POST",
        body: JSON.stringify(rows.map(r => ({
          name: r.name, amount: parseFloat(r.amount) || 0,
          category: r.category, mode: r.mode, note: r.note,
        }))),
      })
      showToast(`Day log for ${formatDate(currentDate)} saved — ${rows.length} entries`)
    } catch (err) {
      showToast(err.message || "Failed to save", "err")
    } finally {
      setSavingDaily(false)
    }
  }

  /* ── Monthly log ── */
  const [monthIdx,       setMonthIdx]      = useState(now.getMonth())
  const [monthYear,      setMonthYear]     = useState(now.getFullYear())
  const monthKey = `${monthYear}-${monthIdx}`
  const [monthlyLog,     setMonthlyLog]    = useState({})
  const [loadingMonthly, setLoadingMonthly] = useState(false)
  const [monthCollapsed, setMonthCollapsed] = useState(false)

  const getMonthRows   = (k)           => monthlyLog[k] || [emptyRow()]
  const setMonthRows   = (k, rows)     => setMonthlyLog(prev => ({ ...prev, [k]: rows }))
  const updateMonthRow = (k, id, f, v) => setMonthRows(k, getMonthRows(k).map(r => r.id === id ? { ...r, [f]: v } : r))
  const addMonthRow    = (k)           => setMonthRows(k, [...getMonthRows(k), emptyRow()])
  const removeMonthRow = (k, id)       => { const rows = getMonthRows(k).filter(r => r.id !== id); setMonthRows(k, rows.length ? rows : [emptyRow()]) }

  const loadMonthly = useCallback(async (month, year) => {
    setLoadingMonthly(true)
    try {
      const data = await api(`/api/expenses/monthly?month=${month + 1}&year=${year}`)
      setMonthRows(`${year}-${month}`, data.length ? data.map(apiToRow) : [emptyRow()])
    } catch {
      setMonthRows(`${year}-${month}`, [emptyRow()])
    } finally {
      setLoadingMonthly(false)
    }
  }, [])

  useEffect(() => { loadMonthly(monthIdx, monthYear) }, [monthIdx, monthYear])

  const saveMonthly = async () => {
    const rows = getMonthRows(monthKey).filter(r => r.name || r.amount)
    if (!rows.length) { showToast("Nothing to save", "err"); return }
    setSavingMonthly(true)
    try {
      await api(`/api/expenses/monthly?month=${monthIdx + 1}&year=${monthYear}`, {
        method: "POST",
        body: JSON.stringify(rows.map(r => ({
          name: r.name, amount: parseFloat(r.amount) || 0,
          category: r.category, mode: r.mode, note: r.note,
        }))),
      })
      showToast(`${MONTHS[monthIdx]} ${monthYear} log saved — ${rows.length} entries`)
    } catch (err) {
      showToast(err.message || "Failed to save", "err")
    } finally {
      setSavingMonthly(false)
    }
  }

  /* ── Deferred ── */
  const initDeferred = () => ({
    name: "", amount: "", category: "", mode: "", note: "",
    fromMonth: now.getMonth(), fromYear: now.getFullYear(),
    toMonth: now.getMonth() + 1 > 11 ? 0 : now.getMonth() + 1,
    toYear:  now.getMonth() + 1 > 11 ? now.getFullYear() + 1 : now.getFullYear(),
  })
  const [deferred,          setDeferred]          = useState(initDeferred())
  const [deferredSubmitted, setDeferredSubmitted] = useState([])
  const [deferAlert,        setDeferAlert]        = useState("")
  const setD = (f, v) => setDeferred(p => ({ ...p, [f]: v }))

  const submitDeferred = async () => {
    const { name, amount, category, fromMonth, fromYear, toMonth, toYear } = deferred
    if (!name || !amount || !category) { setDeferAlert("Please fill Name, Amount and Category."); return }
    const amt = parseFloat(amount)
    if (isNaN(amt) || amt <= 0) { setDeferAlert("Enter a valid amount."); return }

    const months = []
    let m = fromMonth, y = fromYear
    while (y < toYear || (y === toYear && m <= toMonth)) {
      months.push({ m, y }); m++
      if (m > 11) { m = 0; y++ }
      if (months.length > 60) break
    }
    if (!months.length) { setDeferAlert("Invalid date range."); return }

    const split = +(amt / months.length).toFixed(2)
    setSavingDeferred(true)
    try {
      await Promise.all(months.map(({ m: mo, y: yr }) => {
        const k = `${yr}-${mo}`
        const existing = (monthlyLog[k] || []).filter(r => r.name || r.amount)
        const newRow = {
          name: name + " (deferred)", amount: split, category,
          mode: deferred.mode,
          note: deferred.note || `Deferred ${MONTHS[fromMonth]} ${fromYear} – ${MONTHS[toMonth]} ${toYear}`,
        }
        const allRows = [...existing.map(r => ({
          name: r.name, amount: parseFloat(r.amount) || 0,
          category: r.category, mode: r.mode, note: r.note
        })), newRow]
        setMonthlyLog(prev => ({
          ...prev,
          [k]: [...(prev[k] || [emptyRow()]).filter(r => r.name || r.amount),
                { ...emptyRow(), ...newRow, amount: String(split) }]
        }))
        return api(`/api/expenses/monthly?month=${mo + 1}&year=${yr}`, {
          method: "POST", body: JSON.stringify(allRows),
        })
      }))
      setDeferredSubmitted(prev => [...prev, { ...deferred, months: months.length, split, id: uid() }])
      setDeferred(initDeferred())
      const msg = `✓ ${formatINR(amt)} split across ${months.length} months and saved.`
      setDeferAlert(msg)
      showToast(msg)
      setTimeout(() => setDeferAlert(""), 3500)
    } catch (err) {
      showToast(err.message || "Failed to save deferred expense", "err")
    } finally {
      setSavingDeferred(false)
    }
  }

  /* ── Derived ── */
  const dayRows = getDayRows(currentDate)
  const mRows   = getMonthRows(monthKey)
  const mTotal  = mRows.reduce((s, r) => s + (parseFloat(r.amount) || 0), 0)

  return (
    <div className="et-page">

      <div className="sp-header">
        <div>
          <p className="sp-eyebrow">Wealth · Expense</p>
          <h1 className="sp-title">Expense Tracker</h1>
        </div>
      </div>

      {/* ══ SECTION 1 — Daily Log ══════════════════════════════ */}
      <div className="et-section">
        <SectionHead
          eyebrow="01 — Daily" label="Day Log"
          action={
            <div className="et-date-nav">
              <button className="et-nav-btn" onClick={() => setCurrentDate(d => addDays(d, -1))}>‹ Prev</button>
              <input type="date" className="et-date-picker" value={currentDate}
                onChange={e => setCurrentDate(e.target.value)} />
              <button className="et-nav-btn" onClick={() => setCurrentDate(d => addDays(d, 1))}>Next ›</button>
              <button className="et-nav-btn et-nav-today" onClick={() => setCurrentDate(todayStr())}>Today</button>
            </div>
          }
        />
        <div className="et-row-header">
          <span>Expense Name</span><span>Amount</span><span>Category</span>
          <span>Mode</span><span>Note</span><span />
        </div>
        {loadingDaily ? (
          <div style={{ padding:"20px", color:"var(--muted)", fontSize:"12px" }}>Loading...</div>
        ) : (
          <div className="et-rows">
            {dayRows.map(row => (
              <ExpenseRow key={row.id} row={row}
                onChange={(id, f, v) => updateRow(currentDate, id, f, v)}
                onRemove={(id) => removeDayRow(currentDate, id)}
                canRemove={dayRows.length > 1} />
            ))}
          </div>
        )}
        <div className="et-section-footer">
          <button className="et-add-btn" onClick={() => addDayRow(currentDate)}>+ Add Expense Line</button>
          <div className="et-footer-right">
            <RowTotal rows={dayRows} />
            <button className="et-submit-btn" onClick={saveDaily} disabled={savingDaily}>
              {savingDaily ? "Saving..." : "Save Day Log ↑"}
            </button>
          </div>
        </div>
      </div>

      {/* ══ SECTION 2 — Monthly Log ════════════════════════════ */}
      <div className="et-section">
        <SectionHead
          eyebrow="02 — Monthly" label="Month Log"
          action={
            <div className="et-month-nav">
              <select className="et-month-select" value={monthIdx} onChange={e => setMonthIdx(+e.target.value)}>
                {MONTHS.map((mo, i) => <option key={mo} value={i}>{mo}</option>)}
              </select>
              <select className="et-month-select" value={monthYear} onChange={e => setMonthYear(+e.target.value)}>
                {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
              </select>
              {mTotal > 0 && <span className="et-month-total">{formatINR(mTotal)}</span>}
            </div>
          }
        />
        <div
          onClick={() => setMonthCollapsed(p => !p)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            cursor: "pointer",
            margin: "12px 0",
            userSelect: "none",
          }}
        >
          <div style={{ flex: 1, height: "1px", background: "var(--border)" }} />
          <span style={{
            fontSize: "10px",
            color: "var(--muted)",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            fontFamily: "'DM Mono', monospace",
            flexShrink: 0,
          }}>
            {monthCollapsed
              ? `▼ ${mRows.filter(r => r.name || r.amount).length} entries hidden`
              : "▲ collapse"}
          </span>
          <div style={{ flex: 1, height: "1px", background: "var(--border)" }} />
        </div>

        {!monthCollapsed && (
          <>
            <div className="et-row-header">
              <span>Expense Name</span><span>Amount</span><span>Category</span>
              <span>Mode</span><span>Note</span><span />
            </div>
            {loadingMonthly ? (
              <div style={{ padding:"20px", color:"var(--muted)", fontSize:"12px" }}>Loading...</div>
            ) : (
              <div className="et-rows">
                {mRows.map(row => (
                  <ExpenseRow key={row.id} row={row}
                    onChange={(id, f, v) => updateMonthRow(monthKey, id, f, v)}
                    onRemove={(id) => removeMonthRow(monthKey, id)}
                    canRemove={mRows.length > 1} />
                ))}
              </div>
            )}
          </>
        )}
        <div className="et-section-footer">
          <button className="et-add-btn" onClick={() => addMonthRow(monthKey)}>+ Add Expense Line</button>
          <div className="et-footer-right">
            <div className="et-day-total">
              <span className="et-day-count">{mRows.filter(r => r.name || r.amount).length} entries</span>
              <span className="et-day-sum">{formatINR(mTotal)}</span>
            </div>
            <button className="et-submit-btn" onClick={saveMonthly} disabled={savingMonthly}>
              {savingMonthly ? "Saving..." : "Save Month Log ↑"}
            </button>
          </div>
        </div>
      </div>

      {/* ══ SECTION 3 — Deferred Expense ══════════════════════ */}
      <div className="et-section">
        <SectionHead eyebrow="03 — Deferred" label="Deferred Expense" />
        <p className="et-defer-desc">
          Split a lump-sum expense across multiple months. The amount is divided equally and logged in each month's expense log automatically.
        </p>
        <div className="et-defer-form">
          <div className="et-defer-row">
            <div className="et-defer-field">
              <label className="et-defer-label">Expense Name</label>
              <input className="et-input" placeholder="e.g. Annual Insurance"
                value={deferred.name} onChange={e => setD("name", e.target.value)} />
            </div>
            <div className="et-defer-field">
              <label className="et-defer-label">Total Amount</label>
              <div className="et-input-prefix">
                <span className="et-currency">₹</span>
                <input className="et-input et-amount" placeholder="0.00" type="number" min="0"
                  value={deferred.amount} onChange={e => setD("amount", e.target.value)} />
              </div>
            </div>
            <div className="et-defer-field">
              <label className="et-defer-label">Category</label>
              <select className="et-input et-select" value={deferred.category} onChange={e => setD("category", e.target.value)}>
                <option value="">Select</option>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="et-defer-field">
              <label className="et-defer-label">Payment Mode</label>
              <select className="et-input et-select" value={deferred.mode} onChange={e => setD("mode", e.target.value)}>
                <option value="">Select</option>
                {PAYMENT_MODES.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>
          </div>
          <div className="et-defer-row">
            <div className="et-defer-field">
              <label className="et-defer-label">From Month</label>
              <div className="et-defer-month-pair">
                <select className="et-input et-select" value={deferred.fromMonth} onChange={e => setD("fromMonth", +e.target.value)}>
                  {MONTHS.map((mo, i) => <option key={mo} value={i}>{mo}</option>)}
                </select>
                <select className="et-input et-select" value={deferred.fromYear} onChange={e => setD("fromYear", +e.target.value)}>
                  {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
                </select>
              </div>
            </div>
            <div className="et-defer-field">
              <label className="et-defer-label">To Month</label>
              <div className="et-defer-month-pair">
                <select className="et-input et-select" value={deferred.toMonth} onChange={e => setD("toMonth", +e.target.value)}>
                  {MONTHS.map((mo, i) => <option key={mo} value={i}>{mo}</option>)}
                </select>
                <select className="et-input et-select" value={deferred.toYear} onChange={e => setD("toYear", +e.target.value)}>
                  {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
                </select>
              </div>
            </div>
            <div className="et-defer-field et-defer-field--wide">
              <label className="et-defer-label">Note (optional)</label>
              <input className="et-input" placeholder="e.g. Annual premium split"
                value={deferred.note} onChange={e => setD("note", e.target.value)} />
            </div>
          </div>
          {(() => {
            if (!deferred.amount || !deferred.name) return null
            const fromAbs = deferred.fromYear * 12 + deferred.fromMonth
            const toAbs   = deferred.toYear   * 12 + deferred.toMonth
            const count   = toAbs >= fromAbs ? toAbs - fromAbs + 1 : 0
            const split   = count > 0 ? (parseFloat(deferred.amount) / count).toFixed(2) : 0
            return count > 0 ? (
              <div className="et-defer-preview">
                <span className="et-defer-preview-icon">◎</span>
                <span>
                  <strong>{formatINR(deferred.amount)}</strong> split across{" "}
                  <strong>{count} month{count > 1 ? "s" : ""}</strong>{" "}={" "}
                  <strong className="et-defer-split">{formatINR(split)}</strong> / month
                </span>
              </div>
            ) : (
              <div className="et-defer-preview et-defer-preview--warn">
                <span>⚠ "To" month must be same or after "From" month.</span>
              </div>
            )
          })()}
          <div className="et-defer-actions">
            {deferAlert && (
              <span className={`et-defer-alert ${deferAlert.startsWith("✓") ? "ok" : "err"}`}>
                {deferAlert}
              </span>
            )}
            <button className="et-submit-btn" onClick={submitDeferred} disabled={savingDeferred}>
              {savingDeferred ? "Saving..." : "Split & Log Expense →"}
            </button>
          </div>
        </div>
        {deferredSubmitted.length > 0 && (
          <div className="et-defer-log">
            <p className="et-defer-log-heading">Logged deferred entries</p>
            {deferredSubmitted.map(d => (
              <div key={d.id} className="et-defer-log-row">
                <span className="et-defer-log-name">{d.name}</span>
                <span className="et-defer-log-cat">{d.category}</span>
                <span className="et-defer-log-range">{MONTHS[d.fromMonth]} {d.fromYear} → {MONTHS[d.toMonth]} {d.toYear}</span>
                <span className="et-defer-log-split">{formatINR(d.split)}/mo</span>
                <span className="et-defer-log-total">{formatINR(d.amount)} total</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {toast && createPortal(
        <div className={`et-toast et-toast--${toast.type}`}>
          <span className="et-toast-icon">{toast.type === "ok" ? "✓" : "✕"}</span>
          {toast.msg}
        </div>,
        document.body
      )}
    </div>
  )
}