import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import homeBg from '../../assets/bg/home_bg.png'
import cardIcon from '../../assets/card.png'
import funRouletteImg from '../../assets/3.png'
import miniTimerImg from '../../assets/4.png'
import funTargetImg from '../../assets/2.png'
import cancelBtn from '../../assets/button/cancel.png'

import { useAuth } from '../../hooks/useAuth'
import { useWalletStore } from '../../store/useWalletStore'
import { useFullscreenLandscape } from '../../hooks/useFullscreen'

export default function DashboardPage() {
  const navigate = useNavigate()
  const { enterFullscreen } = useFullscreenLandscape()

  const { user, logout } = useAuth()
  const { wallet } = useWalletStore()

  const handleLogout = async () => {
    logout()
    navigate('/login', {
      replace: true,
    })
  }

  const handleFunRoulette = async () => {
    await enterFullscreen()
    navigate('/fun-roulette')
  }

  const handleRouletteMiniTimer = async () => {
    await enterFullscreen()
    navigate("/roulette-mini-timer")
  }

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

      <div className="pointer-events-none absolute left-1/2 top-[1%] z-40 flex -translate-x-1/2 flex-col items-center">

        <img
          src={cardIcon}
          alt="Metro Cards"
          className="h-auto w-[5%] object-contain"
        />

        <span className="mt-[-2px] text-[clamp(7px,0.9vw,10px)]  font-black tracking-widest text-white">
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
        className="absolute right-[0.7%] top-[1%] z-[60] flex cursor-pointer items-center justify-center border-0 bg-transparent p-0 outline-none transition-transform duration-150 hover:scale-105 active:scale-95"
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
        className="absolute right-[8%] top-[1%] z-[60] flex h-auto  w-[2.5%] cursor-pointer items-center justify-center rounded-[4px] border border-[#4ade80]/70 bg-[#22c55e] p-0 transition hover:brightness-110 active:scale-95"
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

      <div className="absolute right-[15%] top-[4.5%] z-50 flex items-center gap-[clamp(4px,0.5vw,9px)]">

  <span className="shrink-0 text-[clamp(9px,1.15vw,18px)] font-bold text-[#dbd14b]">
    Balance
  </span>

  <div className="flex h-[clamp(21px,2.2vw,32px)] w-[clamp(90px,13vw,190px)] min-w-0 items-center justify-center rounded-[5px] border border-[#1a4a93] bg-[#00235d] px-2 sm:rounded-lg sm:px-3">

    <span className="max-w-full truncate text-[clamp(9px,1vw,16px)] font-bold tracking-widest text-white">
      {Number(wallet).toFixed(2)}
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
          <button
            type="button"
            onClick={handleRouletteMiniTimer}
            className="group flex h-[84%] min-w-0 flex-1 cursor-pointer items-center justify-center border-0 bg-transparent p-0 outline-none transition-transform duration-200 hover:scale-[1.025] active:scale-[0.98]"
          >

            <img
              src={miniTimerImg}
              alt="Roulette Mini Timer"
              className="h-full w-full object-contain "
            />

          </button>

         

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