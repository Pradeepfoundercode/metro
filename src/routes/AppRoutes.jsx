import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'


import Login from '../pages/auth/Login'
import ProtectedRoute from './ProtectedRoute'
import DashboardPage from '../pages/dashboard/DashboardPage'
import FunRoulette from '../pages/fun-roulette/FunRoulette'
import RouletteMiniTimer from '../pages/roulette-mini-timer/RouletteMiniTimer'
import FunTarget from '../pages/fun-target/FunTarget'
import SplashPage from '../components/common/SplashPage'

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<SplashPage />} />

      <Route path="/login" element={<Login />} />

      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/fun-roulette" element={<FunRoulette />} />
        <Route path="/roulette-mini-timer" element={<RouletteMiniTimer />} />
        <Route path="/fun-target" element={<FunTarget />} />
      </Route>

      <Route
        path="*"
        element={<Navigate to="/" replace />}
      />
    </Routes>
  )
}