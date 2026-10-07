import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'

import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
)



{/* WINNING NUMBER RESULT MARKER (SHOW_RESULT.PNG) */}
        // {showResultMarker && winningNumber !== null && winningNumber !== undefined && (() => {
        //   const coords = getNumberCoordinates(winningNumber)
        //   if (!coords) return null
        //   return (
        //     <div
        //       key={`winning-marker-${winningNumber}`}
        //       style={{
        //         position: 'absolute',
        //         left: coords.left,
        //         top: coords.top,
        //         width: '42px',
        //         height: '56px',
        //         transform: 'translate(-50%, -65%)',
        //         transformOrigin: 'center bottom',
        //         zIndex: 50,
        //         pointerEvents: 'none',
        //       }}
        //       className="flex items-center justify-center select-none"
        //     >
        //       <img
        //         src={showResultImg}
        //         alt={`Winning Number ${winningNumber}`}
        //         className="h-full w-full object-contain drop-shadow-[0_6px_10px_rgba(0,0,0,0.9)]"
        //       />
        //     </div>
        //   )
        // })()}


// import React, { useState } from 'react'
// import { useNavigate } from 'react-router-dom'
// import rouletteMiniBg from '../../assets/timer_36/roulettemini.png'

// import { useWalletStore } from '../../store/useWalletStore'
// import { useAuth } from '../../hooks/useAuth'
// import toast from 'react-hot-toast'
// import { playPlaceChipSound, playGameTapSound } from '../../utils/sound'
// import {
//   CHIPS,
//   PlacedChip,
//   getNumberCoordinates,
//   OUTSIDE_BETS,
//   SPLIT_BETS,
//   CORNER_BETS,
//   STREET_BETS,
//   LINE_BETS,
//   BET_WIDTH,
//   BET_HEIGHT,
//   MULTI_BET_WIDTH,
//   MULTI_BET_HEIGHT,
//   BET_TRANSFORM,
// } from '../../components/ui/roulette-mini-timer/grid'

// import GameRulesPopup from '../../components/ui/roulette-mini-timer/GameRulesPopup'
// import GameHistoryPopup from '../../components/ui/roulette-mini-timer/GameHistoryPopup'
// import NeighbourPopup from '../../components/ui/roulette-mini-timer/NeighbourPopup'

// const NUMBERS = Array.from({ length: 37 }, (_, i) => i)

// function RouletteMiniTimer() {
//   const navigate = useNavigate()
//   const { user } = useAuth()
//   const { wallet, deductWallet, addWallet } = useWalletStore()

//   const [selectedChip, setSelectedChip] = useState(2)
//   const [bets, setBets] = useState({})
//   const [betChips, setBetChips] = useState({})
//   const [betHistory, setBetHistory] = useState([])
//   const [previousBets, setPreviousBets] = useState(null)

//   // Popups
//   const [isRulesOpen, setIsRulesOpen] = useState(false)
//   const [isHistoryOpen, setIsHistoryOpen] = useState(false)
//   const [isNeighbourOpen, setIsNeighbourOpen] = useState(false)

//   const totalBet = Object.values(bets).reduce((sum, val) => sum + val, 0)

//   // Select chip from the tray
//   const handleSelectChip = (chipVal) => {
//     setSelectedChip(chipVal)
//     playGameTapSound()
//   }

//   // Place bet on a number or outside bet spot
//   const handlePlaceBet = (spot) => {
//     if (wallet < selectedChip) {
//       toast.error('Insufficient Point Balance!')
//       return
//     }

//     deductWallet(selectedChip)
//     playPlaceChipSound()

//     setBets((prev) => ({
//       ...prev,
//       [spot]: (prev[spot] || 0) + selectedChip,
//     }))

//     setBetChips((prev) => ({
//       ...prev,
//       [spot]: selectedChip,
//     }))

//     setBetHistory((prev) => [...prev, { spot, amount: selectedChip }])
//   }

//   // Clear all current bets
//   const handleClearBets = () => {
//     if (totalBet === 0) return
//     playGameTapSound()
//     addWallet(totalBet)
//     setPreviousBets(bets)
//     setBets({})
//     setBetChips({})
//     setBetHistory([])
//     toast.success('All bets cleared')
//   }

