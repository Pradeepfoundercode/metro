import React from 'react'
import { useNavigate } from 'react-router-dom'
import { playGameTapSound } from '../../utils/sound'
import bgImage from '../../assets/bg/bg.png'

const ROWS_DATA = [
  {
    orderNumber: '202406261812',
    amount: '₹200',
    time: '26-jun-2024, 10:01AM',
    status: 'Processing',
  },
  {
    orderNumber: '202406261813',
    amount: '₹100',
    time: '26-jun-2024, 12:05PM',
    status: 'Completed',
  },
  {
    orderNumber: '202406261814',
    amount: '₹300',
    time: '26-jun-2024, 06:05PM',
    status: 'Rejected',
  },
]

export default function PayHistoryPage() {
  const navigate = useNavigate()

  const handleBack = () => {
    playGameTapSound()
    if (window.history.length > 1) {
      navigate(-1)
    } else {
      navigate('/dashboard')
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed':
        return 'text-[#22c55e]'
      case 'Rejected':
        return 'text-[#ef4444]'
      case 'Processing':
      default:
        return 'text-[#ffe600]'
    }
  }

  return (
    <div className="game-viewport select-none font-sans">
      <div className="game-stage">
        {/* Background Image */}
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

        {/* Content Container positioned exactly as in screenshot */}
        <div className="absolute inset-x-0 top-[250px] z-20 flex flex-col pl-[70px]">
          {/* Section Titles: Deposit (shifted left) and Withdrawal (shifted left) */}
          <div className="grid grid-cols-[590px_360px_560px_340px] items-center pb-[26px]">
            <div className="col-span-2 flex justify-start pl-[210px]">
              <h2 className="text-[50px] font-bold tracking-wide text-[#ea8804]">
                Deposit
              </h2>
            </div>
            <div className="col-span-2 flex justify-start pl-[160px]">
              <h2 className="text-[50px] font-bold tracking-wide text-white">
                Withdrawal
              </h2>
            </div>
          </div>

          {/* Column Headers */}
          <div className="grid grid-cols-[590px_360px_560px_340px] items-end pb-[16px] text-[42px] font-bold text-[#ea8804]">
            <div className="text-left">Order Number</div>
            <div className="text-left">Amount</div>
            <div className="text-left">Time</div>
            <div className="text-left leading-[1.08]">
              <div>Payment</div>
              <div>Status</div>
            </div>
          </div>

          {/* Data Rows */}
          <div className="flex flex-col gap-[6px] max-h-[550px] overflow-y-auto pr-6">
            {ROWS_DATA.map((row, idx) => (
              <div
                key={idx}
                className="grid grid-cols-[590px_360px_560px_340px] items-center text-[40px] font-semibold leading-tight"
              >
                <div className="text-left tracking-wide text-white">
                  {row.orderNumber}
                </div>
                <div className="text-left text-white">{row.amount}</div>
                <div className="text-left text-white">{row.time}</div>
                <div
                  className={`text-left font-bold ${getStatusColor(
                    row.status
                  )}`}
                >
                  {row.status}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
