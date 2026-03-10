import { createContext, useContext, useState } from "react"

const AppContext = createContext(null)

export function AppProvider({ children }) {
  const [view, setView] = useState("dashboard")
  return (
    <AppContext.Provider value={{ view, setView }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  return useContext(AppContext)
}