//   // Undo last placed chip
//   const handleUndoBet = () => {
//     if (betHistory.length === 0) return
//     playGameTapSound()
//     const last = betHistory[betHistory.length - 1]
//     const updatedHistory = betHistory.slice(0, -1)

//     addWallet(last.amount)

//     setBets((prev) => {
//       const nextBets = { ...prev }
//       const newAmount = (nextBets[last.spot] || 0) - last.amount
//       if (newAmount <= 0) {
//         delete nextBets[last.spot]
//       } else {
//         nextBets[last.spot] = newAmount
//       }
//       return nextBets
//     })

//     setBetHistory(updatedHistory)
//   }

//   // Double current bets
//   const handleDoubleBets = () => {
//     if (totalBet === 0) return
//     if (wallet < totalBet) {
//       toast.error('Insufficient Balance to double bets!')
//       return
//     }

//     playGameTapSound()
//     deductWallet(totalBet)

//     setBets((prev) => {
//       const doubled = {}
//       for (const spot in prev) {
//         doubled[spot] = prev[spot] * 2
//       }
//       return doubled
//     })

//     setBetHistory((prev) => [
//       ...prev,
//       ...Object.entries(bets).map(([spot, amount]) => ({ spot, amount })),
//     ])

//     toast.success('Bets doubled!')
//   }

//   // Repeat previous round bets
//   const handleRepeatBets = () => {
//     if (!previousBets || Object.keys(previousBets).length === 0) {
//       toast('No previous bets to repeat')
//       return
//     }

//     const prevTotal = Object.values(previousBets).reduce((a, b) => a + b, 0)
//     if (wallet < prevTotal) {
//       toast.error('Insufficient Balance to repeat bets!')
//       return
//     }

//     playGameTapSound()
//     deductWallet(prevTotal)
//     setBets(previousBets)
//     toast.success('Bets repeated!')
//   }

//   return (
//     <div className="game-viewport select-none">
//       <div className="game-stage relative">
//         {/* BACKGROUND IMAGE */}
//         <img
//           src={rouletteMiniBg}
//           alt="Roulette Mini Background"
//           className="pointer-events-none absolute inset-0 z-0 h-full w-full object-fill"
//         />

//         {/* =========================================================
//             HEADER & HUD OVERLAYS (matching bg layout)
//         ========================================================= */}

//         {/* Current Play / Total Bet display */}
//         <div className="pointer-events-none absolute left-[14.5%] top-[16.5%] z-20 flex items-center">
//           <span className="text-[17px] font-black text-yellow-300 drop-shadow">
//             Current Play : {totalBet}
//           </span>
//         </div>

//         {/* POINT BALANCE (Bottom Left) */}
//         <div className="pointer-events-none absolute left-[8.0%] top-[96.6%] z-20 flex w-[90px] justify-center">
//           <span className="text-[16px] font-black text-white drop-shadow">
//             {Number(wallet).toFixed(2)}
//           </span>
//         </div>

//         {/* USERNAME (Bottom Left) */}
//         <div className="pointer-events-none absolute left-[25.2%] top-[96.6%] z-20 flex w-[90px] justify-center">
//           <span className="text-[15px] font-black text-white uppercase drop-shadow truncate">
//             {user?.username || 'PLAYER'}
//           </span>
//         </div>

//         {/* =========================================================
//             CLICKABLE BUTTONS ON BG IMAGE
//         ========================================================= */}

//         {/* GAME RULES BUTTON (Top Center) */}
//         <button
//           type="button"
//           onClick={() => {
//             playGameTapSound()
//             setIsRulesOpen(true)
//           }}
//           className="absolute left-[44.3%] top-[14.3%] z-30 h-[28px] w-[145px] -translate-x-1/2 -translate-y-1/2 cursor-pointer rounded bg-transparent transition hover:brightness-125 active:scale-95"
//           title="Game Rules"
//         />

