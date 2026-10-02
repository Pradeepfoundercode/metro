import React, { useEffect, useState, useRef } from 'react'
import rouletteBg from '../../assets/bg.png'
import wheelBlack from '../../assets/wheel_black.png'
import diamondImg from '../../assets/roulette/wheel_diamond.png'

export default function RouletteMachinePopup({ isOpen, onClose }) {
  const [wheelAngle, setWheelAngle] = useState(0)
  const [ballAngle, setBallAngle] = useState(0)
  const [isStopped, setIsStopped] = useState(false)

  const animRef = useRef(null)

  useEffect(() => {
    if (!isOpen) {
      if (animRef.current) cancelAnimationFrame(animRef.current)
      setIsStopped(false)
      setWheelAngle(0)
      setBallAngle(0)
      return
    }

    // Pick random pocket (0 to 37)
    const randomIdx = Math.floor(Math.random() * 38)

    // Center of pocket: randomIdx * (360 / 38) + half-pocket offset (360 / 76 = 4.737 deg)
    // to land right in the center of the number instead of on the divider border
    const pocketOffset = (randomIdx * 360) / 38 + 360 / 76

    const totalWheelSpins = 4 // Wheel does 4 full rotations
    const totalBallSpins = 8  // Ball does 8 full orbits in reverse across numbers
    const spinDuration = 7600 // Smoothly decelerates over 7.6s, gently stopping around timer 2
    const startTime = performance.now()

    const animate = (currentTime) => {
      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / spinDuration, 1)

      // Smooth physical deceleration (cubic-bezier ease-out curve)
      const ease = 1 - Math.pow(1 - progress, 3.5)

      // Wheel rotates smoothly clockwise
      const currentWheelAngle = ease * (totalWheelSpins * 360)
      setWheelAngle(currentWheelAngle)

      // Ball rotates counter-clockwise across all numbers and settles into the pocket center
      const currentBallAngle = pocketOffset - (1 - ease) * (totalBallSpins * 360)
      setBallAngle(currentBallAngle)

      if (progress < 1) {
        animRef.current = requestAnimationFrame(animate)
      } else {
        setIsStopped(true)
      }
    }

    animRef.current = requestAnimationFrame(animate)

    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current)
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div 
      className="absolute inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-[2px] transition-opacity duration-300"
      onClick={onClose}
    >
      {/* ROULETTE MACHINE CONTAINER */}
      <div 
        className="relative flex flex-col items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative h-[650px] w-[880px] select-none">
          {/* 1. OUTER CASING (bg.png) */}
          <img
            src={rouletteBg}
            alt="Roulette Machine"
            className="pointer-events-none absolute inset-0 h-full w-full object-contain drop-shadow-[0_25px_45px_rgba(0,0,0,0.95)]"
          />

          {/* 2. INNER 3D TILTED BOWL CONTAINER FOR WHEEL */}
          <div
            className="absolute left-1/2 top-[43%] flex aspect-square w-[66.8%] items-center justify-center"
            style={{
              transform: 'translate(-50%, -50%) scaleY(0.68)',
            }}
          >
            {/* Wheel Container (Rotating clockwise smoothly) */}
            <div
              className="relative flex h-full w-full items-center justify-center select-none"
              style={{
                transform: `rotate(${wheelAngle}deg)`,
                willChange: 'transform',
              }}
            >
              {/* Wheel image (wheel_black.png) */}
              <img
                src={wheelBlack}
                alt="Wheel"
                className="pointer-events-none h-full w-full select-none object-contain"
              />

              {/* Ball Container (Rotating across all numbers and stopping in pocket center) */}
              <div
  className="pointer-events-none absolute inset-0 flex items-center justify-center"
  style={{
    transform: `rotate(${ballAngle}deg)`,
    willChange: 'transform',
  }}
>
  <div
    className="absolute rounded-full"
    style={{
      left: '50%',
      top: '17%',
      width: '23px',
      height: '23px',
      transform: 'translate(-50%, -50%)',

      background:
        'radial-gradient(circle at 30% 30%, #ffffff 0%, #f8fafc 35%, #cbd5e1 70%, #64748b 100%)',

      border: '1.5px solid rgba(255,255,255,0.95)',

      boxShadow:
        'inset -2px -2px 4px rgba(0,0,0,0.25), 0 2px 5px rgba(0,0,0,0.45)',

      zIndex: 25,
    }}
  />
</div>
            </div>
          </div>

          {/* 3. STATIC CENTER DIAMOND (Placed higher, no rotation) */}
          <div
            className="pointer-events-none absolute left-1/2 top-[40%] z-30 flex items-center justify-center"
            style={{
              transform: 'translate(-50%, -50%)',
            }}
          >
            <img
              src={diamondImg}
              alt="Diamond Center"
              className="h-[75px] w-[80px] object-contain drop-shadow-[0_0_15px_rgba(0,210,255,0.9)]"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
