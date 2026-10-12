import React, { useState } from 'react'
import closeBg from '../../assets/bg/close_bg.png'
import { playGameTapSound } from '../../utils/sound'

export default function PointTransferPopup({ isOpen, onClose }) {
  const [toUsername, setToUsername] = useState('')
  const [amount, setAmount] = useState('')
  const [pin, setPin] = useState('')

  if (!isOpen) return null

  const handleClose = () => {
    playGameTapSound()
    onClose()
  }

  const handleTransfer = (e) => {
    e.preventDefault()
    playGameTapSound()

  }

  return (
    <div
      className="absolute inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-[2px] select-none"
      onClick={handleClose}
    >
      <div
        className="relative flex h-[520px] w-[760px] flex-col items-center justify-start overflow-hidden px-6 pt-5 pb-6 drop-shadow-[0_20px_50px_rgba(0,0,0,0.95)]"
        style={{
          backgroundImage: `url(${closeBg})`,
          backgroundSize: '100% 100%',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="mb-4 pt-1 pb-2 text-center text-[32px] font-semibold uppercase tracking-wider text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
          POINT TRANSFER
        </h2>

        <form
          onSubmit={handleTransfer}
          className="flex w-full flex-col items-center gap-[16px]"
        >
          {/* Row 1: To Username */}
          <div className="flex w-full max-w-[650px] items-center justify-center gap-5">
            <span className="w-[210px] text-left text-[26px] font-semibold text-white">
              To Username :
            </span>
            <label className="flex h-[72px] w-[400px] cursor-text flex-col justify-start rounded-[10px] border border-white/50 bg-transparent px-4 pt-2 transition focus-within:border-white">
              <input
                type="text"
                placeholder="Enter Username"
                value={toUsername}
                onChange={(e) => setToUsername(e.target.value)}
                className="w-full border-none bg-transparent p-0 text-[18px] font-medium text-white placeholder-zinc-500 outline-none leading-tight"
              />
            </label>
          </div>

          {/* Row 2: Amount */}
          <div className="flex w-full max-w-[650px] items-center justify-center gap-5">
            <span className="w-[210px] text-left text-[26px] font-semibold text-white">
              Amount:
            </span>
            <label className="flex h-[72px] w-[400px] cursor-text flex-col justify-start rounded-[10px] border border-white/50 bg-transparent px-4 pt-2 transition focus-within:border-white">
              <input
                type="text"
                placeholder="Enter Amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full border-none bg-transparent p-0 text-[18px] font-medium text-white placeholder-zinc-500 outline-none leading-tight"
              />
            </label>
          </div>

          {/* Row 3: Pin */}
          <div className="flex w-full max-w-[650px] items-center justify-center gap-5">
            <span className="w-[210px] text-left text-[26px] font-semibold text-white">
              Pin:
            </span>
            <label className="flex h-[72px] w-[400px] cursor-text flex-col justify-start rounded-[10px] border border-white/50 bg-transparent px-4 pt-2 transition focus-within:border-white">
              <input
                type="text"
                placeholder="Enter Pin"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                className="w-full border-none bg-transparent p-0 text-[18px] font-medium text-white placeholder-zinc-500 outline-none leading-tight"
              />
            </label>
          </div>

          {/* Buttons: Close & Transfer */}
          <div className="flex gap-35  pt-15">
            <button
              type="button"
              onClick={handleClose}
              className="flex h-[36px] min-w-[100px] cursor-pointer items-center justify-center rounded-full bg-[#ef4444]  text-[15px] font-bold text-white shadow-md transition hover:brightness-110 active:scale-95"
            >
              Close
            </button>

            <button
              type="button"
              onClick={handleTransfer}
              className="flex h-[36px] min-w-[105px] cursor-pointer items-center justify-center rounded-full bg-[#22c55e] text-[15px] font-bold text-white shadow-md transition hover:brightness-110 active:scale-95"
            >
              Transfer
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
