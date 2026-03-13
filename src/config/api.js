const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8080"

export const api = async (endpoint, options = {}) => {
  const token = localStorage.getItem("token")

  const res = await fetch(`${API_BASE}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  })

  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: "Something went wrong" }))
    throw new Error(error.message || "Request failed")
  }

  return res.json()
}