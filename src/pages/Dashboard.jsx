import { useApp } from "../context/AppContext"
import Layout from "../components/Layout"

// Wealth
import Wealth          from "../features/wealth/Wealth"
import ExpenseTracker  from "../features/wealth/ExpenseTracker"
import Portfolio       from "../features/wealth/Portfolio"
import IncomeSources   from "../features/wealth/IncomeSources"
import WealthAnalytics from "../features/wealth/WealthAnalytics"
import Liability       from "../features/wealth/Liability"

// Health
import Health    from "../features/health/Health"
import Workout   from "../features/health/Workout"
import Nutrition from "../features/health/Nutrition"
import Routine   from "../features/health/Routine"

// Personal
import Personal  from "../features/personal/Personal"
import Goals     from "../features/personal/Goals"
import Learning  from "../features/personal/Learnings"

/* ──────────────────────────────────────────────────────────────
   HOME — empty, analytics later
────────────────────────────────────────────────────────────── */
function DashboardHome() {
  return (
    <div style={{ height:"100%", display:"flex", alignItems:"center", justifyContent:"center" }}>
      <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:16, opacity:0.25, userSelect:"none" }}>
        <svg width="52" height="52" viewBox="0 0 52 52" fill="none">
          <circle cx="26" cy="26" r="24" stroke="var(--aw)" strokeWidth="1"/>
          <circle cx="26" cy="26" r="13" stroke="var(--aw)" strokeWidth="1.2"/>
          <line x1="30" y1="26" x2="47" y2="26" stroke="var(--aw)" strokeWidth="1.2" strokeLinecap="round"/>
          <polyline points="42,21.5 47,26 42,30.5" stroke="var(--aw)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
          <line x1="5" y1="26" x2="22" y2="26" stroke="var(--aw)" strokeWidth="1.2" strokeLinecap="round" opacity="0.5"/>
          <polyline points="10,21.5 5,26 10,30.5" stroke="var(--aw)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity="0.5"/>
          <circle cx="26" cy="26" r="3" fill="var(--aw)"/>
        </svg>
        <span style={{ fontFamily:"'Fraunces',serif", fontStyle:"italic", fontWeight:300, fontSize:24, color:"var(--bright)" }}>
          Inside—Out
        </span>
        <span style={{ fontSize:9, letterSpacing:"0.18em", textTransform:"uppercase", color:"var(--muted)" }}>
          Analytics overview · coming soon
        </span>
      </div>
    </div>
  )
}

/* ──────────────────────────────────────────────────────────────
   VIEW MAP
   "overview"  → Wealth 4-box page
   sub-headings → their content (replaces 4 boxes, same page/layout)
────────────────────────────────────────────────────────────── */
const VIEWS = {
  // Home
  dashboard:     <DashboardHome />,

  // Wealth — overview shows 4 boxes; sub-headings replace them
  overview:      <Wealth />,
  expense:       <ExpenseTracker />,
  portfolio:     <Portfolio />,
  income:        <IncomeSources />,
  analytics:     <WealthAnalytics />,
  liability:     <Liability />,

  // Health — overview shows health cards; sub-headings replace them
  "h-overview":  <Health />,
  "h-workout":   <Workout />,
  "h-nutrition": <Nutrition />,
  "h-routine":   <Routine />,

  // Personal — overview shows personal cards; sub-headings replace them
  "p-overview":  <Personal />,
  "p-goals":     <Goals />,
  "p-learning":  <Learning />,
}

/* ──────────────────────────────────────────────────────────────
   DASHBOARD SHELL — navbar + sidebar always present
   only .main content changes
────────────────────────────────────────────────────────────── */
export default function Dashboard({ onLogout }) {
  const { view } = useApp()
  return (
    <Layout onLogout={onLogout}>
      {VIEWS[view] ?? <DashboardHome />}
    </Layout>
  )
}