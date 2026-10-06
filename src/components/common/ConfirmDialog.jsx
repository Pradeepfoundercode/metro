import React from 'react'
import yesBtn from '../../assets/button/yes_btn.png'
import noBtn from '../../assets/button/no_btn.png'

export default function ConfirmDialog({
  isOpen,
  onClose,
  onCancel,
  onConfirm,
  message = (
    <>
      Are you sure you want to<br />go to Lobby?
    </>
  ),
}) {
  if (!isOpen) return null

  const handleCancel = onCancel || onClose

  return (
    <div
      className="absolute inset-0 z-50 flex items-center justify-center select-none "
      onClick={handleCancel}
    >
      {/* POPUP CARD */}
      <div
        className="relative w-[100%] h-[42%] max-w-[570px] rounded-[22px] border-[5px] border-[#dfa72a]  shadow-[0_0_50px_rgba(0,0,0,0.95)] flex flex-col gap-6 items-center justify-center overflow-hidden"
        style={{
          background:
            'radial-gradient(circle at 50% 20%, #2a0515 0%, #0d0107 65%, #050003 100%)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* SUBTLE BOTTOM GLOW EFFECT */}
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-[45%] opacity-40"
          style={{
            background:
              'radial-gradient(ellipse at 50% 100%, rgba(220, 38, 38, 0.45) 0%, transparent 70%)',
          }}
        />

        {/* MESSAGE / TITLE */}
        <div className="relative z-10 mb-10 text-center text-[32px]  font-bold leading-snug tracking-wide text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.95)]">
          {message}
        </div>

        {/* BUTTONS: YES & NO */}
        <div className="relative z-10   flex items-center justify-center gap-20">
          {/* YES BUTTON */}
          <button
            type="button"
            onClick={onConfirm}
            className="cursor-pointer transition-transform duration-150 hover:scale-105 active:scale-95 focus:outline-none"
          >
            <img
              src={yesBtn}
              alt="YES"
              className=" w-[170px] h-[55px] object-fill drop-shadow-[0_3px_6px_rgba(0,0,0,0.8)]"
            />
          </button>

          {/* NO BUTTON */}
          <button
            type="button"
            onClick={handleCancel}
            className="cursor-pointer transition-transform duration-150 hover:scale-105 active:scale-95 focus:outline-none"
          >
            <img
              src={noBtn}
              alt="NO"
              className="h-[55px] w-[167px] object-fill drop-shadow-[0_3px_6px_rgba(0,0,0,0.8)]"
            />
          </button>
        </div>
      </div>
    </div>
  )
}
