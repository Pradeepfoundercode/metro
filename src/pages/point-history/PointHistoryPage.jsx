import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { playGameTapSound } from '../../utils/sound'
import bgImage from '../../assets/bg/bg.png'
import { useAuth } from '../../hooks/useAuth'
import {  recieverTransfer, senderTransferList } from '../../services/auth.service'

export default function PointHistoryPage() {
  const navigate = useNavigate()

  const [isReceivableSelected, setIsReceivableSelected] = useState(false)
  const [isTransferableSelected, setIsTransferableSelected] = useState(false)

  const { user } = useAuth()


useEffect(() => {
  if (!user?.id) return

  const fetchHistory = async () => {
    try {
      const receiver = await recieverTransfer(user.id)
      // setReceivableData(receiver)

      const sender = await senderTransferList(user.id)
      // setTransferableData(sender)
    } catch (error) {
      console.log(error)
    }
  }

  fetchHistory()
}, [user?.id])

  const handleBack = () => {
    playGameTapSound()
    if (window.history.length > 1) {
      navigate(-1)
    } else {
      navigate('/dashboard')
    }
  }

  const handleReceive = () => {
    playGameTapSound()
  }

  const handleReject = () => {
    playGameTapSound()
  }

  const handleSenderReject = () => {
    playGameTapSound()
  }

  return (
    <div className="game-viewport select-none font-sans">
      <div className="game-stage">
        {/* Background Image using the exact same bg.png */}
        <img
          src={bgImage}
          alt="Background"
          className="pointer-events-none absolute inset-0 z-0 h-full w-full object-fill"
        />

        {/* Top Left "Back" Button */}
        <button
          type="button"
          onClick={handleBack}
          className="absolute left-0 top-0 z-30 flex h-[68px] w-[288px] cursor-pointer items-center justify-center border-0 bg-[#c88000] text-[20px] font-semibold text-black transition-all hover:brightness-110 active:scale-95"
        >
          Back
        </button>

        {/* Top Action Buttons (Receive, Reject, Sender Reject) */}
        <div className="absolute top-[102px] z-20 flex w-full items-center">
          {/* Receive Button */}
          <button
            type="button"
            onClick={handleReceive}
            className="absolute left-[450px] flex h-[46px] min-w-[115px] cursor-pointer items-center justify-center rounded-[8px] border border-white/80 bg-[#04163d]/90 px-6 text-[18px] font-medium text-white transition hover:bg-[#072464] active:scale-95"
          >
            Receive
          </button>

          {/* Reject Button */}
          <button
            type="button"
            onClick={handleReject}
            className="absolute left-[920px] flex h-[46px] min-w-[105px] cursor-pointer items-center justify-center rounded-[8px] border border-white/80 bg-[#04163d]/90 px-6 text-[18px] font-medium text-white transition hover:bg-[#072464] active:scale-95"
          >
            Reject
          </button>

          {/* Sender Reject Button */}
          <button
            type="button"
            onClick={handleSenderReject}
            className="absolute left-[1380px] flex h-[46px] min-w-[165px] cursor-pointer items-center justify-center rounded-[8px] border border-white/80 bg-[#04163d]/90 px-6 text-[18px] font-medium text-white transition hover:bg-[#072464] active:scale-95"
          >
            Sender Reject
          </button>
        </div>

        {/* Section Titles: Receivable & Transferable */}
        <div className="absolute top-[180px] z-20 w-full">
          <h2 className="absolute left-[200px] text-[34px] font-semibold tracking-wide text-white">
            Receivable
          </h2>

          <h2 className="absolute left-[1000px] text-[34px] font-semibold tracking-wide text-white">
            Transferable
          </h2>
        </div>

        {/* Bottom "Select All" Controls */}
        <div className="absolute bottom-[68px] z-20 w-full">
          {/* Left: Select All (Receivable) */}
          <button
            type="button"
            onClick={() => {
              playGameTapSound()
              setIsReceivableSelected((prev) => !prev)
            }}
            className="absolute left-[200px] flex cursor-pointer items-center gap-3 border-0 bg-transparent text-white transition hover:opacity-90 active:scale-95"
          >
            <div
              className={`flex h-[24px] w-[24px] items-center justify-center rounded-[3px] border-2 border-white ${
                isReceivableSelected ? 'bg-[#38bdf8]' : 'bg-transparent'
              }`}
            >
              {isReceivableSelected && (
                <span className="text-[16px] font-bold text-black">✓</span>
              )}
            </div>
            <span className="text-[25px] font-medium text-white">
              Select All
            </span>
          </button>

          {/* Right: Select All (Transferable) */}
          <button
            type="button"
            onClick={() => {
              playGameTapSound()
              setIsTransferableSelected((prev) => !prev)
            }}
            className="absolute left-[1000px] flex cursor-pointer items-center gap-3 border-0 bg-transparent text-white transition hover:opacity-90 active:scale-95"
          >
            <div
              className={`flex h-[24px] w-[24px] items-center justify-center rounded-[3px] border-2 border-white ${
                isTransferableSelected ? 'bg-[#38bdf8]' : 'bg-transparent'
              }`}
            >
              {isTransferableSelected && (
                <span className="text-[16px] font-bold text-black">✓</span>
              )}
            </div>
            <span className="text-[25px] font-medium text-white">
              Select All
            </span>
          </button>
        </div>
      </div>
    </div>
  )
}
