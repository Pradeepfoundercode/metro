import React, { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import closeBg from '../../assets/bg/close_bg.png'
import { playGameTapSound } from '../../utils/sound'
import { useAuth } from '../../hooks/useAuth'
import { transferAmount } from '../../services/auth.service'

import cancelBtn from '../../assets/button/cancel.png'

export default function PointTransferPopup({ isOpen, onClose }) {
  const [toUsername, setToUsername] = useState('')
  const [amount, setAmount] = useState('')
  const [pin, setPin] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const { user, userProfile } = useAuth()

  if (!isOpen) return null

  const handleClose = () => {
    playGameTapSound()
    setToUsername('')
    setAmount('')
    setPin('')
    onClose()
  }

  const handleTransfer = async (e) => {
    e?.preventDefault?.()
    playGameTapSound()

    const currentUserId = user?.id || localStorage.getItem('userId')

    if (!currentUserId) {
      toast.error('User not logged in')
      return
    }

    if (!toUsername.trim()) {
      toast.error('Please enter  username')
      return
    }

    if (!amount.trim() || Number(amount) <= 0) {
      toast.error('Please enter valid amount')
      return
    }

    if (!pin.trim()) {
      toast.error('Please enter pin/password')
      return
    }

    const payload = {
      user_id: String(currentUserId),
      receiver_username: toUsername.trim(),
      amount: String(amount).trim(),
      password: String(pin).trim(),
    }

    setIsLoading(true)
    try {
      const response = await transferAmount(payload)

      if (response?.status || response?.success) {
        toast.success(response?.message )
        setToUsername('')
        setAmount('')
        setPin('')
        if (user?.id) {
          userProfile?.(user.id)
        }
        onClose()
      } else {
        toast.error(response?.message)
      }
    } catch (error) {
      console.error('Transfer amount error:', error)
      const errorMsg =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message ||
        'Transfer failed'
      toast.error(errorMsg)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div
      className="absolute inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-[2px] select-none p-2 overflow-hidden"
      onClick={handleClose}
    >
      <div
        className="relative flex h-[520px] w-[760px] max-w-[760px] max-h-[520px] shrink-0 flex-col items-center justify-start overflow-hidden px-6 pt-5 pb-6 drop-shadow-[0_20px_50px_rgba(0,0,0,0.95)]"
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
                onChange={(e) => setToUsername(e.target.value.toUpperCase())}
                className="w-full border-none bg-transparent p-0 text-[18px] font-medium text-white placeholder-zinc-500 outline-none leading-tight uppercase"
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
                inputMode="numeric"
                placeholder="Enter Amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value.replace(/[^0-9]/g, ''))}
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
              disabled={isLoading}
              className="flex h-[36px] min-w-[100px] cursor-pointer items-center justify-center rounded-full bg-[#ef4444]  text-[15px] font-bold text-white shadow-md transition hover:brightness-110 active:scale-95 disabled:opacity-50"
            >
              Close
            </button>

            <button
              type="submit"
              disabled={isLoading}
              className="flex h-[36px] min-w-[105px] cursor-pointer items-center justify-center rounded-full bg-[#22c55e] text-[15px] font-bold text-white shadow-md transition hover:brightness-110 active:scale-95 disabled:opacity-50"
            >
              {isLoading ? 'Sending...' : 'Transfer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
