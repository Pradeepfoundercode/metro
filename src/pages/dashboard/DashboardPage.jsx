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
    <div className="relative h-dvh w-full overflow-hidden select-none bg-[#001338] font-sans">

      <img
        src={homeBg}
        alt="Metro Home"
        className="pointer-events-none absolute inset-0 h-full w-full object-fill"
      />

      <div className="absolute inset-0 bg-black/5" />

      <button
        type="button"
        onClick={handleLogout}
        title="Close / Exit"
        className="absolute right-[0.4%] top-[0.5%] z-50 cursor-pointer transition-transform hover:scale-105 active:scale-95"
      >
        <img
          src={cancelBtn}
          alt="Close"
          className="h-[clamp(16px,2.2vw,28px)] w-auto object-contain drop-shadow"
        />
      </button>

      <button
        type="button"
        className="absolute right-[3.5%] top-[0.8%] z-50 flex h-[clamp(20px,2.5vw,32px)] w-[clamp(28px,3.2vw,40px)] items-center justify-center rounded-[4px] border border-[#4ade80]/60 bg-[#22c55e] transition hover:brightness-110 active:scale-95"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-[65%] w-[65%] text-white"
        >
          <path d="M4 5h16" />
          <path d="M4 12h16" />
          <path d="M4 19h16" />
        </svg>
      </button>

      <header className="absolute inset-x-0 top-0 z-40 flex items-start justify-between gap-2 px-[3%] pt-[0.6%]">

        <div className="flex min-w-0 flex-1 flex-col items-start">
          <span className="max-w-[35vw] truncate text-[clamp(8px,1.1vw,16px)] font-bold tracking-wider text-white">
            STRICTLY FOR AMUSEMENT ONLY
          </span>

          <div className="mt-[2px] flex min-w-0 items-center gap-[clamp(4px,0.6vw,10px)]">
            <span className="shrink-0 text-[clamp(10px,1.3vw,20px)] font-bold text-[#dbd14b]">
              Name
            </span>

            <div className="flex h-[clamp(22px,2.4vw,34px)] w-[clamp(100px,17vw,240px)] min-w-0 items-center justify-center rounded-[6px] border border-[#1a4a93] bg-[#00235d] px-2 sm:rounded-lg sm:px-3">
              <span className="max-w-full truncate text-[clamp(10px,1.2vw,18px)] font-bold tracking-widest text-white">
                {user?.username || 'PLAYER'}
              </span>
            </div>
          </div>
        </div>

        <div className="absolute left-1/2 top-[0.5%] flex -translate-x-1/2 flex-col items-center">
          <img
            src={cardIcon}
            alt="Metro Cards"
            className="h-[clamp(16px,2vw,28px)] w-auto object-contain"
          />

          <span className="mt-[-2px] text-[clamp(8px,1vw,14px)] font-black tracking-widest text-white">
            METRO
          </span>
        </div>

        <div className="flex min-w-0 flex-1 items-center justify-end gap-[clamp(4px,0.7vw,10px)]">
          <span className="shrink-0 text-[clamp(9px,1.2vw,18px)] font-bold text-[#dbd14b]">
            Balance
          </span>

          <div className="flex h-[clamp(22px,2.4vw,34px)] w-[clamp(90px,15vw,210px)] min-w-0 items-center justify-center rounded-[6px] border border-[#1a4a93] bg-[#00235d] px-2 sm:rounded-lg sm:px-3">
            <span className="max-w-full truncate text-[clamp(9px,1.15vw,17px)] font-bold tracking-widest text-white">
              {balance.toFixed(2)}
            </span>
          </div>
        </div>
      </header>

      <main className="absolute inset-x-0 bottom-[4%] top-[11%] z-20 flex items-center justify-center px-[3%]">

        <div className="flex h-full w-full max-w-[1500px] items-center justify-center gap-[clamp(6px,2vw,32px)]">

          <button
            type="button"
            onClick={() => navigate('/fun-roulette')}
            className="group flex h-[92%] min-w-0 flex-1 items-center justify-center cursor-pointer border-0 bg-transparent p-0 outline-none transition-transform duration-200 hover:scale-[1.03] active:scale-[0.98]"
          >
            <img
              src={funRouletteImg}
              alt="Fun Roulette"
              className="h-full w-full object-contain drop-shadow-[0_14px_30px_rgba(0,0,0,0.88)]"
            />
          </button>

          <div className="flex h-[92%] min-w-0 flex-1 items-center justify-center">
            <img
              src={miniTimerImg}
              alt="Roulette Mini Timer"
              className="h-full w-full object-contain drop-shadow-[0_14px_30px_rgba(0,0,0,0.88)]"
            />
          </div>

          <div className="flex h-[92%] min-w-0 flex-1 items-center justify-center">
            <img
              src={funTargetImg}
              alt="Fun Target"
              className="h-full w-full object-contain drop-shadow-[0_14px_30px_rgba(0,0,0,0.88)]"
            />
          </div>

        </div>
      </main>
    </div>
  )
}