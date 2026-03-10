import { useState, useEffect } from "react"
import Navbar from "./Navbar"
import Sidebar from "./Sidebar"

export default function Layout({ children, onLogout }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const closeSidebar  = () => setSidebarOpen(false)
  const toggleSidebar = () => setSidebarOpen(o => !o)

  useEffect(() => {
    const handler = () => { if (window.innerWidth > 768) setSidebarOpen(false) }
    window.addEventListener("resize", handler)
    return () => window.removeEventListener("resize", handler)
  }, [])

  return (
    <div className="app">
      <Navbar
        onLogout={onLogout}
        sidebarOpen={sidebarOpen}
        onHamburger={toggleSidebar}
      />
      <div className="body">
        <Sidebar
          className={sidebarOpen ? "mobile-open" : ""}
          onNavClick={closeSidebar}
        />
        {sidebarOpen && (
          <div className="sb-backdrop" onClick={closeSidebar} aria-hidden="true" />
        )}
        <main className="main">{children}</main>
      </div>
    </div>
  )
}