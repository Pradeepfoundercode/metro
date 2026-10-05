import React, { createContext, useCallback, useState } from 'react'

export const AuthContext = createContext(null)

const getStoredUser = () => {
  try {
    const username = localStorage.getItem('username')
    const password = localStorage.getItem('password')

    if (!username) return null

    return {
      id: 155,
      username,
      password,
    }
  } catch {
    return null
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(getStoredUser)

  const login = useCallback((userData) => {
    setUser(userData)

    if (userData?.username) localStorage.setItem('username', userData.username)
    if (userData?.password) localStorage.setItem('password', userData.password)
  }, [])

  const updateProfile = useCallback((profileData) => {
    setUser((currentUser) => ({
      ...currentUser,
      ...profileData,
    }))
  }, [])

  const logout = useCallback(() => {
    setUser(null)
    localStorage.removeItem('username')
    localStorage.removeItem('password')
  }, [])

  const userId = user?.id || (user?.username ? 155 : null)
  const isAuthenticated = Boolean(user?.username)

  const value = {
    user,
    userId,
    isAuthenticated,
    login,
    updateProfile,
    logout,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}