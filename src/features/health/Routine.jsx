import { useState, useRef } from "react"
import { createPortal } from "react-dom"
import "./health.css"
import "./routine.css"

/* ── Helpers ────────────────────────────────────────────────── */
const uid      = () => Math.random().toString(36).slice(2, 9)
const todayStr = () => new Date().toISOString().slice(0, 10)
const addDays  = (s, n) => { const d = new Date(s); d.setDate(d.getDate() + n); return d.toISOString().slice(0, 10) }
const fmtDate  = (s) => new Date(s).toLocaleDateString("en-IN", { weekday:"short", day:"2-digit", month:"short", year:"numeric" })

const MOODS = ["😫 Terrible","😞 Bad","😐 Meh","🙂 Good","💪 Great","🔥 On Fire"]
const ENERGY = ["⚡ Very Low","🔋 Low","➖ Moderate","✅ High","⚡⚡ Peak"]

const emptyEntry = () => ({
  id: uid(), date: todayStr(),
  mood: "", energy: "", duration: "",
  description: "", note: "", photo: null
})

/* ── Toast (portal) ─────────────────────────────────────────── */
function Toast({ toast }) {
  if (!toast) return null
  return createPortal(
    <div className={`rt-toast rt-toast--${toast.type}`}>
      <span>{toast.type === "ok" ? "✓" : "✕"}</span>{toast.msg}
    </div>,
    document.body
  )
}

