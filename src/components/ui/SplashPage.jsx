import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import splashBg from '../../assets/bg/splash_bg.png'

export default function SplashPage() {
  const [progress, setProgress] = useState(0)
  const navigate = useNavigate()

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((currentProgress) => {
        if (currentProgress >= 100) {
          clearInterval(interval)
          return 100
        }

        const increment =
          Math.floor(Math.random() * 6) + 3

        return Math.min(
          currentProgress + increment,
          100
        )
      })
    }, 80)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (progress < 100) return

    const timer = setTimeout(() => {
      navigate('/login', { replace: true })
    }, 350)

    return () => clearTimeout(timer)
  }, [progress, navigate])

  return (
    <div className="relative flex h-screen w-screen select-none items-center justify-center overflow-hidden bg-[#001742]">
      <img
        src={splashBg}
        alt="Metro Casino Splash"
        className="pointer-events-none h-full w-full object-fill"
      />

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-black/20" />

      <div className="absolute bottom-[6%] left-1/2 z-20 flex -translate-x-1/2 flex-col items-center justify-center">
        <div className="relative mb-1.5 flex h-5 w-5 items-center justify-center">
          <svg
            className="h-8 w-8 animate-spin text-amber-400"
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

        <p className="whitespace-nowrap text-center text-xs font-medium tracking-wide text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] sm:text-[13px]">
          Loading assets... {progress}%
        </p>
      </div>
    </div>
  )
}