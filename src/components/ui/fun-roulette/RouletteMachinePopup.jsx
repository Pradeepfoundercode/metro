import React, { useEffect, useState, useRef } from 'react'
import rouletteBg from '../../../assets/bg.png'
import wheelBlack from '../../../assets/wheel_black.png'
import diamondImg from '../../../assets/roulette/wheel_diamond.png'
import { playRouletteWheelSound, stopRouletteWheelSound, stopTickSound } from '../../../utils/sound'
import { ROULETTE_NUMBERS } from '../../../constants/funRouletteData'
import { speak } from '../../../utils/audio'

export default function RouletteMachinePopup({ isOpen, onClose, onResult }) {
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
      stopRouletteWheelSound()
      return
    }

    stopTickSound()
    playRouletteWheelSound()

    const randomIdx = Math.floor(
  Math.random() * ROULETTE_NUMBERS.length
)

const winnerNumber = ROULETTE_NUMBERS[randomIdx]

const POCKET_COUNT = ROULETTE_NUMBERS.length
const POCKET_ANGLE = 360 / POCKET_COUNT

const WHEEL_OFFSET = -POCKET_ANGLE

const pocketOffset =
  randomIdx * POCKET_ANGLE +
  POCKET_ANGLE / 2 +
  WHEEL_OFFSET

    const totalWheelSpins = 6
    const totalBallSpins = 13
    const spinDuration = 7600
    const startTime = performance.now()

    // Fast spin initially, followed by a smoother, gentle deceleration into the pocket
    const p0 = 0.52
    const v0 = 2 / (1 + p0)

    const calcEase = (p) => {
      if (p <= 0) return 0
      if (p >= 1) return 1
      if (p < p0) {
        return v0 * p
      }
      const t = (p - p0) / (1 - p0)
      return v0 * p0 + (1 - v0 * p0) * (1 - Math.pow(1 - t, 2.2))
    }

    const animate = (currentTime) => {
      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / spinDuration, 1)

      const ease = calcEase(progress)

      const currentWheelAngle = ease * (totalWheelSpins * 360)
      setWheelAngle(currentWheelAngle)

      const currentBallAngle = pocketOffset - (1 - ease) * (totalBallSpins * 360)
      setBallAngle(currentBallAngle)

      if (progress < 1) {
        animRef.current = requestAnimationFrame(animate)
      } else {
        setIsStopped(true)

        speak(`Winning number is ${winnerNumber}`)

        onResult?.({
          number: winnerNumber,
          index: randomIdx,
        })
      }
    }

    animRef.current = requestAnimationFrame(animate)

    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current)
      stopRouletteWheelSound()
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div 
      className="absolute inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-[2px] transition-opacity duration-300"
      onClick={onClose}
    >
      <div 
        className="relative flex flex-col items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative h-[650px] w-[880px] select-none">
          <img
            src={rouletteBg}
            alt="Roulette Machine"
            className="pointer-events-none absolute inset-0 h-full w-full object-contain drop-shadow-[0_25px_45px_rgba(0,0,0,0.95)]"
          />

          <div
            className="absolute left-1/2 top-[43%] flex aspect-square w-[66.8%] items-center justify-center"
            style={{
              transform: 'translate(-50%, -50%) scaleY(0.68)',
            }}
          >
            <div
              className="relative flex h-full w-full items-center justify-center select-none"
              style={{
                transform: `rotate(${wheelAngle}deg)`,
                willChange: 'transform',
              }}
            >
              <img
                src={wheelBlack}
                alt="Wheel"
                className="pointer-events-none h-full w-full select-none object-contain"
              />

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
