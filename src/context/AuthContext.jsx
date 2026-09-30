import React, { createContext, useEffect, useState } from 'react'

export const AuthContext = createContext(null)

const USER_KEY = 'user'
const USER_ID_KEY = 'userId'
const AUTH_KEY = 'isAuthenticated'

const getStoredUser = () => {
  try {
    const savedUser = localStorage.getItem(USER_KEY)

    return savedUser ? JSON.parse(savedUser) : null
  } catch {
    localStorage.removeItem(USER_KEY)
    return null
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(getStoredUser)

  const login = (userData) => {
    const userId = userData?.id

    const updatedUser = {
      ...userData,
    }

    setUser(updatedUser)

    localStorage.setItem(USER_KEY, JSON.stringify(updatedUser))

    if (userId) {
      localStorage.setItem(USER_ID_KEY, String(userId))
    }

    localStorage.setItem(AUTH_KEY, 'true')
  }

  const updateProfile = (profileData) => {
    setUser((currentUser) => {
      const updatedUser = {
        ...currentUser,
        ...profileData,
      }

      localStorage.setItem(USER_KEY, JSON.stringify(updatedUser))

      return updatedUser
    })
  }

  const logout = () => {
    setUser(null)

    localStorage.removeItem(USER_KEY)
    localStorage.removeItem(USER_ID_KEY)
    localStorage.removeItem(AUTH_KEY)
  }

  const value = {
    user,
    userId: user?.id || localStorage.getItem(USER_ID_KEY),
    isAuthenticated: Boolean(
      user?.id || localStorage.getItem(USER_ID_KEY)
    ),
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