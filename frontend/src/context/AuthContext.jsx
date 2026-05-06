import { createContext, useContext, useState, useEffect } from 'react'
import { login as apiLogin, getMe } from '../lib/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [admin, setAdmin] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('vf_token')
    if (!token) { setLoading(false); return }
    getMe()
      .then((res) => setAdmin(res.admin))
      .catch(() => localStorage.removeItem('vf_token'))
      .finally(() => setLoading(false))
  }, [])

  const login = async (email, password) => {
    const res = await apiLogin(email, password)
    localStorage.setItem('vf_token', res.token)
    setAdmin(res.admin)
  }

  const logout = () => {
    localStorage.removeItem('vf_token')
    setAdmin(null)
  }

  return (
    <AuthContext.Provider value={{ admin, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
