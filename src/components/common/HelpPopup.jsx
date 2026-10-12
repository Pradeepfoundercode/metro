import React from 'react'
import closeBg from '../../assets/bg/close_bg.png'
import cancelBtn from '../../assets/button/cancel.png'
import { playGameTapSound } from '../../utils/sound'
import toast from 'react-hot-toast'

export default function HelpPopup({ isOpen, onClose }) {
  if (!isOpen) return null

  const handleClose = () => {
    playGameTapSound()
    onClose()
  }

  const handleCopy = (text, label) => {
    playGameTapSound()
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(text)
      toast.success(`${label} copied to clipboard!`)
    }
  }

  return (
    <div
      className="absolute inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-[2px] select-none"
      onClick={handleClose}
    >
      <div
        className="relative flex h-[510px] w-[900px] flex-col items-center justify-center overflow-hidden px-8 py-8 text-center text-white drop-shadow-[0_20px_50px_rgba(0,0,0,0.95)]"
        style={{
          backgroundImage: `url(${closeBg})`,
          backgroundSize: '100% 100%',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={handleClose}
          className="absolute right-6 top-6 flex h-[34px] w-[34px] cursor-pointer items-center justify-center transition hover:scale-105 active:scale-95"
        >
          <img
            src={cancelBtn}
            alt="Close"
            className="h-full w-full object-contain drop-shadow"
          />
        </button>

        {/* Welcome Heading */}
        <h2 className="text-[36px] font-bold tracking-wide drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
          Welcome, Metro Games
        </h2>

        {/* Query & Availability Message */}
        <div className="mt-7 flex flex-col items-center leading-snug">
          <p className="text-[31px] font-semibold tracking-wide drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
            If any Game or Payment related Query's, We are
          </p>
          <p className="text-[31px] font-semibold tracking-wide drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
            available 24*7!
          </p>
        </div>

        {/* Phone */}
        <div className="mt-8 flex items-center justify-center gap-3">
          <span className="text-[31px] font-semibold tracking-wide drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
            Phone: +919999999999
          </span>
          <button
            type="button"
            onClick={() => handleCopy('+919999999999', 'Phone number')}
            title="Copy Phone"
            className="cursor-pointer p-1 text-white/80 transition hover:scale-110 hover:text-white active:scale-95"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth="2"
            >
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
            </svg>
          </button>
        </div>

        {/* Email */}
        <div className="mt-5 flex items-center justify-center gap-3">
          <span className="text-[31px] font-semibold tracking-wide drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
            Email: support@gmail.com
          </span>
          <button
            type="button"
            onClick={() => handleCopy('support@gmail.com', 'Email')}
            title="Copy Email"
            className="cursor-pointer p-1 text-white/80 transition hover:scale-110 hover:text-white active:scale-95"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth="2"
            >
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}
