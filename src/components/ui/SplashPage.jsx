import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import splashBg from '../../assets/bg/splash_bg.png'

export default function SplashPage() {
  const [progress, setProgress] = useState(0)
  const navigate = useNavigate()

  useEffect(() => {
    
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          return 100
        }
       
        const increment = Math.floor(Math.random() * 6) + 3
        const next = prev + increment
        return next > 100 ? 100 : next
      })
    }, 80)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (progress >= 100) {
      const timer = setTimeout(() => {
        navigate('/login')
      }, 350)
      return () => clearTimeout(timer)
    }
  }, [progress, navigate])

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#001742] flex items-center justify-center select-none">
     
      <img
        src={splashBg}
        alt="Metro Casino Splash"
        className="w-full h-full object-fill pointer-events-none"
      />


      <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-black/20 pointer-events-none" />

     
      <div className="absolute bottom-[6%] left-1/2 -translate-x-1/2 flex flex-col items-center justify-center z-20">
    
        <div className="relative w-5 h-5 mb-1.5 flex items-center justify-center">
          <svg
            className="animate-spin w-8 h-8 text-amber-400"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-20"
              cx="12"
              cy="12"
              r="10"
              stroke="#fbbf24"
              strokeWidth="3.5"
            />
            <path
              className="opacity-95"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v3a5 5 0 00-5 5H4z"
            />
          </svg>
          
        </div>

      
        <p className="text-white text-xs sm:text-[13px] font-medium tracking-wide drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] text-center whitespace-nowrap">
          Loading assets... {progress}%
        </p>
      </div>
    </div>
  )
}
