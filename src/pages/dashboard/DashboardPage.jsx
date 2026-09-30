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
  const { user, updateProfile, logout } = useAuth()
  const { data: profileResponse } = useUserProfile()

  const navigate = useNavigate()

  useEffect(() => {
    if (profileResponse?.success && profileResponse?.data) {
      updateProfile(profileResponse.data)
    }
  }, [profileResponse, updateProfile])

  const handleLogout = () => {
    logout()
    navigate('/login', {
      replace: true,
    })
  }

  const balance = Number(user?.wallet ?? 8486)

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
          className="h-5 w-6  drop-shadow"
        />
      </button>

      <button
            type="button"
            className=" absolute right-30 top-2 flex h-5 w-7 sm:h-7 sm:w-8 cursor-pointer items-center justify-center rounded-[4px] border border-[#4ade80]/60 bg-[#22c55e] "
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
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

      <div className="absolute top-0 left-50 right-50 z-30 flex items-center justify-between px-3 pt-1 sm:px-6 pointer-events-auto">
        <div className="flex flex-col items-center">
          <span className="text-[13px] sm:text-[16px] font-bold tracking-wider text-white select-none">
            STRICTLY FOR AMUSEMENT ONLY
          </span>

          <div className="mt-0.5 flex items-center gap-2">
            <span className="text-lg font-bold text-[#dbd14b] select-none">
              Name
            </span>

            <div className="flex h-7 sm:h-8 w-40 sm:w-56 items-center justify-center rounded-lg border border-[#1a4a93] bg-[#00235d] px-4 ">
              <span className="text-lg font-bold tracking-widest text-white  ">
                {user?.username || 'PLAYER'}
              </span>
            </div>
          </div>
        </div>

        <div className="absolute left-1/2 top-1 sm:top-3 flex -translate-x-1/2 flex-col items-center select-none">
          <img
            src={cardIcon}
            alt="Metro Cards"
            className="h-5 sm:h-6 object-contain"
          />

          <span className="-mt-0.5 text-xs sm:text-sm font-black tracking-widest text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]">
            METRO
          </span>
        </div>

        <div className="flex items-center gap-2 sm:gap-2.5 ">
          <div className="flex items-center gap-2">
            <span className="text-xs sm:text-lg font-bold text-[#dbd14b] select-none">
              Balance
            </span>

            <div className="flex h-7 sm:h-8 w-40 sm:w-48 items-center justify-center rounded-lg border border-[#1a4a93] bg-[#00235d] px-4 ">
              <span className="text-xs sm:text-lg font-bold tracking-widest text-white">
                {balance.toFixed(2)}
              </span>
            </div>
          </div>

        </div>
      </div>

      <div className="absolute inset-0 z-20 flex items-center justify-center px-3 sm:px-6 pt-10 sm:pt-12 pb-2 sm:pb-3">
        <div className="flex w-full max-w-[1240px] h-[64vh] sm:h-[68vh] md:h-[71vh] items-center justify-center gap-4 sm:gap-6 md:gap-8">
          <div
            onClick={() => navigate('/fun-roulette')}
            className="h-[90%] w-full max-w-[400px] xl:max-w-[400px] flex items-center justify-center cursor-pointer transition-transform hover:scale-105 active:scale-95"
          >
            <img
              src={funRouletteImg}
              alt="Fun Roulette"
              className=" object-contain drop-shadow-[0_14px_30px_rgba(0,0,0,0.88)]"
            />
          </div>

          <div className="h-[90%]  w-full max-w-[400px] xl:max-w-[400px] flex items-center justify-center cursor-pointer transition-transform ">
            <img
              src={miniTimerImg}
              alt="Roulette Mini Timer"
              className=" object-contain drop-shadow-[0_14px_30px_rgba(0,0,0,0.88)]"
            />
          </div>

          <div className="h-[90%]  w-full max-w-[400px] xl:max-w-[400px] flex items-center justify-center cursor-pointer transition-transform">
            <img
              src={funTargetImg}
              alt="Fun Target"
              className=" object-contain drop-shadow-[0_14px_30px_rgba(0,0,0,0.88)]"
            />
          </div>
        </div>
      </div>
    </div>
  )
}