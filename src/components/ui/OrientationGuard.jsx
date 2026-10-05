import React, { useState, useEffect, useCallback } from 'react'

export default function OrientationGuard({ children }) {
  const [isPortrait, setIsPortrait] = useState(() => {
    if (typeof window === 'undefined') return false
    return window.innerWidth <= 1024 && window.innerHeight > window.innerWidth
  })
  const [isForcedLandscape, setIsForcedLandscape] = useState(false)

  useEffect(() => {
    const handleResize = () => {
      const portrait = window.innerWidth <= 1024 && window.innerHeight > window.innerWidth
      setIsPortrait(portrait)
      if (!portrait) {
        setIsForcedLandscape(false)
      }
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    window.addEventListener('orientationchange', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('orientationchange', handleResize)
    }
  }, [])

  const handleTurnLandscape = useCallback(async () => {
    try {
      const docEl = document.documentElement
      if (!document.fullscreenElement) {
        if (docEl.requestFullscreen) {
          await docEl.requestFullscreen({ navigationUI: 'hide' })
        } else if (docEl.webkitRequestFullscreen) {
          await docEl.webkitRequestFullscreen()
        } else if (docEl.mozRequestFullScreen) {
          await docEl.mozRequestFullScreen()
        } else if (docEl.msRequestFullscreen) {
          await docEl.msRequestFullscreen()
        }
      }
    } catch (err) {
      // Ignored if fullscreen blocked
    }

    try {
      if (window.screen?.orientation?.lock) {
        await window.screen.orientation.lock('landscape')
      } else if (window.screen?.lockOrientation) {
        window.screen.lockOrientation('landscape')
      } else if (window.screen?.webkitLockOrientation) {
        window.screen.webkitLockOrientation('landscape')
      } else if (window.screen?.mozLockOrientation) {
        window.screen.mozLockOrientation('landscape')
      } else if (window.screen?.msLockOrientation) {
        window.screen.msLockOrientation('landscape')
      }
    } catch (err) {
      // Ignored if orientation lock not supported
    }

    setIsForcedLandscape(true)
  }, [])

  const isForced = isPortrait && isForcedLandscape

  return (
    <>
      <div className={`landscape-required ${isForced ? 'forced-landscape-hidden' : ''}`}>
        <div className="orientation-content">
          <div className="orientation-icon">
            <div className="phone-icon" />
          </div>

          <h1>PLEASE ROTATE YOUR DEVICE</h1>

          <p>
            Metro Games requires Landscape Gaming Mode
            <br />
            for full screen view.
          </p>

          <button
            type="button"
            onClick={handleTurnLandscape}
            className="rotate-message cursor-pointer transition-transform duration-150 hover:scale-105 active:scale-95 select-none outline-none"
          >
            <span className="screen-icon">▭</span>
            <span>Turn Phone Sideways to Play</span>
            <span>📱</span>
            <span>🔄</span>
          </button>
        </div>
      </div>

      <div className={`landscape-app ${isForced ? 'forced-landscape-mode' : ''}`}>
        {children}
      </div>
    </>
  )
}