//         {/* NEIGHBOUR BET BUTTON (Bottom Left) */}
//         <button
//           type="button"
//           onClick={() => {
//             playGameTapSound()
//             setIsNeighbourOpen(true)
//           }}
//           className="absolute left-[6.0%] top-[87.5%] z-30 h-[48px] w-[105px] -translate-x-1/2 -translate-y-1/2 cursor-pointer rounded-lg bg-transparent transition hover:brightness-125 active:scale-95"
//           title="Neighbour Bet"
//         />

//         {/* GAME HISTORY BUTTON (Bottom Right) */}
//         <button
//           type="button"
//           onClick={() => {
//             playGameTapSound()
//             setIsHistoryOpen(true)
//           }}
//           className="absolute left-[79.5%] top-[96.2%] z-30 h-[44px] w-[115px] -translate-x-1/2 -translate-y-1/2 cursor-pointer rounded-lg bg-transparent transition hover:brightness-125 active:scale-95"
//           title="Game History"
//         />

//         {/* LEAVE TABLE BUTTON (Bottom Right) */}
//         <button
//           type="button"
//           onClick={() => {
//             playGameTapSound()
//             navigate('/dashboard')
//           }}
//           className="absolute left-[93.5%] top-[98.0%] z-30 h-[36px] w-[130px] -translate-x-1/2 -translate-y-1/2 cursor-pointer rounded-lg bg-transparent transition hover:brightness-125 active:scale-95"
//           title="Leave Table"
//         />

//         {/* =========================================================
//             COINS / CHIPS SELECTION TRAY (In the wooden rack on bg)
//         ========================================================= */}
//         {CHIPS.map((chip) => {
//           const isSelected = selectedChip === chip.value
//           return (
//             <button
//               key={`chip-${chip.value}`}
//               type="button"
//               onClick={() => handleSelectChip(chip.value)}
//               style={{
//                 position: 'absolute',
//                 left: chip.left,
//                 top: chip.top,
//                 width: chip.width,
//                 height: chip.height,
//                 transform: 'translate(-50%, -50%)',
//               }}
//               className="z-40 flex items-center justify-center rounded-full cursor-pointer bg-transparent focus:outline-none"
//               title={`Select ${chip.label} Chip`}
//             >
//               {isSelected && (
//                 <span className="pointer-events-none absolute inset-0 rounded-full border-[3px] border-yellow-300 ring-2 ring-yellow-400/90 shadow-[0_0_16px_#ffd700] animate-pulse" />
//               )}
//             </button>
//           )
//         })}

//         {/* =========================================================
//             BETTING NUMBERS (0 - 36) ON TABLE
//         ========================================================= */}
//         {NUMBERS.map((num) => {
//           const coords = getNumberCoordinates(num)
//           const betAmount = bets[num] || 0

//           return (
//             <button
//               key={`num-${num}`}
//               type="button"
//               onClick={() => handlePlaceBet(num)}
//               style={{
//                 position: 'absolute',
//                 left: coords.left,
//                 top: coords.top,
//                 width: typeof coords.width === 'number' ? `${coords.width}px` : coords.width,
//                 height: typeof coords.height === 'number' ? `${coords.height}px` : coords.height,
//                 transform: `translate(-50%, -50%) ${coords.transform || BET_TRANSFORM}`,
//                 transformOrigin: 'center center',
//               }}
//               className="group z-20 flex items-center justify-center rounded-full cursor-pointer transition active:scale-90 focus:outline-none"
//               title={`Bet on ${num}`}
//             >
//               {/* Perspective hover outline matching the exact table oval */}
//               <span className="pointer-events-none absolute inset-0 rounded-full border-2 border-yellow-300/80 bg-yellow-300/15 opacity-0 transition-opacity group-hover:opacity-100 shadow-[0_0_8px_rgba(255,234,0,0.5)]" />

//               {/* Placed Chip Badge - Lies completely flat inside the oval */}
//               {betAmount > 0 && (
//                 <PlacedChip
//                   amount={betAmount}
//                   chipValue={betChips[num] || selectedChip}
//                   width="100%"
//                   height="100%"
//                 />
//               )}
//             </button>
//           )
//         })}

//         {/* =========================================================
//             OUTSIDE BETS (Dozens, Columns, Red/Black, Even/Odd, etc.)
//         ========================================================= */}
//         {OUTSIDE_BETS.map((item) => {
//           const betAmount = bets[item.key] || 0

