import { useState } from "react"
import Login          from "./Login"
import Register       from "./Register"
import ForgotPassword from "./ForgotPassword"

export default function AuthPage({ onLogin }) {
  const [page, setPage] = useState("login")

  if (page === "register") return <Register       onNavigate={setPage} onLogin={onLogin} />
  if (page === "forgot")   return <ForgotPassword onNavigate={setPage} />
  return                          <Login          onNavigate={setPage} onLogin={onLogin} />
}