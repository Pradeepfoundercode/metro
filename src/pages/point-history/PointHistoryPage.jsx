import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { playGameTapSound } from '../../utils/sound'
import bgImage from '../../assets/bg/bg.png'
import { useAuth } from '../../hooks/useAuth'
import {
  recieverTransfer,
  senderTransferList,
  cancelTransferBySender,
  recieveRejectAmount,
} from '../../services/auth.service'

export default function PointHistoryPage() {
  const navigate = useNavigate()

  const [receivableList, setReceivableList] = useState([])
  const [transferableList, setTransferableList] = useState([])
  const [selectedReceivableIds, setSelectedReceivableIds] = useState([])
  const [selectedTransferableIds, setSelectedTransferableIds] = useState([])

  const [isReceivableSelected, setIsReceivableSelected] = useState(false)
  const [isTransferableSelected, setIsTransferableSelected] = useState(false)

  const { user, userProfile } = useAuth()

  const formatAmount = (val) => {
    const num = Number(val)
    return Number.isFinite(num) ? num.toFixed(2) : (val || '0.00')
  }

  const getStatusLabel = (status) => {
    if (status === 0 || status === '0') return 'Pending'
    if (status === 1 || status === '1') return 'Accepted'
    if (status === 2 || status === '2') return 'Rejected'
    return typeof status === 'string' && status ? status : 'Pending'
  }

  const fetchHistory = async () => {
    if (!user?.id) return

    try {
      const receiver = await recieverTransfer(user.id)
      const rList = Array.isArray(receiver?.transfers)
        ? receiver.transfers
        : Array.isArray(receiver?.data)
          ? receiver.data
          : Array.isArray(receiver)
            ? receiver
            : []
      setReceivableList(rList)

      const sender = await senderTransferList(user.id)
      const sList = Array.isArray(sender?.transfers)
        ? sender.transfers
        : Array.isArray(sender?.data)
          ? sender.data
          : Array.isArray(sender)
            ? sender
            : []
      setTransferableList(sList)
    } catch (error) {
      console.error('Point history fetch error:', error)
    }
  }

  useEffect(() => {
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

  const toggleReceivableItem = (id) => {
    playGameTapSound()
    setSelectedReceivableIds((prev) => {
      const next = prev.includes(id)
        ? prev.filter((item) => item !== id)
        : [...prev, id]
      setIsReceivableSelected(
        receivableList.length > 0 && next.length === receivableList.length
      )
      return next
    })
  }

  const handleSelectAllReceivable = () => {
    playGameTapSound()
    if (isReceivableSelected) {
      setIsReceivableSelected(false)
      setSelectedReceivableIds([])
    } else {
      setIsReceivableSelected(true)
      setSelectedReceivableIds(
        receivableList.map((item) => item.transfer_id ?? item.id)
      )
    }
  }

  const toggleTransferableItem = (id) => {
    playGameTapSound()
    setSelectedTransferableIds((prev) => {
      const next = prev.includes(id)
        ? prev.filter((item) => item !== id)
        : [...prev, id]
      setIsTransferableSelected(
        transferableList.length > 0 && next.length === transferableList.length
      )
      return next
    })
  }

  const handleSelectAllTransferable = () => {
    playGameTapSound()
    if (isTransferableSelected) {
      setIsTransferableSelected(false)
      setSelectedTransferableIds([])
    } else {
      setIsTransferableSelected(true)
      setSelectedTransferableIds(
        transferableList.map((item) => item.transfer_id ?? item.id)
      )
    }
  }

  const handleReceive = async () => {
    playGameTapSound()

    const currentUserId = user?.id || localStorage.getItem('userId')

    if (!currentUserId) {
      toast.error('User not logged in')
      return
    }

    if (selectedReceivableIds.length === 0) {
      toast.error('Please select an item to receive')
      return
    }

    const payload = {
      user_id: String(currentUserId),
      transfer_ids: selectedReceivableIds.map(String),
      action: 1,
    }

    try {
      const res = await recieveRejectAmount(payload)
      if (res?.status || res?.success) {
        toast.success(res?.message || 'Amount received successfully')
        setSelectedReceivableIds([])
        setIsReceivableSelected(false)
        await fetchHistory()
        if (currentUserId) {
          userProfile?.(currentUserId)
        }
      } else {
        toast.error(res?.message || 'Failed to receive amount')
      }
    } catch (error) {
      console.error('Receive amount error:', error)
      const errorMsg =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message ||
        'Failed to receive amount'
      toast.error(errorMsg)
    }
  }

  const handleReject = async () => {
    playGameTapSound()

    const currentUserId = user?.id || localStorage.getItem('userId')

    if (!currentUserId) {
      toast.error('User not logged in')
      return
    }

    if (selectedReceivableIds.length === 0) {
      toast.error('Please select an item to reject')
      return
    }

    const payload = {
      user_id: String(currentUserId),
      transfer_ids: selectedReceivableIds.map(String),
      action: 0,
    }

    try {
      const res = await recieveRejectAmount(payload)
      if (res?.status || res?.success) {
        toast.success(res?.message || 'Amount rejected successfully')
        setSelectedReceivableIds([])
        setIsReceivableSelected(false)
        await fetchHistory()
        if (currentUserId) {
          userProfile?.(currentUserId)
        }
      } else {
        toast.error(res?.message || 'Failed to reject amount')
      }
    } catch (error) {
      console.error('Reject amount error:', error)
      const errorMsg =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message ||
        'Failed to reject amount'
      toast.error(errorMsg)
    }
  }

  const handleSenderReject = async () => {
    playGameTapSound()

    const currentUserId = user?.id || localStorage.getItem('userId')

    if (!currentUserId) {
      toast.error('User not logged in')
      return
    }

    if (selectedTransferableIds.length === 0) {
      toast.error('Please select an item to sender reject')
      return
    }

    const payload = {
      user_id: String(currentUserId),
      transfer_ids: selectedTransferableIds.map(String),
    }

    try {
      const res = await cancelTransferBySender(payload)
      if (res?.status || res?.success) {
        toast.success(res?.message || 'Transfer cancelled successfully')
        setSelectedTransferableIds([])
        setIsTransferableSelected(false)
        await fetchHistory()
        if (currentUserId) {
          userProfile?.(currentUserId)
        }
      } else {
        toast.error(res?.message || 'Failed to cancel transfer')
      }
    } catch (error) {
      console.error('Cancel transfer error:', error)
      const errorMsg =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message ||
        'Failed to cancel transfer'
      toast.error(errorMsg)
    }
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

        {/* Receivable List Container */}
        <div className="absolute left-[200px] top-[245px] z-20 flex w-[760px] max-h-[640px] flex-col gap-[10px] overflow-y-auto pr-2">
          {receivableList.map((item, idx) => {
            const transferId = item.transfer_id ?? item.id ?? idx
            const isSelected = selectedReceivableIds.includes(transferId)

            return (
              <div
                key={transferId}
                onClick={() => toggleReceivableItem(transferId)}
                className={`grid h-[58px] w-full grid-cols-3 items-center rounded-[8px] border px-6 text-center text-[24px] font-medium transition cursor-pointer select-none ${
                  isSelected
                    ? 'border-[#38bdf8] bg-[#0c368a]/80 shadow-[0_0_12px_rgba(56,189,248,0.35)] text-white'
                    : 'border-white/30 bg-[#04163d]/50 text-white hover:bg-[#072464]/60'
                }`}
              >
                <span className="truncate">
                  {item.sender_username || 'ADMIN'}
                </span>
                <span>{formatAmount(item.amount)}</span>
                <span>{getStatusLabel(item.status)}</span>
              </div>
            )
          })}
        </div>

        {/* Transferable List Container */}
        <div className="absolute left-[1000px] top-[245px] z-20 flex w-[760px] max-h-[640px] flex-col gap-[10px] overflow-y-auto pr-2">
          {transferableList.map((item, idx) => {
            const transferId = item.transfer_id ?? item.id ?? idx
            const isSelected = selectedTransferableIds.includes(transferId)

            return (
              <div
                key={transferId}
                onClick={() => toggleTransferableItem(transferId)}
                className={`grid h-[58px] w-full grid-cols-3 items-center rounded-[8px] border px-6 text-center text-[24px] font-medium transition cursor-pointer select-none ${
                  isSelected
                    ? 'border-[#38bdf8] bg-[#0c368a]/80 shadow-[0_0_12px_rgba(56,189,248,0.35)] text-white'
                    : 'border-white/30 bg-[#04163d]/50 text-white hover:bg-[#072464]/60'
                }`}
              >
                <span className="truncate">
                  {item.receiver_username || 'PLAYER'}
                </span>
                <span>{formatAmount(item.amount)}</span>
                <span>{getStatusLabel(item.status)}</span>
              </div>
            )
          })}
        </div>

        {/* Bottom "Select All" Controls */}
        <div className="absolute bottom-[68px] z-20 w-full">
          {/* Left: Select All (Receivable) */}
          <button
            type="button"
            onClick={handleSelectAllReceivable}
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
            onClick={handleSelectAllTransferable}
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
