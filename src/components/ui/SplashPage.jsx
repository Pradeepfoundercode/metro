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
  }, [
    progress,
    isAuthenticated,
    navigate,
  ])

  return (
    <>
      {/* =========================================
          PORTRAIT
      ========================================= */}
      <div className="landscape-required">
        <div className="orientation-content">
          <div className="orientation-icon">
            <div className="phone-icon" />
          </div>

          <h1>Please Rotate Your Device</h1>

          <p>
            This game is designed for landscape mode.
            Please rotate your device to continue.
          </p>

          <div className="rotate-message">
            <span className="screen-icon">
              ↻
            </span>

            <span>
              Rotate your device to landscape
            </span>
          </div>
        </div>
      </div>

      {/* =========================================
          SPLASH
      ========================================= */}
      <div className="game-viewport select-none">
        <div className="game-stage">

          {/* BACKGROUND */}
          <img
            src={splashBg}
            alt="Metro Casino Splash"
            className="pointer-events-none absolute inset-0 z-0 h-full w-full object-fill"
          />

          {/* OVERLAY */}
          <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-t from-black/25 via-transparent to-black/20" />

          {/* =====================================
              LOADING
          ===================================== */}
          <div className="absolute bottom-[4%] left-1/2 z-20 flex -translate-x-1/2 flex-col items-center">

            {/* PROGRESS CIRCLE */}
            <div className="relative mb-2 flex h-[32px] w-[32px] items-center justify-center">

              <svg
                className="-rotate-90 h-full w-full"
                viewBox="0 0 24 24"
                fill="none"
              >
                {/* BACKGROUND CIRCLE */}
                <circle
                  cx="12"
                  cy="12"
                  r="9"
                  stroke="#fbbf24"
                  strokeWidth="2.5"
                  className="opacity-20"
                />

                {/* PROGRESS CIRCLE */}
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

            {/* LOADING TEXT */}
            <p className="whitespace-nowrap text-center text-[12px] font-medium tracking-wide text-white">
              Loading assets... {progress}%
            </p>

          </div>

        </div>
      </div>
    </>
  )
}