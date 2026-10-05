import React from 'react'
import cancelBtn from '../../../assets/button/cancel.png'

export default function GameRulesPopup({ isOpen, onClose }) {
  if (!isOpen) return null

  return (
    <div
      className="absolute inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-[3px] select-none"
      onClick={onClose}
    >
      <div
        className="relative w-[90%] max-w-[800px] rounded-3xl border-2 border-[#e6b347] bg-[#0c1836] p-7 shadow-[0_0_50px_rgba(0,0,0,0.95)] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex w-full items-center justify-between pb-4 border-b border-white/20">
          <h3 className="text-[24px] font-black tracking-wider text-yellow-400 drop-shadow">
            GAME RULES & PAYOUTS
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="flex h-[36px] w-[36px] items-center justify-center cursor-pointer transition hover:scale-105 active:scale-95"
          >
            <img src={cancelBtn} alt="Close" className="h-full w-full object-contain" />
          </button>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-4 text-white text-[15px]">
          <div className="space-y-2 rounded-xl bg-black/40 p-4 border border-white/10">
            <h4 className="font-bold text-yellow-300 text-[16px]">INSIDE BETS</h4>
            <div className="flex justify-between"><span>Straight Up (1 No.)</span><span className="font-bold text-green-400">36 : 1</span></div>
            <div className="flex justify-between"><span>Split (2 No.)</span><span className="font-bold text-green-400">18 : 1</span></div>
            <div className="flex justify-between"><span>Street (3 No.)</span><span className="font-bold text-green-400">12 : 1</span></div>
            <div className="flex justify-between"><span>Corner (4 No.)</span><span className="font-bold text-green-400">9 : 1</span></div>
            <div className="flex justify-between"><span>Line (6 No.)</span><span className="font-bold text-green-400">6 : 1</span></div>
          </div>

          <div className="space-y-2 rounded-xl bg-black/40 p-4 border border-white/10">
            <h4 className="font-bold text-yellow-300 text-[16px]">OUTSIDE BETS</h4>
            <div className="flex justify-between"><span>Column (12 No.)</span><span className="font-bold text-green-400">3 : 1</span></div>
            <div className="flex justify-between"><span>Dozen (12 No.)</span><span className="font-bold text-green-400">3 : 1</span></div>
            <div className="flex justify-between"><span>Red / Black</span><span className="font-bold text-green-400">2 : 1</span></div>
            <div className="flex justify-between"><span>Even / Odd</span><span className="font-bold text-green-400">2 : 1</span></div>
            <div className="flex justify-between"><span>Low (1-18) / High (19-36)</span><span className="font-bold text-green-400">2 : 1</span></div>
          </div>
        </div>

        <div className="mt-4 rounded-xl bg-black/50 p-3 text-center text-[14px] text-yellow-200 border border-yellow-500/30">
          Minimum Bet: 1 Point | Maximum Bet: 50,000 Points
        </div>
      </div>
    </div>
  )
}
