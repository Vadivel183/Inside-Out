import { ThemeProvider } from "./context/Themecontext"
import { AppProvider }   from "./context/AppContext"
import { AuthProvider, useAuth } from "./context/AuthContext"
import AuthPage  from "./pages/AuthPage"
import Dashboard from "./pages/Dashboard"

function AppContent() {
  const { isLoggedIn, logout } = useAuth()

  if (!isLoggedIn) return <AuthPage onLogin={() => {}} />
  return <Dashboard onLogout={logout} />
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppProvider>
          <AppContent />
        </AppProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}