import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import homeBg from '../../assets/bg/home_bg.png'
import cardIcon from '../../assets/card.png'
import funRouletteImg from '../../assets/3.png'
import miniTimerImg from '../../assets/4.png'
import funTargetImg from '../../assets/2.png'
import cancelBtn from '../../assets/button/cancel.png'

import { useAuth } from '../../hooks/useAuth'
import { useUserProfile } from '../../hooks/useUserProfile'

export default function DashboardPage() {
  const navigate = useNavigate()

  const {
    user,
    updateProfile,
    logout,
  } = useAuth()

  const {
    data: profileResponse,
  } = useUserProfile()

  useEffect(() => {
    if (
      profileResponse?.success &&
      profileResponse?.data
    ) {
      updateProfile(profileResponse.data)
    }
  }, [profileResponse, updateProfile])

  const handleLogout = () => {
    logout()

    navigate('/login', {
      replace: true,
    })
  }

  const balance = Number(user?.wallet ?? 0)

  return (
    <div className="relative h-screen w-screen overflow-hidden select-none bg-[#001338] font-sans">
      <img
        src={homeBg}
        alt="Metro Home"
        className="pointer-events-none absolute inset-0 h-full w-full object-fill"
      />

      <button
        type="button"
        onClick={handleLogout}
        title="Close / Exit"
        className="absolute right-0 z-40 cursor-pointer transition hover:scale-105 active:scale-95"
      >
        <img
          src={cancelBtn}
          alt="Close"
          className="h-5 w-6 drop-shadow"
        />
      </button>

      <button
        type="button"
        className="absolute right-30 top-2 flex h-5 w-7 items-center justify-center rounded-[4px] border border-[#4ade80]/60 bg-[#22c55e] sm:h-7 sm:w-8"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-5 w-7 text-white"
        >
          <path d="M4 5h16" />
          <path d="M4 12h16" />
          <path d="M4 19h16" />
        </svg>
      </button>

      <div className="pointer-events-auto absolute left-50 right-50 top-0 z-30 flex items-center justify-between px-3 pt-1 sm:px-6">
        <div className="flex flex-col items-center">
          <span className="text-[13px] font-bold tracking-wider text-white sm:text-[16px]">
            STRICTLY FOR AMUSEMENT ONLY
          </span>

          <div className="mt-0.5 flex items-center gap-2">
            <span className="text-lg font-bold text-[#dbd14b]">
              Name
            </span>

            <div className="flex h-7 w-40 items-center justify-center rounded-lg border border-[#1a4a93] bg-[#00235d] px-4 sm:h-8 sm:w-56">
              <span className="text-lg font-bold tracking-widest text-white">
                {user?.username || 'PLAYER'}
              </span>
            </div>
          </div>
        </div>

        <div className="absolute left-1/2 top-1 flex -translate-x-1/2 flex-col items-center sm:top-3">
          <img
            src={cardIcon}
            alt="Metro Cards"
            className="h-5 object-contain sm:h-6"
          />

          <span className="-mt-0.5 text-xs font-black tracking-widest text-white sm:text-sm">
            METRO
          </span>
        </div>

        <div className="flex items-center gap-2 sm:gap-2.5">
          <span className="text-xs font-bold text-[#dbd14b] sm:text-lg">
            Balance
          </span>

          <div className="flex h-7 w-40 items-center justify-center rounded-lg border border-[#1a4a93] bg-[#00235d] px-4 sm:h-8 sm:w-48">
            <span className="text-xs font-bold tracking-widest text-white sm:text-lg">
              {balance.toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      <div className="absolute inset-0 z-20 flex items-center justify-center px-3 pb-2 pt-10 sm:px-6 sm:pb-3 sm:pt-12">
        <div className="flex h-[64vh] w-full max-w-[1240px] items-center justify-center gap-4 sm:h-[68vh] sm:gap-6 md:h-[71vh] md:gap-8">
          <div
            onClick={() => navigate('/fun-roulette')}
            className="flex h-[90%] w-full max-w-[400px] cursor-pointer items-center justify-center transition-transform hover:scale-105 active:scale-95"
          >
            <img
              src={funRouletteImg}
              alt="Fun Roulette"
              className="object-contain drop-shadow-[0_14px_30px_rgba(0,0,0,0.88)]"
            />
          </div>

          <div className="flex h-[90%] w-full max-w-[400px] items-center justify-center">
            <img
              src={miniTimerImg}
              alt="Roulette Mini Timer"
              className="object-contain drop-shadow-[0_14px_30px_rgba(0,0,0,0.88)]"
            />
          </div>

          <div className="flex h-[90%] w-full max-w-[400px] items-center justify-center">
            <img
              src={funTargetImg}
              alt="Fun Target"
              className="object-contain drop-shadow-[0_14px_30px_rgba(0,0,0,0.88)]"
            />
          </div>
        </div>
      </div>
    </div>
  )
}