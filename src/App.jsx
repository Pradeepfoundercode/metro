import React from 'react'
import { QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'


import AppRoutes from './routes/AppRoutes'
import queryClient from './utils/queryClient'
import { AuthProvider } from './context/AuthContext'

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Toaster
          position="top-center"
          toastOptions={{
            style: {
              background: '#04112e',
              color: '#fff',
              border: '1px solid rgba(56, 189, 248, 0.4)',
              fontSize: '13px',
              fontWeight: 'bold',
            },
          }}
        />

        <AppRoutes />
      </AuthProvider>
    </QueryClientProvider>
  )
}