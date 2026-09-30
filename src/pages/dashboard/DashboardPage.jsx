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
  }, [
    profileResponse,
    updateProfile,
  ])

  const handleLogout = async () => {
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen()
      }
    } catch {}

    logout()

    navigate('/login', {
      replace: true,
    })
  }

  const enterGameFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen({
          navigationUI: 'hide',
        })
      }
    } catch (error) {
      console.log(
        'Fullscreen request was blocked:',
        error
      )
    }

    try {
      if (
        screen.orientation &&
        screen.orientation.lock
      ) {
        await screen.orientation.lock(
          'landscape'
        )
      }
    } catch (error) {
      console.log(
        'Landscape lock not supported:',
        error
      )
    }
  }

  const handleFunRoulette = async () => {
    await enterGameFullscreen()

    navigate('/fun-roulette')
  }

  const balance = Number(
    user?.wallet ?? 0
  )

  return (
    <div className="relative h-dvh w-full overflow-hidden select-none bg-[#001338] font-sans">


      <img
        src={homeBg}
        alt="Metro Home"
        className="pointer-events-none absolute inset-0 h-full w-full object-fill"
      />

      <div className="pointer-events-none absolute inset-0 bg-black/5" />

   

      <div className="absolute left-[10%] top-[1%] z-50 flex flex-col items-start">

        <span className="max-w-[34vw] truncate text-[clamp(8px,1vw,15px)] font-bold tracking-wider text-white">
          STRICTLY FOR AMUSEMENT ONLY
        </span>

        <div className="mt-[2px] flex items-center gap-[clamp(4px,0.5vw,9px)]">

          <span className="shrink-0 text-[clamp(9px,1.15vw,18px)] font-bold text-[#dbd14b]">
            Name
          </span>

          <div className="flex h-[clamp(21px,2.2vw,32px)] w-[clamp(95px,15vw,215px)] min-w-0 items-center justify-center rounded-[5px] border border-[#1a4a93] bg-[#00235d] px-2 sm:rounded-lg sm:px-3">

            <span className="max-w-full truncate text-[clamp(9px,1.05vw,16px)] font-bold tracking-widest text-white">
              {user?.username || 'PLAYER'}
            </span>

          </div>

        </div>

      </div>

      {/* =========================================
          CENTER METRO LOGO
      ========================================= */}

      <div className="pointer-events-none absolute left-1/2 top-[2%] z-40 flex -translate-x-1/2 flex-col items-center">

        <img
          src={cardIcon}
          alt="Metro Cards"
          className="h-auto w-[5%] object-contain"
        />

        <span className="mt-[-2px] text-[clamp(7px,0.9vw,13px)] font-black tracking-widest text-white">
          METRO
        </span>

      </div>

      {/* =========================================
          RIGHT CONTROLS
      ========================================= */}

      {/* CLOSE */}

      <button
        type="button"
        onClick={handleLogout}
        title="Close / Exit"
        className="absolute right-[0.7%] top-[0.6%] z-[60] flex cursor-pointer items-center justify-center border-0 bg-transparent p-0 outline-none transition-transform duration-150 hover:scale-105 active:scale-95"
      >
        <img
          src={cancelBtn}
          alt="Close"
          className="h-[clamp(15px,1.9vw,26px)] w-auto object-contain drop-shadow"
        />
      </button>

      {/* GREEN MENU */}

      <button
        type="button"
        title="Menu"
        className="absolute right-[8%] top-[1%] z-[60] flex h-auto  w-[3%] cursor-pointer items-center justify-center rounded-[4px] border border-[#4ade80]/70 bg-[#22c55e] p-0 transition hover:brightness-110 active:scale-95"
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

      {/* =========================================
          BALANCE
      ========================================= */}

      <div className="absolute right-[15%] top-[3%] z-50 flex items-center gap-[clamp(4px,0.5vw,9px)]">

  <span className="shrink-0 text-[clamp(9px,1.15vw,18px)] font-bold text-[#dbd14b]">
    Balance
  </span>

  <div className="flex h-[clamp(21px,2.2vw,32px)] w-[clamp(90px,13vw,190px)] min-w-0 items-center justify-center rounded-[5px] border border-[#1a4a93] bg-[#00235d] px-2 sm:rounded-lg sm:px-3">

    <span className="max-w-full truncate text-[clamp(9px,1vw,16px)] font-bold tracking-widest text-white">
      {balance.toFixed(2)}
    </span>

  </div>

</div>

      {/* =========================================
          GAME AREA
      ========================================= */}

      <main className="absolute inset-x-0 bottom-[4%] top-[13%] z-20 flex items-center justify-center px-[3%]">

        <div className="flex h-full w-[500px] md:w-[1250px]  items-center justify-center gap-6">

          {/* =====================================
              FUN ROULETTE
          ===================================== */}

          <button
            type="button"
            onClick={handleFunRoulette}
            className="group flex h-[84%] min-w-0 flex-1 cursor-pointer items-center justify-center border-0 bg-transparent p-0 outline-none transition-transform duration-200 hover:scale-[1.025] active:scale-[0.98]"
          >

            <img
              src={funRouletteImg}
              alt="Fun Roulette"
              className="h-full w-full object-contain "
            />

          </button>

          {/* =====================================
              MINI TIMER
          ===================================== */}

          <div className="flex h-[84%] min-w-0 flex-1 items-center justify-center">

            <img
              src={miniTimerImg}
              alt="Roulette Mini Timer"
              className="h-full w-full object-contain drop-shadow-[0_12px_25px_rgba(0,0,0,0.88)]"
            />

          </div>

          {/* =====================================
              FUN TARGET
          ===================================== */}

          <div className="flex h-[84%] min-w-0 flex-1 items-center justify-center">

            <img
              src={funTargetImg}
              alt="Fun Target"
              className="h-full w-full object-contain drop-shadow-[0_12px_25px_rgba(0,0,0,0.88)]"
            />

          </div>

        </div>

      </main>

    </div>
  )
}