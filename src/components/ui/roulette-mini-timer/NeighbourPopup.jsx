import React from 'react'
import blueNeighbour from '../../../assets/timer_36/blue_neighbour.png'
import cancelBtn from '../../../assets/button/cancel.png'
import { PlacedChip } from './grid'

const SECTIONS = [
  { key: 'TIERS', label: 'TIERS', style: { left: '7.5%', width: '23.5%', top: '24%', height: '52%' } },
  { key: 'ORPHELIN', label: 'ORPHELIN', style: { left: '31%', width: '20.5%', top: '24%', height: '52%' } },
  { key: 'VOISINS', label: 'VOISINS', style: { left: '51.5%', width: '25%', top: '24%', height: '52%' } },
  { key: 'ZERO', label: 'ZERO', style: { left: '76.5%', width: '16.5%', top: '24%', height: '52%' } },
]

export default function NeighbourPopup({
  isOpen,
  onClose,
  onBet = () => {},
  bets = {},
  betChips = {},
  selectedChip = 2,
  isLocked = false,
}) {
  if (!isOpen) return null

  const handleSectionClick = (key) => {
    onBet(key, selectedChip)
  }

  return (
    <div
      className="absolute inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-[3px] select-none"
      onClick={onClose}
    >
      <div
        className="relative w-[96%] max-w-[1520px] rounded-[32px] border-[4px] border-[#e6b347] bg-[#0c1836] p-8 shadow-[0_0_80px_rgba(0,0,0,0.98)] flex flex-col items-center"
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER */}
        <div className="flex w-full items-center justify-between pb-4 border-b border-white/20">
          <div className="flex items-center gap-3">
            <h3 className="text-[30px] font-black tracking-wider text-white drop-shadow">
              NEIGHBOUR BETS
            </h3>
            {isLocked && (
              <span className="text-[15px] font-black text-red-500 uppercase tracking-widest bg-red-950/80 border border-red-500/50 px-4 py-1.5 rounded-full animate-pulse">
                Betting Closed
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-[46px] w-[46px] items-center justify-center cursor-pointer transition hover:scale-105 active:scale-95"
          >
            <img src={cancelBtn} alt="Close" className="h-full w-full object-contain" />
          </button>
        </div>

        {/* RACETRACK IMAGE WITH DIRECT INTERACTIVE BET ZONES */}
        <div className="relative mt-8 mb-6 flex items-center justify-center w-full max-w-[1420px]">
          <div className="relative w-full aspect-[840/170]">
            <img
              src={blueNeighbour}
              alt="Neighbour Racetrack"
              className="w-full h-full object-contain drop-shadow-[0_4px_16px_rgba(0,0,0,0.85)] pointer-events-none select-none"
            />

            {/* INTERACTIVE BET OVERLAYS FOR TIERS, ORPHELIN, VOISINS, ZERO */}
            {SECTIONS.map(({ key, label, style }) => {
              const amount = bets[key] || 0
              const chip = betChips[key] || selectedChip

              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => handleSectionClick(key)}
                  style={style}
                  className="
                    absolute
                    cursor-pointer
                    flex
                    items-center
                    justify-center
                    rounded-lg
                    bg-transparent
                    active:scale-95
                  "
                  title={`Bet on ${label}`}
                >
                  {amount > 0 && (
                    <PlacedChip
                      amount={amount}
                      chipValue={chip}
                      size={38}
                    />
                  )}
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