//           return (
//             <button
//               key={`outside-${item.key}`}
//               type="button"
//               onClick={() => handlePlaceBet(item.key)}
//               style={{
//                 position: 'absolute',
//                 left: item.left,
//                 top: item.top,
//                 width: typeof item.width === 'number' ? `${item.width}px` : item.width,
//                 height: typeof item.height === 'number' ? `${item.height}px` : item.height,
//                 transform: `translate(-50%, -50%) ${item.transform || BET_TRANSFORM}`,
//                 transformOrigin: 'center center',
//               }}
//               className="group z-20 flex items-center justify-center scale-105 rounded-md cursor-pointer transition active:scale-95 focus:outline-none"
//               title={`Bet on ${item.label}`}
//             >
//               <span className="pointer-events-none absolute inset-0 rounded-md border border-yellow-300/40 bg-yellow-300/10 opacity-0 transition-opacity group-hover:opacity-100 shadow-[0_0_8px_rgba(255,234,0,0.4)]" />

//               {betAmount > 0 && (
//                 <PlacedChip
//                   amount={betAmount}
//                   chipValue={betChips[item.key] || selectedChip}
//                   width={BET_WIDTH}
//                   height={BET_HEIGHT}
//                 />
//               )}
//             </button>
//           )
//         })}

//         {/* =========================================================
//             2 NUMBER BETS (SPLIT BETS)
//         ========================================================= */}
//         {SPLIT_BETS.map((item) => {
//           const betAmount = bets[item.key] || 0

//           return (
//             <button
//               key={`split-${item.key}`}
//               type="button"
//               onClick={() => handlePlaceBet(item.key)}
//               style={{
//                 position: 'absolute',
//                 left: item.left,
//                 top: item.top,
//                 width: betAmount > 0 ? MULTI_BET_WIDTH : '26px',
//                 height: betAmount > 0 ? MULTI_BET_HEIGHT : '26px',
//                 transform: `translate(-50%, -50%) ${BET_TRANSFORM}`,
//                 transformOrigin: 'center center',
//               }}
//               className="group z-24 flex items-center justify-center rounded-full cursor-pointer transition active:scale-90 focus:outline-none"
//               title={`Bet on Split ${item.key}`}
//             >
//               <span className="pointer-events-none absolute inset-0 rounded-full border border-yellow-300 bg-yellow-400/25 opacity-0 transition-opacity group-hover:opacity-100 shadow-[0_0_8px_rgba(255,234,0,0.8)]" />

//               {betAmount > 0 && (
//                 <PlacedChip
//                   amount={betAmount}
//                   chipValue={betChips[item.key] || selectedChip}
//                   width={MULTI_BET_WIDTH}
//                   height={MULTI_BET_HEIGHT}
//                   isSmall
//                 />
//               )}
//             </button>
//           )
//         })}

//         {/* =========================================================
//             3 NUMBER BETS (STREET BETS)
//         ========================================================= */}
//         {STREET_BETS.map((item) => {
//           const betAmount = bets[item.key] || 0

//           return (
//             <button
//               key={`street-${item.key}`}
//               type="button"
//               onClick={() => handlePlaceBet(item.key)}
//               style={{
//                 position: 'absolute',
//                 left: item.left,
//                 top: item.top,
//                 width: betAmount > 0 ? MULTI_BET_WIDTH : '30px',
//                 height: betAmount > 0 ? MULTI_BET_HEIGHT : '26px',
//                 transform: `translate(-50%, -50%) ${BET_TRANSFORM}`,
//                 transformOrigin: 'center center',
//               }}
//               className="group z-26 flex items-center justify-center rounded-md cursor-pointer transition active:scale-90 focus:outline-none"
//               title={`Bet on Street ${item.key}`}
//             >
//               <span className="pointer-events-none absolute inset-0 rounded-md border border-yellow-300 bg-yellow-400/25 opacity-0 transition-opacity group-hover:opacity-100 shadow-[0_0_8px_rgba(255,234,0,0.8)]" />