/* ── Create Routine Modal ───────────────────────────────────── */
function CreateModal({ onSave, onClose }) {
  const [name, setName]   = useState("")
  const [desc, setDesc]   = useState("")
  const [color, setColor] = useState("#c8b97a")
  const [icon, setIcon]   = useState("◈")

  const ICONS   = ["◈","◉","◎","◆","◇","◑","⊕","⊗","⊞","△"]
  const COLORS  = ["#c8b97a","#7ac8a8","#a87ac8","#7ab4c8","#c87a7a","#c8a87a","#7a8ec8","#c8c87a"]

  const handle = () => {
    if (!name.trim()) return
    onSave({ id: uid(), name: name.trim(), desc: desc.trim(), color, icon, entries: {} })
    onClose()
  }

  return createPortal(
    <div className="rt-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="rt-modal">
        <div className="rt-modal-header">
          <div>
            <p className="rt-modal-eyebrow">New Routine</p>
            <h2 className="rt-modal-title">Create Routine</h2>
          </div>
          <button className="rt-modal-close" onClick={onClose}>✕</button>
        </div>

        <div className="rt-modal-body">
          <div className="rt-field">
            <label className="rt-label">Routine Name *</label>
            <input className="rt-input" placeholder="e.g. Morning Face Care"
              value={name} onChange={e => setName(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handle()} autoFocus />
          </div>
          <div className="rt-field">
            <label className="rt-label">Description</label>
            <textarea className="rt-input rt-textarea" rows={3}
              placeholder="What does this routine involve?"
              value={desc} onChange={e => setDesc(e.target.value)} />
          </div>

          <div className="rt-field">
            <label className="rt-label">Icon</label>
            <div className="rt-icon-row">
              {ICONS.map(ic => (
                <button key={ic} className={`rt-icon-btn ${icon === ic ? "active" : ""}`}
                  onClick={() => setIcon(ic)} style={icon === ic ? { borderColor: color } : {}}>
                  {ic}
                </button>
              ))}
            </div>
          </div>

          <div className="rt-field">
            <label className="rt-label">Colour</label>
            <div className="rt-color-row">
              {COLORS.map(c => (
                <button key={c} className={`rt-color-dot ${color === c ? "active" : ""}`}
                  style={{ background: c, boxShadow: color === c ? `0 0 0 2px var(--surface), 0 0 0 4px ${c}` : "none" }}
                  onClick={() => setColor(c)} />
              ))}
            </div>
          </div>
        </div>

        <div className="rt-modal-footer">
          <button className="rt-btn-ghost" onClick={onClose}>Cancel</button>
          <button className="rt-btn-primary" style={{ background: color, borderColor: color }} onClick={handle}>
            Create Routine →
          </button>
        </div>
      </div>
    </div>,
    document.body
  )
}

/* ── Remove Routine Modal ───────────────────────────────────── */
function RemoveModal({ routines, onRemove, onClose }) {
  const [selected, setSelected] = useState(null)

  return createPortal(
    <div className="rt-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="rt-modal rt-modal--sm">
        <div className="rt-modal-header">
          <div>
            <p className="rt-modal-eyebrow">Manage</p>
            <h2 className="rt-modal-title">Remove Routine</h2>
          </div>
          <button className="rt-modal-close" onClick={onClose}>✕</button>
        </div>

        <div className="rt-modal-body">
          {routines.length === 0
            ? <p className="rt-empty-msg">No routines to remove.</p>
            : routines.map(r => (
              <button key={r.id}
                className={`rt-remove-row ${selected === r.id ? "selected" : ""}`}
                onClick={() => setSelected(r.id)}>
                <span className="rt-remove-icon" style={{ color: r.color }}>{r.icon}</span>
                <span className="rt-remove-name">{r.name}</span>
                <span className="rt-remove-count">
                  {Object.values(r.entries).flat().length} entries
                </span>
                {selected === r.id && <span className="rt-remove-check">✓</span>}
              </button>
            ))
          }
        </div>

        <div className="rt-modal-footer">
          <button className="rt-btn-ghost" onClick={onClose}>Cancel</button>
          <button className="rt-btn-danger"
            disabled={!selected}
            onClick={() => { if (selected) { onRemove(selected); onClose() } }}>
            Remove Selected
          </button>
        </div>
      </div>
    </div>,
    document.body
  )
}

/* ── Entry log for one routine ──────────────────────────────── */
function RoutineLog({ routine, onChange }) {
  const [date, setDate]    = useState(todayStr())
  const fileRef            = useRef()

  const entries = routine.entries[date] || [emptyEntry()]

  const setEntries = (next) => onChange({ ...routine, entries: { ...routine.entries, [date]: next } })

  const updateEntry = (id, field, val) =>
    setEntries(entries.map(e => e.id === id ? { ...e, [field]: val } : e))

  const handlePhoto = (id, file) => {
    if (!file) return
    const reader = new FileReader()
    reader.onload = ev => updateEntry(id, "photo", ev.target.result)
    reader.readAsDataURL(file)
  }

  // Each entry: date is set by the date picker; name+desc prepopulated from routine
  const entry = entries[0] // one entry per day

  return (
    <div className="rt-log" style={{ "--rt-color": routine.color }}>

      {/* Log header */}
      <div className="rt-log-header">
        <div className="rt-log-title-row">
          <span className="rt-log-icon" style={{ color: routine.color }}>{routine.icon}</span>
          <div>
            <p className="rt-log-name">{routine.name}</p>
            {routine.desc && <p className="rt-log-desc">{routine.desc}</p>}
          </div>
        </div>

        {/* Date navigator */}
        <div className="rt-date-nav">
          <button className="rt-nav-btn" onClick={() => setDate(d => addDays(d, -1))}>‹</button>
          <div className="rt-date-wrap">
            <input type="date" className="rt-date-input" value={date}
              onChange={e => setDate(e.target.value)} />
            <span className="rt-date-label">{fmtDate(date)}</span>
          </div>
          <button className="rt-nav-btn" onClick={() => setDate(d => addDays(d, 1))}>›</button>
          <button className="rt-nav-btn rt-nav-today" onClick={() => setDate(todayStr())}>Today</button>
        </div>
      </div>

      {/* Entry form */}
      <div className="rt-entry-grid">

        {/* Col 1 — How did it feel */}
        <div className="rt-entry-col">
          <div className="rt-field">
            <label className="rt-label">How did it feel today?</label>
            <div className="rt-mood-row">
              {MOODS.map(m => (
                <button key={m}
                  className={`rt-mood-btn ${entry.mood === m ? "active" : ""}`}
                  style={entry.mood === m ? { borderColor: routine.color, color: routine.color } : {}}
                  onClick={() => updateEntry(entry.id, "mood", entry.mood === m ? "" : m)}>
                  {m}
                </button>
              ))}
            </div>
          </div>

          <div className="rt-field">
            <label className="rt-label">Energy Level</label>
            <div className="rt-mood-row">
              {ENERGY.map(e => (
                <button key={e}
                  className={`rt-mood-btn ${entry.energy === e ? "active" : ""}`}
                  style={entry.energy === e ? { borderColor: routine.color, color: routine.color } : {}}
                  onClick={() => updateEntry(entry.id, "energy", entry.energy === e ? "" : e)}>
                  {e}
                </button>
              ))}
            </div>
          </div>

          <div className="rt-field-row">
            <div className="rt-field">
              <label className="rt-label">Duration (mins)</label>
              <input className="rt-input" type="number" min="0" placeholder="e.g. 30"
                value={entry.duration}
                onChange={e => updateEntry(entry.id, "duration", e.target.value)} />
            </div>
            <div className="rt-field">
              <label className="rt-label">Streak</label>
              <div className="rt-streak-badge" style={{ borderColor: routine.color, color: routine.color }}>
                {Object.keys(routine.entries).length} days
              </div>
            </div>
          </div>
        </div>

        {/* Col 2 — Notes */}
        <div className="rt-entry-col">
          <div className="rt-field">
            <label className="rt-label">Progress Notes</label>
            <textarea className="rt-input rt-textarea rt-textarea--tall"
              placeholder={`How was your ${routine.name} today? Any changes, improvements or struggles?`}
              value={entry.description}
              onChange={e => updateEntry(entry.id, "description", e.target.value)} />
          </div>
          <div className="rt-field">
            <label className="rt-label">Quick Note (optional)</label>
            <input className="rt-input" placeholder="Reminder, product used, etc."
              value={entry.note}
              onChange={e => updateEntry(entry.id, "note", e.target.value)} />
          </div>
        </div>

        {/* Col 3 — Photo */}
        <div className="rt-entry-col rt-entry-col--photo">
          <div className="rt-field">
            <label className="rt-label">Progress Photo</label>
            <input type="file" accept="image/*" ref={fileRef} style={{ display:"none" }}
              onChange={e => handlePhoto(entry.id, e.target.files[0])} />
            {entry.photo
              ? (
                <div className="rt-photo-wrap">
                  <img src={entry.photo} alt="progress" className="rt-photo" />
                  <button className="rt-photo-remove"
                    onClick={() => updateEntry(entry.id, "photo", null)}>✕ Remove</button>
                </div>
              )
              : (
                <button className="rt-photo-upload" onClick={() => fileRef.current.click()}>
                  <span className="rt-photo-icon">◎</span>
                  <span>Upload Photo</span>
                  <span className="rt-photo-sub">jpg, png, webp</span>
                </button>
              )
            }
          </div>
        </div>

      </div>

      {/* Save button */}
      <div className="rt-log-footer">
        <span className="rt-log-footer-date">{fmtDate(date)}</span>
        <button className="rt-save-btn" style={{ background: routine.color, borderColor: routine.color }}
          onClick={() => {
            // ensure entry is saved (already in state)
            // TODO: POST /api/routines/:id/entries  { date, ...entry }
            console.log("[Routine] Save", routine.name, date, entry)
          }}>
          Save Entry ↑
        </button>
      </div>

    </div>
  )
}

/* ══════════════════════════════════════════════════════════════
   MAIN
══════════════════════════════════════════════════════════════ */
export default function Routine() {
  const [routines,    setRoutines]    = useState([])
  const [showCreate,  setShowCreate]  = useState(false)
  const [showRemove,  setShowRemove]  = useState(false)
  const [toast,       setToast]       = useState(null)

  const showToast = (msg, type = "ok") => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3000)
  }

  const addRoutine = (r) => {
    setRoutines(prev => [...prev, r])
    showToast(`"${r.name}" routine created.`)
  }

  const removeRoutine = (id) => {
    const r = routines.find(r => r.id === id)
    setRoutines(prev => prev.filter(r => r.id !== id))
    showToast(`"${r?.name}" removed.`, "err")
  }

  const updateRoutine = (updated) =>
    setRoutines(prev => prev.map(r => r.id === updated.id ? updated : r))

  return (
    <>
      <div className="rt-page">

        {/* Page header */}
        <div className="rt-page-header">
          <div>
            <p className="rt-eyebrow">Health · Routine</p>
            <h1 className="rt-title">Routines</h1>
          </div>
          <div className="rt-header-actions">
            <button className="rt-btn-ghost" onClick={() => setShowRemove(true)}
              disabled={routines.length === 0}>
              − Remove Routine
            </button>
            <button className="rt-btn-primary-sm" onClick={() => setShowCreate(true)}>
              + Create Routine
            </button>
          </div>
        </div>

        {/* Empty state */}
        {routines.length === 0 && (
          <div className="rt-empty">
            <span className="rt-empty-icon">◎</span>
            <span className="rt-empty-label">No routines yet</span>
            <span className="rt-empty-sub">Create your first routine to start tracking daily habits</span>
            <button className="rt-btn-primary-sm" onClick={() => setShowCreate(true)}>
              + Create your first routine
            </button>
          </div>
        )}

        {/* Routine logs */}
        {routines.map(r => (
          <RoutineLog key={r.id} routine={r} onChange={updateRoutine} />
        ))}

      </div>

      {showCreate && <CreateModal onSave={addRoutine}    onClose={() => setShowCreate(false)} />}
      {showRemove && <RemoveModal routines={routines} onRemove={removeRoutine} onClose={() => setShowRemove(false)} />}
      <Toast toast={toast} />
    </>
  )
}