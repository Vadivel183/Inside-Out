import { useState, useRef, useEffect } from "react"
import { createPortal } from "react-dom"
import { api } from "../../config/api"
import "./health.css"
import "./routine.css"

/* ── Helpers ────────────────────────────────────────────────── */
const uid      = () => Math.random().toString(36).slice(2, 9)
const todayStr = () => new Date().toISOString().slice(0, 10)
const addDays  = (s, n) => { const d = new Date(s); d.setDate(d.getDate() + n); return d.toISOString().slice(0, 10) }
const fmtDate  = (s) => new Date(s).toLocaleDateString("en-IN", { weekday:"short", day:"2-digit", month:"short", year:"numeric" })

const MOODS  = ["😫 Terrible","😞 Bad","😐 Meh","🙂 Good","💪 Great","🔥 On Fire"]
const ENERGY = ["⚡ Very Low","🔋 Low","➖ Moderate","✅ High","⚡⚡ Peak"]

const emptyEntry = () => ({
  id: uid(), date: todayStr(),
  mood: "", energy: "", duration: "",
  description: "", note: "", photo: null
})

/* ── Toast ─────────────────────────────────────────────────── */
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
  const [name,    setName]    = useState("")
  const [desc,    setDesc]    = useState("")
  const [color,   setColor]   = useState("#c8b97a")
  const [icon,    setIcon]    = useState("◈")
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState("")

  const ICONS  = ["◈","◉","◎","◆","◇","◑","⊕","⊗","⊞","△"]
  const COLORS = ["#c8b97a","#7ac8a8","#a87ac8","#7ab4c8","#c87a7a","#c8a87a","#7a8ec8","#c8c87a"]

  const handle = async () => {
    if (!name.trim()) return
    setLoading(true)
    setError("")
    try {
      const data = await api("/api/routines", {
        method: "POST",
        body: JSON.stringify({ name: name.trim(), description: desc.trim(), icon, color }),
      })
      // backend returns Routine entity with id
      onSave({ id: data.id, name: data.name, desc: data.description || "", color: data.color, icon: data.icon, entries: {} })
      onClose()
    } catch (err) {
      setError(err.message || "Failed to create routine")
    } finally {
      setLoading(false)
    }
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
          {error && <p style={{ color:"#c87a7a", fontSize:"11px", marginBottom:"8px" }}>{error}</p>}
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
          <button className="rt-btn-primary" disabled={loading}
            style={{ background: color, borderColor: color }} onClick={handle}>
            {loading ? "Creating..." : "Create Routine →"}
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
  const [loading,  setLoading]  = useState(false)

  const handle = async () => {
    if (!selected) return
    setLoading(true)
    try {
      await api(`/api/routines/${selected}`, { method: "DELETE" })
      onRemove(selected)
      onClose()
    } catch (err) {
      alert(err.message || "Failed to remove")
    } finally {
      setLoading(false)
    }
  }

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
          <button className="rt-btn-danger" disabled={!selected || loading} onClick={handle}>
            {loading ? "Removing..." : "Remove Selected"}
          </button>
        </div>
      </div>
    </div>,
    document.body
  )
}