//               {betAmount > 0 && (
//                 <PlacedChip
//                   amount={betAmount}
//                   chipValue={betChips[item.key] || selectedChip}
//                   width={MULTI_BET_WIDTH}
//                   height={MULTI_BET_HEIGHT}
//                   isSmall
//                 />
//               )}
//             </button>
//           )
//         })}

//         {/* =========================================================
//             6 NUMBER BETS (SIX LINE BETS)
//         ========================================================= */}
//         {LINE_BETS.map((item) => {
//           const betAmount = bets[item.key] || 0

//           return (
//             <button
//               key={`line-${item.key}`}
//               type="button"
//               onClick={() => handlePlaceBet(item.key)}
//               style={{
//                 position: 'absolute',
//                 left: item.left,
//                 top: item.top,
//                 width: betAmount > 0 ? MULTI_BET_WIDTH : '26px',
//                 height: betAmount > 0 ? MULTI_BET_HEIGHT : '26px',
//                 transform: `translate(-50%, -50%) ${BET_TRANSFORM}`,
//                 transformOrigin: 'center center',
//               }}
//               className="group z-28 flex items-center justify-center rounded-full cursor-pointer transition active:scale-90 focus:outline-none"
//               title={`Bet on Line ${item.key}`}
//             >
//               <span className="pointer-events-none absolute inset-0 rounded-full border border-yellow-300 bg-yellow-400/35 opacity-0 transition-opacity group-hover:opacity-100 shadow-[0_0_10px_rgba(255,234,0,0.9)]" />

//               {betAmount > 0 && (
//                 <PlacedChip
//                   amount={betAmount}
//                   chipValue={betChips[item.key] || selectedChip}
//                   width={MULTI_BET_WIDTH}
//                   height={MULTI_BET_HEIGHT}
//                   isSmall
//                 />
//               )}
//             </button>
//           )
//         })}

//         {/* =========================================================
//             4 NUMBER BETS (CORNER / SQUARE BETS)
//         ========================================================= */}
//         {CORNER_BETS.map((item) => {
//           const betAmount = bets[item.key] || 0

//           return (
//             <button
//               key={`corner-${item.key}`}
//               type="button"
//               onClick={() => handlePlaceBet(item.key)}
//               style={{
//                 position: 'absolute',
//                 left: item.left,
//                 top: item.top,
//                 width: betAmount > 0 ? MULTI_BET_WIDTH : '26px',
//                 height: betAmount > 0 ? MULTI_BET_HEIGHT : '26px',
//                 transform: `translate(-50%, -50%) ${BET_TRANSFORM}`,
//                 transformOrigin: 'center center',
//               }}
//               className="group z-30 flex items-center justify-center rounded-full cursor-pointer transition active:scale-90 focus:outline-none"
//               title={`Bet on Corner ${item.key}`}
//             >
//               <span className="pointer-events-none absolute inset-0 rounded-full border border-yellow-300 bg-yellow-400/35 opacity-0 transition-opacity group-hover:opacity-100 shadow-[0_0_10px_rgba(255,234,0,0.9)]" />

//               {betAmount > 0 && (
//                 <PlacedChip
//                   amount={betAmount}
//                   chipValue={betChips[item.key] || selectedChip}
//                   width={MULTI_BET_WIDTH}
//                   height={MULTI_BET_HEIGHT}
//                   isSmall
//                 />
//               )}
//             </button>
//           )
//         })}


//         {/* =========================================================
//             POPUPS
//         ========================================================= */}
//         <GameRulesPopup
//           isOpen={isRulesOpen}
//           onClose={() => setIsRulesOpen(false)}
//         />

//         <GameHistoryPopup
//           isOpen={isHistoryOpen}
//           onClose={() => setIsHistoryOpen(false)}
//           userName={user?.username || 'PLAYER'}
//           balance={wallet}
//         />

//         <NeighbourPopup
//           isOpen={isNeighbourOpen}
//           onClose={() => setIsNeighbourOpen(false)}
//           onBet={(spot, chipVal) => {
//             setSelectedChip(chipVal)
//             handlePlaceBet(spot)
//           }}
//           bets={bets}
//           betChips={betChips}
//           selectedChip={selectedChip}
//         />
//       </div>
//     </div>
//   )
// }

// export default RouletteMiniTimer
