import { sleep } from '@/lib/utils'
import { createContext, use, useCallback, useEffect, useState } from 'react'

const AuthContext = createContext(null)

const key = 'tanstack.auth.user'

function getStoredUser() {
  return localStorage.getItem(key)
}

function setStoredUser(user) {
  if (user) {
    localStorage.setItem(key, user)
  }
  else {
    localStorage.removeItem(key)
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => getStoredUser())
  const isAuthenticated = !!user

  const logout = useCallback(async () => {
    await sleep(250)

    setStoredUser(null)
    setUser(null)
  }, [])

  const login = useCallback(async (username) => {
    await sleep(500)

    setStoredUser(username)
    setUser(username)
  }, [])

  useEffect(() => {
    setUser(getStoredUser())
  }, [])

  return (
    <AuthContext value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext>
  )
}

export function useAuth() {
  const context = use(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