/* ── Entry log for one routine ──────────────────────────────── */
function RoutineLog({ routine, onChange, onToast }) {
  const [date,    setDate]    = useState(todayStr())
  const [saving,  setSaving]  = useState(false)
  const [loading, setLoading] = useState(false)
  const fileRef = useRef()

  // local entry state per date
  const entries    = routine.entries[date] || [emptyEntry()]
  const entry      = entries[0]
  const setEntries = (next) => onChange({ ...routine, entries: { ...routine.entries, [date]: next } })
  const updateEntry = (id, field, val) =>
    setEntries(entries.map(e => e.id === id ? { ...e, [field]: val } : e))

  // Load entry from backend when date changes
  useEffect(() => {
    if (routine.entries[date]) return // already loaded
    setLoading(true)
    api(`/api/routines/${routine.id}/entries`)
      .then(data => {
        const found = data.find(e => e.date === date)
        if (found) {
          setEntries([{
            id:          uid(),
            date:        found.date,
            mood:        found.mood        || "",
            energy:      found.energy      || "",
            duration:    found.duration    != null ? String(found.duration) : "",
            description: found.description || "",
            note:        found.note        || "",
            photo:       found.photoUrl    || null,
          }])
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [date, routine.id])

  const handlePhoto = (id, file) => {
    if (!file) return
    const reader = new FileReader()
    reader.onload = ev => updateEntry(id, "photo", ev.target.result)
    reader.readAsDataURL(file)
  }

  const saveEntry = async () => {
    setSaving(true)
    try {
      await api(`/api/routines/${routine.id}/entries`, {
        method: "POST",
        body: JSON.stringify({
          date:        date,
          mood:        entry.mood,
          energy:      entry.energy,
          duration:    entry.duration ? parseInt(entry.duration) : null,
          description: entry.description,
          note:        entry.note,
          photoUrl:    null, // Cloudinary upload handled separately
        }),
      })
      onToast(`${routine.name} entry saved for ${fmtDate(date)}`)
    } catch (err) {
      onToast(err.message || "Failed to save entry", "err")
    } finally {
      setSaving(false)
    }
  }

  // streak = number of unique dates with entries
  const streakCount = Object.keys(routine.entries).filter(d => {
    const e = routine.entries[d]?.[0]
    return e && (e.mood || e.description || e.duration)
  }).length

  return (
    <div className="rt-log" style={{ "--rt-color": routine.color }}>
      <div className="rt-log-header">
        <div className="rt-log-title-row">
          <span className="rt-log-icon" style={{ color: routine.color }}>{routine.icon}</span>
          <div>
            <p className="rt-log-name">{routine.name}</p>
            {routine.desc && <p className="rt-log-desc">{routine.desc}</p>}
          </div>
        </div>
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

      {loading ? (
        <div style={{ padding:"20px", color:"var(--muted)", fontSize:"12px" }}>Loading...</div>
      ) : (
        <div className="rt-entry-grid">
          {/* Col 1 — Mood & Energy */}
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
                  {streakCount} days
                </div>
              </div>
            </div>
          </div>

          {/* Col 2 — Notes */}
          <div className="rt-entry-col">
            <div className="rt-field">
              <label className="rt-label">Progress Notes</label>
              <textarea className="rt-input rt-textarea rt-textarea--tall"
                placeholder={`How was your ${routine.name} today?`}
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
      )}

      <div className="rt-log-footer">
        <span className="rt-log-footer-date">{fmtDate(date)}</span>
        <button className="rt-save-btn" disabled={saving}
          style={{ background: routine.color, borderColor: routine.color }}
          onClick={saveEntry}>
          {saving ? "Saving..." : "Save Entry ↑"}
        </button>
      </div>
    </div>
  )
}

/* ══════════════════════════════════════════════════════════════
   MAIN
══════════════════════════════════════════════════════════════ */
export default function Routine() {
  const [routines,   setRoutines]   = useState([])
  const [showCreate, setShowCreate] = useState(false)
  const [showRemove, setShowRemove] = useState(false)
  const [toast,      setToast]      = useState(null)
  const [loading,    setLoading]    = useState(true)

  const showToast = (msg, type = "ok") => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3000)
  }

  // Load routines from backend on mount
  useEffect(() => {
    api("/api/routines")
      .then(data => {
        setRoutines(data.map(r => ({
          id:      r.id,
          name:    r.name,
          desc:    r.description || "",
          color:   r.color || "#c8b97a",
          icon:    r.icon  || "◈",
          entries: {},
        })))
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const addRoutine    = (r)  => { setRoutines(prev => [...prev, r]); showToast(`"${r.name}" created.`) }
  const removeRoutine = (id) => { const r = routines.find(r => r.id === id); setRoutines(prev => prev.filter(r => r.id !== id)); showToast(`"${r?.name}" removed.`, "err") }
  const updateRoutine = (updated) => setRoutines(prev => prev.map(r => r.id === updated.id ? updated : r))

  return (
    <>
      <div className="rt-page">
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

        {loading ? (
          <div style={{ padding:"40px", color:"var(--muted)", fontSize:"12px", textAlign:"center" }}>
            Loading routines...
          </div>
        ) : routines.length === 0 ? (
          <div className="rt-empty">
            <span className="rt-empty-icon">◎</span>
            <span className="rt-empty-label">No routines yet</span>
            <span className="rt-empty-sub">Create your first routine to start tracking daily habits</span>
            <button className="rt-btn-primary-sm" onClick={() => setShowCreate(true)}>
              + Create your first routine
            </button>
          </div>
        ) : (
          routines.map(r => (
            <RoutineLog key={r.id} routine={r} onChange={updateRoutine} onToast={showToast} />
          ))
        )}
      </div>

      {showCreate && <CreateModal onSave={addRoutine} onClose={() => setShowCreate(false)} />}
      {showRemove && <RemoveModal routines={routines} onRemove={removeRoutine} onClose={() => setShowRemove(false)} />}
      <Toast toast={toast} />
    </>
  )
}