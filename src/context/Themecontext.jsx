import { createContext, useContext, useState, useEffect } from "react"

const ThemeContext = createContext(null)

export const THEMES = ["dark", "light", "pink"]

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => localStorage.getItem("io-theme") || "dark")

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme)
    localStorage.setItem("io-theme", theme)
  }, [theme])

  const cycle = () => setTheme(t => {
    const i = THEMES.indexOf(t)
    return THEMES[(i + 1) % THEMES.length]
  })

  return (
    <ThemeContext.Provider value={{ theme, setTheme, cycle }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  return useContext(ThemeContext)
}