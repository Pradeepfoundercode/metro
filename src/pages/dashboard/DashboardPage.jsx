import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import homeBg from '../../assets/bg/home_bg.png'
import cardIcon from '../../assets/card.png'
import funRouletteImg from '../../assets/3.png'
import miniTimerImg from '../../assets/4.png'
import funTargetImg from '../../assets/2.png'
import cancelBtn from '../../assets/button/cancel.png'
import closeBg from '../../assets/bg/close_bg.png'

import { useAuth } from '../../hooks/useAuth'
import { useWalletStore } from '../../store/useWalletStore'
import { useFullscreenLandscape } from '../../hooks/useFullscreen'
import { playGameTapSound } from '../../utils/sound'
import GameHistoryPopup from '../../components/common/GameHistoryPopup'
import PointTransferPopup from '../../components/common/PointTransferPopup'
import HelpPopup from '../../components/common/HelpPopup'
import { getFunRouletteBetHistory } from '../../services/funroulette.service'

export default function DashboardPage() {
  const navigate = useNavigate()
  const { enterFullscreen } = useFullscreenLandscape()

  const { user, logout } = useAuth()
  const { wallet } = useWalletStore()

  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isHistoryOpen, setIsHistoryOpen] = useState(false)
  const [isTransferOpen, setIsTransferOpen] = useState(false)
  const [isHelpOpen, setIsHelpOpen] = useState(false)
  const [historyData, setHistoryData] = useState([])





  useEffect(() => {
  if (!user?.id) return

  const fetchHistory = async () => {
    try {
      const res = await getFunRouletteBetHistory(user.id)
      setHistoryData(res.data || [])
    } catch (error) {
      console.log(error)
    }
  }

  fetchHistory()
}, [user?.id])

  const handleLogout = async () => {
    setIsMenuOpen(false)
    logout()
    navigate('/login', {
      replace: true,
    })
  }

  const handleMenuItem = (item) => {
    setIsMenuOpen(false)
    playGameTapSound()
    if (item === 'Pay History') {
      navigate('/pay-history')
    } else if (item === 'Point History') {
      navigate('/point-history')
    } else if (item === 'Point Transfer') {
      setIsTransferOpen(true)
    } else if (item === 'Game History') {
      setIsHistoryOpen(true)
    } else if (item === 'Help') {
      setIsHelpOpen(true)
    }
  }

  const handleFunRoulette = async () => {
    playGameTapSound()
    await enterFullscreen()
    navigate('/fun-roulette')
  }

  const handleRouletteMiniTimer = async () => {
    playGameTapSound()
    await enterFullscreen()
    navigate('/roulette-mini-timer')
  }

  const handleFunTarget = async () => {
    playGameTapSound()
    await enterFullscreen()
    navigate('/fun-target')
  }

  return (
    <div className="game-viewport select-none font-sans">
      <div className="game-stage">
        <img
          src={homeBg}
          alt="Metro Home"
          className="pointer-events-none absolute inset-0 h-full w-full object-fill"
        />

        <div className="pointer-events-none absolute inset-0 bg-black/5" />

        {/* =========================================
            TOP LEFT: NAME & AMUSEMENT NOTICE
        ========================================= */}
        <div className="absolute left-[160px] top-[14px] z-50 flex flex-col items-start">
          <span className="text-[15px] font-bold tracking-wider text-white">
            STRICTLY FOR AMUSEMENT ONLY
          </span>

          <div className="mt-1 flex items-center gap-3">
            <span className="shrink-0 text-[19px] font-bold text-[#dbd14b]">
              Name
            </span>

            <div className="flex h-[36px] w-[220px] min-w-0 items-center justify-center rounded-lg border border-[#1a4a93] bg-[#00235d] px-3">
              <span className="max-w-full truncate text-[17px] font-bold tracking-widest text-white">
                {user?.username}
              </span>
            </div>
          </div>
        </div>

        {/* =========================================
            CENTER METRO LOGO
        ========================================= */}
        <div className="pointer-events-none absolute left-1/2 top-[12px] z-40 flex -translate-x-1/2 flex-col items-center">
          <img
            src={cardIcon}
            alt="Metro Cards"
            className="h-[46px] w-auto object-contain"
          />
          <span className="mt-0.5 text-[12px] font-black tracking-widest text-white">
            METRO
          </span>
        </div>

        {/* =========================================
            BALANCE (TOP RIGHT)
        ========================================= */}
        {!isHistoryOpen && (
          <div className="absolute right-[280px] top-[22px] z-50 flex items-center gap-3">
            <span className="shrink-0 text-[19px] font-bold text-[#dbd14b]">
              Balance
            </span>

            <div className="flex h-[36px] w-[210px] min-w-0 items-center justify-center rounded-lg border border-[#1a4a93] bg-[#00235d] px-3">
              <span className="max-w-full truncate text-[17px] font-bold tracking-widest text-white">
                {Number(wallet).toFixed(2)}
              </span>
            </div>
          </div>
        )}

        {/* =========================================
            GREEN MENU BUTTON
        ========================================= */}
        {!isHistoryOpen && (
          <button
            type="button"
            onClick={() => setIsMenuOpen((prev) => !prev)}
            title="Menu"
            className="absolute right-[170px] top-[18px] z-[60] flex h-[44px] w-[48px] cursor-pointer items-center justify-center rounded-md border border-[#4ade80]/70 bg-[#22c55e] p-0 transition hover:brightness-110 active:scale-95 shadow-md"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-[26px] w-[26px] text-white"
            >
              <path d="M4 6h16" />
              <path d="M4 12h16" />
              <path d="M4 18h16" />
            </svg>
          </button>
        )}

        {/* =========================================
            CLOSE (LOGOUT) BUTTON
        ========================================= */}
        {!isHistoryOpen && (
          <button
            type="button"
            onClick={handleLogout}
            className="absolute right-[30px] top-[18px] z-[60] flex cursor-pointer items-center justify-center border-0 bg-transparent p-0 outline-none transition-transform duration-150 hover:scale-105 active:scale-95"
          >
            <img
              src={cancelBtn}
              alt="Close"
              className="h-[44px] w-auto object-contain drop-shadow"
            />
          </button>
        )}

        {/* =========================================
            DROPDOWN MENU
        ========================================= */}
        {isMenuOpen && !isHistoryOpen && (
          <>
            {/* Backdrop to close menu on outside click */}
            <div
              className="absolute inset-0 z-[65] cursor-default"
              onClick={() => setIsMenuOpen(false)}
            />

        
            <div
              style={{
                backgroundImage: `url(${closeBg})`,
                backgroundSize: '100% 100%',
                backgroundRepeat: 'no-repeat',
              }}
              className="absolute right-[80px] top-[74px] z-[70] flex w-[230px] flex-col gap-1 p-1 pb-4 drop-shadow-[0_12px_35px_rgba(0,0,0,0.95)]"
            >
              {[
                
                { label: 'Point History', action: () => handleMenuItem('Point History') },
                { label: 'Point Transfer', action: () => handleMenuItem('Point Transfer') },
                { label: 'Game History', action: () => handleMenuItem('Game History') },
                { label: 'Help', action: () => handleMenuItem('Help') },
                { label: 'Logout', action: handleLogout },
              ].map((item, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={item.action}
                  className="w-full cursor-pointer rounded px-2 py-1 text-center text-[20px] font-semibold tracking-wider text-[#e8dd4b] transition hover:scale-105 active:scale-95 hover:text-white"
                >
                  {item.label}
                </button>
              ))}
            </div>
          </>
        )}

        {/* GAME HISTORY POPUP (FUN ROULETTE) */}
        <GameHistoryPopup
          isOpen={isHistoryOpen}
          onClose={() => setIsHistoryOpen(false)}
          historyData={historyData}
          title="ROULETTE GAME HISTORY"
          gameName="FUN ROULETTE"
          resultLabel="Ball Position"
          userName={user?.username || 'PLAYER'}
          balance={wallet || 0}
        />

        {/* POINT TRANSFER POPUP */}
        <PointTransferPopup
          isOpen={isTransferOpen}
          onClose={() => setIsTransferOpen(false)}
        />

        {/* HELP POPUP */}
        <HelpPopup
          isOpen={isHelpOpen}
          onClose={() => setIsHelpOpen(false)}
        />

        {/* =========================================
            GAME AREA
        ========================================= */}
        <main className="absolute inset-x-0 bottom-[40px] top-[110px] z-20 flex items-center justify-center px-[40px]">
          <div className="flex h-full w-[1500px] items-center justify-center gap-12">
            {/* FUN ROULETTE */}
            <button
              type="button"
              onClick={handleFunRoulette}
              className="group flex h-[85%] min-w-0 flex-1 cursor-pointer items-center justify-center border-0 bg-transparent p-0 outline-none transition-transform duration-200 hover:scale-[1.03] active:scale-[0.98]"
            >
              <img
                src={funRouletteImg}
                alt="Fun Roulette"
                className="h-full w-full object-contain drop-shadow-[0_12px_25px_rgba(0,0,0,0.88)]"
              />
            </button>

            {/* ROULETTE MINI TIMER */}
            <button
              type="button"
              onClick={handleRouletteMiniTimer}
              className="group flex h-[85%] min-w-0 flex-1 cursor-pointer items-center justify-center border-0 bg-transparent p-0 outline-none transition-transform duration-200 hover:scale-[1.03] active:scale-[0.98]"
            >
              <img
                src={miniTimerImg}
                alt="Roulette Mini Timer"
                className="h-full w-full object-contain drop-shadow-[0_12px_25px_rgba(0,0,0,0.88)]"
              />
            </button>

            {/* FUN TARGET */}
            <button
              type="button"
              onClick={handleFunTarget}
              className="group flex h-[85%] min-w-0 flex-1 cursor-pointer items-center justify-center border-0 bg-transparent p-0 outline-none transition-transform duration-200 hover:scale-[1.03] active:scale-[0.98]"
            >
              <img
                src={funTargetImg}
                alt="Fun Target"
                className="h-full w-full object-contain drop-shadow-[0_12px_25px_rgba(0,0,0,0.88)]"
              />
            </button>
          </div>
        </main>
      </div>
    </div>
  )
}