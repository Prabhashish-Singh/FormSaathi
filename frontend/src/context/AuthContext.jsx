import { useEffect, useMemo, useState } from 'react'
import AuthContext from './auth-context'
import {
  getCurrentUser,
  loginUser,
  logoutUser,
  onAuthStateChange,
  registerUser,
  loginWithGoogle,
} from '../services/authService'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    getCurrentUser()
      .then((currentUser) => {
        if (active) setUser(currentUser)
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    const { data } = onAuthStateChange((nextUser) => {
      if (active) setUser(nextUser)
    })
    return () => {
      active = false
      data.subscription.unsubscribe()
    }
  }, [])

  const login = async (email, password, remember) => {
    const currentUser = await loginUser(email, password, remember)
    setUser(currentUser)
    return currentUser
  }

  const register = async (userData) => {
    const result = await registerUser(userData)
    setUser(result.user && result.needsConfirmation ? null : result.user)
    return result
  }

  const loginWithGoogleAuth = () => loginWithGoogle()

  const logout = async () => {
    await logoutUser()
    setUser(null)
  }

  const value = useMemo(() => ({ user, loading, login, register, logout, loginWithGoogleAuth }), [user, loading])
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
