import React from 'react'
import { Route, Routes } from 'react-router-dom'

import SplashPage from '../components/ui/SplashPage'
import Login from '../pages/auth/Login'
import ProtectedRoute from './ProtectedRoute'
import DashboardPage from '../pages/dashboard/DashboardPage'
import FunRoulette from '../pages/fun-roulette/FunRoulette'

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<SplashPage />} />
      <Route path="/login" element={<Login />} />

      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/fun-roulette" element={<FunRoulette />} />
      </Route>
    </Routes>
  )
}