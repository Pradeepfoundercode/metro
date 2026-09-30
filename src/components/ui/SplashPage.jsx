import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import splashBg from '../../assets/bg/splash_bg.png'
import { useAuth } from '../../hooks/useAuth'

const assetModules = import.meta.glob(
  '../../assets/**/*.{png,jpg,jpeg,svg,gif,webp,ico}',
  {
    eager: true,
    query: '?url',
    import: 'default',
  }
)

const ASSET_URLS = Array.from(
  new Set(
    Object.values(assetModules).filter(
      (url) =>
        typeof url === 'string' &&
        url.length > 0
    )
  )
)

export default function SplashPage() {
  const [progress, setProgress] = useState(0)

  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()

  useEffect(() => {
    let mounted = true

    const total = ASSET_URLS.length

    if (total === 0) {
      setProgress(100)
      return
    }

    let loadedCount = 0

    const handleLoaded = () => {
      if (!mounted) return

      loadedCount += 1

      const percentage = Math.min(
        100,
        Math.round((loadedCount / total) * 100)
      )

      setProgress((current) =>
        Math.max(current, percentage)
      )
    }

    ASSET_URLS.forEach((src) => {
      const image = new Image()

      image.onload = handleLoaded
      image.onerror = handleLoaded

      image.src = src

      if (image.complete) {
        handleLoaded()
      }
    })

    return () => {
      mounted = false
    }
  }, [])

  useEffect(() => {
    if (progress < 100) {
      return
    }

    const timer = setTimeout(() => {
      navigate(
        isAuthenticated
          ? '/dashboard'
          : '/login',
        {
          replace: true,
        }
      )
    }, 400)

    return () => {
      clearTimeout(timer)
    }
  }, [progress, isAuthenticated, navigate])

  return (
    <div className="relative flex h-screen w-screen items-center justify-center overflow-hidden bg-[#001742] select-none">
      <img
        src={splashBg}
        alt="Metro Casino Splash"
        className="pointer-events-none h-full w-full object-fill"
      />

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-black/20" />

      <div className="absolute bottom-[6%] left-1/2 z-20 flex -translate-x-1/2 flex-col items-center">
        <div className="relative mb-2 flex h-8 w-8 items-center justify-center">
          <svg
            className="-rotate-90 h-full w-full"
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
              strokeDashoffset={
                56.55 -
                (progress / 100) * 56.55
              }
              className="transition-all duration-150 ease-out"
            />
          </svg>
        </div>

        <p className="whitespace-nowrap text-center text-xs font-medium tracking-wide text-white">
          Loading assets... {progress}%
        </p>
      </div>
    </div>
  )
}