import { useState } from "react"
import { AppProvider } from "./context/AppContext"
import { ThemeProvider } from "./context/Themecontext"
import AuthPage  from "./pages/AuthPage"
import Dashboard from "./pages/Dashboard"

export default function App() {
  const [authed, setAuthed] = useState(false)

  return (
    <ThemeProvider>
      <AppProvider>
        {authed
          ? <Dashboard onLogout={() => setAuthed(false)} />
          : <AuthPage  onLogin={()  => setAuthed(true)}  />
        }
      </AppProvider>
    </ThemeProvider>
  )
}