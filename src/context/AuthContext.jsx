import React, { createContext, useCallback, useState } from 'react'

export const AuthContext = createContext(null)

const USER_KEY = 'user'
const USER_ID_KEY = 'userId'

const getStoredUser = () => {
  try {
    const savedUser = localStorage.getItem(USER_KEY)

    if (!savedUser) {
      return null
    }

    return JSON.parse(savedUser)
  } catch {
    localStorage.removeItem(USER_KEY)
    localStorage.removeItem(USER_ID_KEY)

    return null
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(getStoredUser)

  const login = useCallback((userData) => {
    const updatedUser = {
      ...userData,
    }

    setUser(updatedUser)

    localStorage.setItem(USER_KEY, JSON.stringify(updatedUser))

    if (updatedUser?.id) {
      localStorage.setItem(USER_ID_KEY, String(updatedUser.id))
    }
  }, [])

  const updateProfile = useCallback((profileData) => {
    setUser((currentUser) => {
      const updatedUser = {
        ...currentUser,
        ...profileData,
      }

      localStorage.setItem(USER_KEY, JSON.stringify(updatedUser))

      if (updatedUser?.id) {
        localStorage.setItem(USER_ID_KEY, String(updatedUser.id))
      }

      return updatedUser
    })
  }, [])

  const logout = useCallback(() => {
    setUser(null)

    localStorage.removeItem(USER_KEY)
    localStorage.removeItem(USER_ID_KEY)
  }, [])

  const userId =
    user?.id || localStorage.getItem(USER_ID_KEY)

  const isAuthenticated = Boolean(userId)

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