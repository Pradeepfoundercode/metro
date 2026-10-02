import React from 'react'
import gameHistoryBg from '../../assets/game_history.png'
import cancelBtn from '../../assets/button/cancel.png'
import { DEFAULT_GAME_HISTORY } from '../../constants/funRouletteData'


export default function GameHistoryPopup({
  isOpen,
  onClose,
  userName = 'PRADEEP',
  balance = 0,
  historyData = [],
}) {
  if (!isOpen) return null

  const displayHistory =
    historyData.length > 0 ? historyData : DEFAULT_GAME_HISTORY

  return (
    <div
      className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-[3px] transition-opacity duration-200 select-none"
      onClick={onClose}
    >
      <div
        className="relative flex h-[92%] w-[96%] max-w-[1780px] flex-col overflow-hidden rounded-lg shadow-[0_0_40px_rgba(0,0,0,0.95)]"
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundImage: `url(${gameHistoryBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="mx-auto mt-12 flex w-[91%] items-start justify-between pt-4">
          <h2 className="mt-1 text-[26px] font-black tracking-wider text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
            ROULETTE GAME HISTORY
          </h2>

          <div className="flex flex-col items-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="relative flex h-[36px] w-[36px] cursor-pointer items-center justify-center transition hover:scale-105 active:scale-95"
            >
              <img
                src={cancelBtn}
                alt="Close"
                className="h-full w-full object-contain drop-shadow"
              />
            </button>

            <div className="flex items-center gap-1.5 rounded-lg border border-white bg-black/60 p-[3px] shadow">
              <div className="rounded-md border border-white bg-black/80 px-3.5 py-1 text-[15px] font-black tracking-wide text-white shadow">
                FUN ROULETTE
              </div>

              <div className="rounded-md border border-white bg-black/80 px-3.5 py-1 text-[15px] font-black uppercase tracking-wide text-white shadow">
                {userName}
              </div>

              <div className="rounded-md border border-white bg-black/80 px-3.5 py-1 text-[15px] font-black tracking-wide text-white shadow">
                Balance: {Number(balance).toFixed(2)}
              </div>
            </div>
          </div>
        </div>

        <div className="mx-auto mt-12 flex h-[590px] w-[91%] flex-col overflow-hidden rounded-2xl border border-white bg-black/55 backdrop-blur-[2px]">
          <div className="grid grid-cols-5 border-b border-white bg-black/40 py-2.5 text-center text-[18px] font-black tracking-wide text-white">
            <div>NO.</div>
            <div>Games No.</div>
            <div>Ball Position</div>
            <div>Play</div>
            <div>Won</div>
          </div>

          <div className="flex flex-col">
            {displayHistory.map((row, index) => {
              const isBallNumber =
                row.ballPosition !== '-' &&
                row.ballPosition !== null &&
                row.ballPosition !== undefined

              const hasWon = Number(row.won) > 0

              return (
                <div
                  key={`${row.gameNo}-${index}`}
                  className="grid grid-cols-5 border-b border-white/25 py-2.5 text-center text-[17px] font-bold text-white transition hover:bg-white/5"
                >
                  <div>{row.no || index + 1}</div>
                  <div>{row.gameNo}</div>

                  <div
                    className={
                      isBallNumber
                        ? 'text-[18px] font-black text-[#ffe600]'
                        : 'text-white/80'
                    }
                  >
                    {row.ballPosition}
                  </div>

                  <div>{row.play}</div>

                  <div
                    className={
                      hasWon
                        ? 'text-[18px] font-black text-[#39ff14]'
                        : 'text-white'
                    }
                  >
                    {row.won}
                  </div>
                </div>
              )
            })}
          </div>

          <div className="flex-1" />
        </div>
      </div>
    </div>
  )
}