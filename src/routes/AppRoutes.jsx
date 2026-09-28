import React from 'react'
import { Route, Routes } from 'react-router-dom'

import SplashPage from '../components/ui/SplashPage'
import Login from '../pages/auth/Login'

function AppRoutes() {
  return (
<Routes>
    <Route path="/" element={<SplashPage />} />
    <Route path="/login" element={<Login />} />
</Routes>
  )
}

export default AppRoutes
