import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import splashBg from '../../assets/bg/splash_bg.png'

const assetModules = import.meta.glob('../../assets/**/*.{png,jpg,jpeg,svg,gif,webp,ico}', { eager: true })
const ASSET_URLS = Array.from(
  new Set(
    Object.values(assetModules)
      .map((mod) => (typeof mod === 'string' ? mod : mod?.default || mod))
      .filter((url) => typeof url === 'string' && url.length > 0)
  )
)

export default function SplashPage() {
  const [progress, setProgress] = useState(0)
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()

  useEffect(() => {
    const total = ASSET_URLS.length
    if (total === 0) {
      setProgress(100)
      return
    }

    let isMounted = true
    let loadedCount = 0

    const handleOneLoaded = () => {
      if (!isMounted) return
      loadedCount += 1
      const pct = Math.round((loadedCount / total) * 100)
      setProgress((prev) => (pct > prev ? pct : prev))
    }

    ASSET_URLS.forEach((src) => {
      const img = new Image()
      img.src = src

      if (img.complete) {
        handleOneLoaded()
      } else {
        img.onload = handleOneLoaded
        img.onerror = handleOneLoaded
      }
    })

    return () => {
      isMounted = false
    }
  }, [])

  useEffect(() => {
    if (progress < 100) return

    const timer = setTimeout(() => {
      const target = isAuthenticated ? '/dashboard' : '/login'
      navigate(target, { replace: true })
    }, 400)

    return () => clearTimeout(timer)
  }, [progress, navigate, isAuthenticated])

  return (
    <div className="relative flex h-screen w-screen select-none items-center justify-center overflow-hidden bg-[#001742]">
      <img
        src={splashBg}
        alt="Metro Casino Splash"
        className="pointer-events-none h-full w-full object-fill"
      />

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-black/20" />

      <div className="absolute bottom-[6%] left-1/2 z-20 flex -translate-x-1/2 flex-col items-center justify-center">
        <div className="relative mb-2 flex h-8 w-8 sm:h-7 sm:w-7 items-center justify-center">
          <svg
            className="h-full w-full -rotate-90 drop-shadow-[0_0_6px_rgba(251,191,36,0.4)]"
            viewBox="0 0 24 24"
            fill="none"
          >
            <circle
              cx="12"
              cy="12"
              r="9"
              stroke="#fbbf24"
              strokeWidth="2.5"
              className="opacity-20"
            />

            <circle
              cx="12"
              cy="12"
              r="9"
              stroke="#fbbf24"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeDasharray="56.55"
              strokeDashoffset={56.55 - (progress / 100) * 56.55}
              className="transition-all duration-150 ease-out"
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