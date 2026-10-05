import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { useWalletStore } from '../../store/useWalletStore'
import toast from 'react-hot-toast'
import { getGameId, createBetPayload } from '../../utils/helper'

import blue36Bg from '../../assets/timer_36/blue_36_bg.png'
import wheelImg from '../../assets/timer_36/wheel.png'
import thudiImg from '../../assets/timer_36/thudi.png'
import watch40Img from '../../assets/timer_36/watch_40.png'
import rulesBtn from '../../assets/timer_36/rules_btn.png'
import neighbourBtn from '../../assets/timer_36/neighbour.png'
import gameHistoryBtn from '../../assets/timer_36/game_history.png'
import leaveTableBtn from '../../assets/timer_36/leave_table.png'
import buttonBg from '../../assets/timer_36/button_bg.png'
import waitToComplete from '../../assets/timer_36/wait_to_complete.png'
import betAcceptedImg from '../../assets/timer_36/bet_accepted.png'
import doubleBtn from '../../assets/timer_36/double.png'
import clearBetBtn from '../../assets/timer_36/clear_bet.png'
import removeBtn from '../../assets/timer_36/remove.png'
import pleaseSelectChipsImg from '../../assets/timer_36/please_select_chips.png'
import greaterThan10Rs from '../../assets/timer_36/gr_than_10.png'


import ConfirmDialog from '../../components/ui/ConfirmDialog'
import NeighbourPopup from '../../components/ui/roulette-mini-timer/NeighbourPopup'
import GameHistoryPopup from '../../components/ui/GameHistoryPopup'
import RouletteGrid from '../../components/ui/roulette-mini-timer/grid'


const ITEMS = [
  [35, "l"],
  [1, "r"],
  [0, "m"],
  [13, "l"],
  [31, "l"],
  [0, "m"],
  [1, "r"],
  [2, "l"],
  [21, "r"],
  [26, "l"],
];

const STYLE = {
  l: "justify-start text-yellow",
  m: "justify-center text-green",
  r: "justify-end text-red",
};

const MIN_10_BET_SPOTS = [
  '1st12',
  '2nd12',
  '3rd12',
  'col-0',
  'col-1',
  'col-2',
  '1-18',
  'even',
  'red',
  'black',
  'odd',
  '19-36',
  '1ST12',
  '2ND12',
  '3RD12',
  'ROW_1',
  'ROW_2',
  'ROW_3',
  'EVEN',
  'RED',
  'BLACK',
  'ODD',
];



export default function RouletteMiniTimer() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { wallet, deductWallet, addWallet } = useWalletStore()

  // STATE VALUES
  const [selectedChip, setSelectedChip] = useState(2)
  const [timeLeft, setTimeLeft] = useState(40)
  const [bets, setBets] = useState({})
  const [betChips, setBetChips] = useState({})
  const [betHistory, setBetHistory] = useState([])
  const [isBetConfirmed, setIsBetConfirmed] = useState(false)
  const [showBetAccepted, setShowBetAccepted] = useState(false)
  const [showPleaseSelectChips, setShowPleaseSelectChips] = useState(false)
  const [showGreaterThan10, setShowGreaterThan10] = useState(false)
  const [totalBet, setTotalBet] = useState(0)
  const [showWaitToComplete, setShowWaitToComplete] = useState(false)
  const waitTimeoutRef = useRef(null)
  const selectChipsTimeoutRef = useRef(null)
  const greaterThan10TimeoutRef = useRef(null)

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 0) {
          // Reset bets for next game round
          setBets({})
          setBetChips({})
          setBetHistory([])
          setIsBetConfirmed(false)
          setShowBetAccepted(false)
          setShowPleaseSelectChips(false)
          setShowGreaterThan10(false)
          setTotalBet(0)
          setShowWaitToComplete(false)
          return 40
        }
        return prev - 1
      })
    }, 1000)

    return () => {
      clearInterval(timer)
      if (waitTimeoutRef.current) clearTimeout(waitTimeoutRef.current)
      if (selectChipsTimeoutRef.current) clearTimeout(selectChipsTimeoutRef.current)
      if (greaterThan10TimeoutRef.current) clearTimeout(greaterThan10TimeoutRef.current)
    }
  }, [])

  const handlePlaceBet = (spot, amount = selectedChip) => {
    if (!selectedChip || !amount) {
      setShowGreaterThan10(false)
      setShowWaitToComplete(false)
      setShowPleaseSelectChips(true)
      if (selectChipsTimeoutRef.current) clearTimeout(selectChipsTimeoutRef.current)
      selectChipsTimeoutRef.current = setTimeout(() => {
        setShowPleaseSelectChips(false)
      }, 2500)
      return
    }

    setShowPleaseSelectChips(false)

    const requiresMinimum10 = MIN_10_BET_SPOTS.includes(spot)
    if (requiresMinimum10 && amount < 10) {
      setShowPleaseSelectChips(false)
      setShowWaitToComplete(false)
      setShowGreaterThan10(true)
      if (greaterThan10TimeoutRef.current) clearTimeout(greaterThan10TimeoutRef.current)
      greaterThan10TimeoutRef.current = setTimeout(() => {
        setShowGreaterThan10(false)
      }, 2500)
      return
    }

    setShowGreaterThan10(false)
    if (isBetConfirmed) return
    // 10 sec ya usse kam rehne par bet lagane ki koshish karne par hi Please Wait show hoga
    if (timeLeft <= 10) {
      setShowPleaseSelectChips(false)
      setShowGreaterThan10(false)
      setShowWaitToComplete(true)
      if (waitTimeoutRef.current) clearTimeout(waitTimeoutRef.current)
      waitTimeoutRef.current = setTimeout(() => {
        setShowWaitToComplete(false)
      }, 2500)
      return
    }
    if (wallet < amount) return

    setShowWaitToComplete(false)
    deductWallet(amount)
    setTotalBet((prev) => prev + amount)
    setBets((prev) => ({
      ...prev,
      [spot]: (prev[spot] || 0) + amount,
    }))
    setBetChips((prev) => ({
      ...prev,
      [spot]: selectedChip,
    }))
    setBetHistory((prev) => [
      ...prev,
      {
        spot,
        amount,
      },
    ])
  }

  const handleBetConfirm = () => {
    if (betHistory.length === 0 || isBetConfirmed) return

    const payload = createBetPayload(betHistory, user, '450538')
    if (!payload) return

    console.log(payload, ' payload')
    console.log('Bets Payload:', payload)
    toast.success('Bet Placed Successfully')
    setIsBetConfirmed(true)
    setShowBetAccepted(true)
    setTimeout(() => {
      setShowBetAccepted(false)
    }, 2500)
  }

  const handleClearBets = () => {
    if (isBetConfirmed) {
      toast.error("Confirmed bets cannot be cleared")
      return
    }

    if (timeLeft <= 10) {
      toast.error("You can't clear bets in the last 10 seconds")
      return
    }

    if (betHistory.length === 0) {
      return
    }

    const refundAmount = betHistory.reduce(
      (total, bet) => total + bet.amount,
      0
    )

    addWallet(refundAmount)
    setBets({})
    setBetChips({})
    setBetHistory([])
    setTotalBet(0)
    toast.success('All bets cleared')
  }

  const handleDoubleBets = () => {
    if (isBetConfirmed) {
      toast.error("Bets already confirmed")
      return
    }

    if (timeLeft <= 10) {
      setShowPleaseSelectChips(false)
      setShowGreaterThan10(false)
      setShowWaitToComplete(true)
      if (waitTimeoutRef.current) clearTimeout(waitTimeoutRef.current)
      waitTimeoutRef.current = setTimeout(() => {
        setShowWaitToComplete(false)
      }, 2500)
      return
    }

    if (totalBet === 0 || betHistory.length === 0) {
      return
    }

    if (wallet < totalBet) {
      toast.error("Insufficient balance to double bet")
      return
    }

    deductWallet(totalBet)
    setTotalBet((prev) => prev * 2)

    setBets((prev) => {
      const next = {}
      for (const spot in prev) {
        next[spot] = prev[spot] * 2
      }
      return next
    })

    setBetHistory((prev) => [...prev, ...prev])
  }

  const handleRemoveChip = () => {
    setSelectedChip(null)
  }



  // Timer Color: 40-21 green, 20-6 yellow, 5-0 red
  const getTimerColor = (time) => {
    if (time >= 21) return '#2ebd27'
    if (time >= 6) return '#ffe600'
    return '#ff2222'
  }

  const renderTimerWedge = () => {
    if (timeLeft <= 0) return null

    const rx = 79
    const ry = 66
    const cx = 90
    const cy = 75
    const color = getTimerColor(timeLeft)

    if (timeLeft >= 40) {
      return (
        <ellipse
          cx={cx}
          cy={cy}
          rx={rx}
          ry={ry}
          fill={color}
          className="opacity-80"
        />
      )
    }

    const elapsed = 40 - timeLeft
    const startAngle = (elapsed / 40) * 2 * Math.PI
    const startX = cx + rx * Math.sin(startAngle)
    const startY = cy - ry * Math.cos(startAngle)
    const largeArcFlag = timeLeft > 20 ? 1 : 0

    const pathData = `M ${cx} ${cy} L ${startX.toFixed(2)} ${startY.toFixed(2)} A ${rx} ${ry} 0 ${largeArcFlag} 1 ${cx} ${cy - ry} Z`

    return (
      <path
        d={pathData}
        fill={color}
        className="opacity-80"
      />
    )
  }

  // POPUP VISIBILITIES
  const [isLeaveOpen, setIsLeaveOpen] = useState(false)
  const [isHistoryOpen, setIsHistoryOpen] = useState(false)
  const [isNeighbourOpen, setIsNeighbourOpen] = useState(false)
  const [isRulesOpen, setIsRulesOpen] = useState(false)


  return (
    <div className="game-viewport select-none font-sans">
      <div className="game-stage">

        <img
          src={blue36Bg}
          alt="Roulette Table"
          className="pointer-events-none absolute inset-0 z-0 h-full w-full object-fill"
        />


        <div className="pointer-events-none absolute left-[84px] top-[20px] z-10 flex h-[282px] w-[145px] flex-col p-[12px_14px] text-[18px] font-black leading-none">
          {ITEMS.map(([n, side], i) => (
            <div key={i} className={`flex flex-1 items-center ${STYLE[side]}`}>
              {n}
            </div>
          ))}
        </div>

        {/* ==============================================================
            2. TOP BOX 2: ARCHED WHEEL SLICE (REAL WHEEL.PNG) + STATS
        ============================================================== */}
        <div className="absolute left-[265px] top-[17px] z-10 flex h-[200px]  w-[417px] flex-col  p-[0px_12px] pointer-events-none">
          {/* ARCHED ROULETTE WHEEL SLICE USING REAL WHEEL.PNG */}
          <div className="relative flex h-[122px] w-full overflow-hidden rounded-t-[10px] bg-[#ea926b] border-t-2 border-[#ffd700]/70">
            {/* CONTINUOUSLY SPINNING WHEEL.PNG AT ITS FIXED POSITION */}
            <div className="absolute left-[200px]  h-[600px] w-[670px] -translate-x-1/2 origin-center pointer-events-none">
              <img
                src={wheelImg}
                alt="Arched Roulette Wheel"
                className="h-full w-full object-fill pointer-events-none   origin-center"
              />
            </div>

            {/* FIXED BRIGHT WHITE BALL AT CENTER (0 POCKET) - DOES NOT MOVE */}
            <div className="pointer-events-none absolute left-[203px] top-[100px] z-20 h-[22px] w-[22px] -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-[radial-gradient(circle_at_35%_35%,#ffffff_0%,#ffffff_65%,#f1f5f9_85%,#cbd5e1_100%)] " />
          </div>

          {/* PLAY STATS (BLACK BAR) */}
          <div className="flex flex-col justify-center  ">
            <div className="border-t border-b border-yellow1 py- pl-6 text-[21px] font-semibold text-white drop-shadow">
              Current Play : {totalBet}
            </div>
            <div className="pl-6  text-[21px] font-semibold text-green drop-shadow">
              You Won 0
            </div>
          </div>
        </div>


        <div className="absolute left-[700px] top-[15px] z-10 flex h-[100px] w-[326px] flex-col leading-[20px] items-center justify-center text-center ">
          <span className="text-[15px] font-bold tracking-wide text-yellow1">
            MIN- Play
          </span>
          <span className="text-[15px] font-bold tracking-wide text-yellow1">
            IN 1   OUT 10
          </span>
          <span className="text-[15px] font-bold tracking-wide text-yellow1 mt-0.5">
            MAX- Play
          </span>
          <span className="text-[15px] font-bold tracking-wide text-yellow1">
            IN 5000, OUT 50000
          </span>
        </div>

        {/* GAME RULES BUTTON DIRECTLY UNDER BOX 3 */}
        <button
          type="button"
          // onClick={() => setIsRulesOpen(true)}
          className="absolute left-[720px] top-[115px] z-20 h-[32px] w-[280px] cursor-pointer transition hover:scale-105 active:scale-95"
        >
          <img
            src={rulesBtn}
            alt="GAME RULES"
            className="h-full w-full object-fill drop-shadow"
          />
        </button>


        <div className="absolute left-[1058px]  z-10 flex h-[98px] w-[190px] items-center justify-center pointer-events-none">
          <span className="text-[54px] font-black tracking-wider text-[#ff2b2b] drop-shadow-[0_2px_4px_rgba(0,0,0,0.95)]">
            12
          </span>
        </div>


        <div className="absolute left-[1580px] top-[115px] z-10 flex h-[500px] w-[630px] -translate-x-1/2 -translate-y-1/2 items-center justify-center pointer-events-none">
          {/* 3D TILTED WHEEL - ROTATED & SIZED PERFECTLY IN BOWL */}
          <div className="relative flex h-full w-full items-center justify-center [transform:perspective(1000px)_rotateX(66deg)_rotate(39deg)] origin-center">
            {/* CONTINUOUSLY SPINNING WHEEL (LIKE BEFORE) WITH BALL RESTING ON A NUMBER */}
            <div className="relative flex h-full w-full items-center justify-center select-none animate-[spin_10s_linear_infinite] origin-center">
              <img
                src={wheelImg}
                alt="Roulette Wheel"
                className="h-full w-full object-contain drop-shadow-[0_16px_32px_rgba(0,0,0,0.95)]"
              />

              {/* LARGER, BRIGHT WHITE BALL RESTING IN NUMBER POCKET */}
              <div className="pointer-events-none absolute left-1/2 top-[16.5%] z-30 h-6 w-6 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-[radial-gradient(circle_at_35%_35%,#ffffff_0%,#ffffff_65%,#f1f5f9_85%,#cbd5e1_100%)] shadow-[0_0_10px_rgba(255,255,255,0.95),0_3px_6px_rgba(0,0,0,0.55),inset_-2px_-2px_3px_rgba(0,0,0,0.15)]" />
            </div>
          </div>

          {/* GOLDEN DOLLY / SPINDLE (THUDI) STANDING UPRIGHT IN CENTER */}
          <img
            src={thudiImg}
            alt="Dolly"
            className="absolute left-1/2 top-1/2 h-[70px] w-[76px] -translate-x-1/2 -translate-y-[68%] pointer-events-none object-contain drop-shadow-[0_10px_18px_rgba(0,0,0,0.95)]"
          />
        </div>




        {/* ==============================================================
            6. MAIN BETTING TABLE (3D PERSPECTIVE FELT GRID)
        ============================================================== */}
        <div className="pointer-events-none absolute left-[330px] top-[315px] z-10 h-[890px] ">
          <RouletteGrid
            selectedChip={selectedChip}
            onChipChange={(chip) => {
              setSelectedChip(chip)
              setShowPleaseSelectChips(false)
              if (chip >= 10) setShowGreaterThan10(false)
            }}
            onBet={handlePlaceBet}
            bets={bets}
            betChips={betChips}
            isLocked={timeLeft <= 10}
          />
        </div>



        {/* ==============================================================
            CENTER POPUP NOTIFICATIONS / BANNERS (PLEASE WAIT, SELECT CHIPS, > 10, BET ACCEPTED)
        ============================================================== */}
        {showWaitToComplete && (
          <div className="pointer-events-none absolute left-[960px] top-[480px] z-[60] flex -translate-x-1/2 -translate-y-1/2 items-center justify-center">
            <img
              src={waitToComplete}
              alt="PLEASE WAIT"
              className="h-[46px] w-[540px] object-contain drop-shadow-[0_4px_16px_rgba(0,0,0,0.95)]"
            />
          </div>
        )}

        {showPleaseSelectChips && (
          <div className="pointer-events-none absolute left-[960px] top-[480px] z-[60] flex -translate-x-1/2 -translate-y-1/2 items-center justify-center">
            <img
              src={pleaseSelectChipsImg}
              alt="PLEASE SELECT CHIPS"
              className="h-[46px] w-[540px] object-contain drop-shadow-[0_4px_16px_rgba(0,0,0,0.95)]"
            />
          </div>
        )}

        {/* ==============================================================
            GREATER THAN 10RS BANNER (FOR DOZENS/COLUMNS/OUTSIDE WITH CHIP < 10)
        ============================================================== */}
        {showGreaterThan10 && (
          <div className="pointer-events-none absolute left-[960px] top-[480px] z-[60] flex -translate-x-1/2 -translate-y-1/2 items-center justify-center">
            <img
              src={greaterThan10Rs}
              alt="GREATER THAN 10RS"
              className="h-[46px] w-[540px] object-contain drop-shadow-[0_4px_16px_rgba(0,0,0,0.95)]"
            />
          </div>
        )}

        {/* ==============================================================
            BET ACCEPTED BANNER (APPEARS ON BET CONFIRM)
        ============================================================== */}
        {showBetAccepted && (
          <div className="pointer-events-none absolute left-[960px] top-[480px] z-40 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center">
            <img
              src={betAcceptedImg}
              alt="BET ACCEPTED"
              className="h-[46px] w-[540px] object-contain drop-shadow-[0_4px_16px_rgba(0,0,0,0.95)]"
            />
          </div>
        )}


        {/* ==============================================================
            7. BET CONFIRM BUTTON (APPEARS WHEN BETS ARE PLACED)
        ============================================================== */}
        {betHistory.length > 0 && !isBetConfirmed && (
          <button
            type="button"
            onClick={handleBetConfirm}
            className="absolute left-[1570px] top-[715px] z-30 flex h-[54px] w-[236px] -translate-x-1/2 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border-2 border-[#fff3be] bg-[linear-gradient(180deg,#ffea79_0%,#e5a019_50%,#9e6002_100%)] shadow-[0_6px_16px_rgba(0,0,0,0.7),inset_0_2px_4px_rgba(255,255,255,0.7),inset_0_-2px_4px_rgba(0,0,0,0.4)] transition-transform duration-150 hover:scale-105 active:scale-95"
          >
            <span className="text-[22px] font-black tracking-wider text-[#1a0d00] uppercase drop-shadow-[0_1px_1px_rgba(255,255,255,0.6)]">
              BET CONFIRM
            </span>
          </button>
        )}


        {/* ==============================================================
            8. BOTTOM-RIGHT ANALOG TIMER CLOCK (WATCH 40)
        ============================================================== */}
        <div className="absolute left-[1785px] top-[760px] z-20 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center pointer-events-none">
          <span className="mb-1 text-[14px] font-black tracking-wide text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.95)]">
            Time Left:{timeLeft}
          </span>
          <div className="relative flex h-[150px] w-[180px] items-center justify-center">
            <img
              src={watch40Img}
              alt="Analog Timer"
              className="h-full w-full object-fill drop-shadow-[0_8px_16px_rgba(0,0,0,0.9)]"
            />
            {/* DYNAMIC COUNTDOWN PIE WEDGE */}
            <svg className="absolute inset-0 h-full w-full pointer-events-none">
              {renderTimerWedge()}
            </svg>
          </div>
        </div>

        {/* ==============================================================
            9. BOTTOM BAR: NEIGHBOUR BET, BALANCE, NAME, HISTORY, LEAVE
        ============================================================== */}
        {/* NEIGHBOUR BET BUTTON */}
        <button
          type="button"
          onClick={() => setIsNeighbourOpen(true)}
          className="absolute left-[20px] top-[760px] z-20 flex h-[75px] w-[205px] cursor-pointer items-center justify-center transition hover:scale-105 active:scale-95"
        >
          <img
            src={neighbourBtn}
            alt="NEIGHBOUR BET"
            className="h-full w-full object-contain drop-shadow"
          />
        </button>

        {/* POINT BALANCE BOX */}
        <div className="absolute left-[20px] top-[840px] z-20 flex h-[70px] w-[268px] select-none flex-col">
          <img
            src={buttonBg}
            alt="POINT BALANCE"
            className="pointer-events-none absolute inset-0 h-full w-full object-fill drop-shadow-md"
          />
          <div className="relative z-10 flex h-[27px] items-center justify-center text-[15px] font-black tracking-wide text-[#081036]">
            POINT BALANCE
          </div>
          <div className="relative z-10 flex flex-1 items-center justify-center pb-1 text-[24px] font-black tracking-wide text-white">
            {Number(wallet).toFixed(2)}
          </div>
        </div>

        {/* NAME BOX */}
        <div className="absolute left-[302px] top-[840px] z-20 flex h-[70px] w-[268px] select-none flex-col">
          <img
            src={buttonBg}
            alt="NAME"
            className="pointer-events-none absolute inset-0 h-full w-full object-fill drop-shadow-md"
          />
          <div className="relative z-10 flex h-[27px] items-center justify-center text-[15px] font-black tracking-wide text-[#081036]">
            NAME
          </div>
          <div className="relative z-10 flex flex-1 items-center justify-center px-2 pb-1 text-[24px] font-black tracking-wide uppercase text-white truncate">
            {user?.username || ''}
          </div>
        </div>

        {/* REMOVE BUTTON (DESELECT CHIP) */}
        <button
          type="button"
          onClick={handleRemoveChip}
          className="absolute left-[810px] top-[825px] z-20 flex h-[80px] w-[235px] cursor-pointer items-center justify-center transition hover:scale-105 active:scale-95"
        >
          <img
            src={removeBtn}
            alt="REMOVE"
            className="h-full w-full object-contain drop-shadow"
          />
        </button>

        {/* DOUBLE BUTTON */}
        <button
          type="button"
          onClick={handleDoubleBets}
          className="absolute left-[1020px] top-[825px] z-20 flex h-[80px] w-[230px] cursor-pointer items-center justify-center transition hover:scale-105 active:scale-95"
        >
          <img
            src={doubleBtn}
            alt="DOUBLE"
            className="h-full w-full object-contain drop-shadow"
          />
        </button>

        {/* CLEAR BET BUTTON */}
        <button
          type="button"
          onClick={handleClearBets}
          className="absolute left-[1220px] top-[825px] z-20 flex h-[80px] w-[230px] cursor-pointer items-center justify-center transition hover:scale-105 active:scale-95"
        >
          <img
            src={clearBetBtn}
            alt="CLEAR BET"
            className="h-full w-full object-contain drop-shadow"
          />
        </button>

        {/* GAME HISTORY BUTTON */}
        <button
          type="button"
          onClick={() => setIsHistoryOpen(true)}
          className="absolute left-[1420px] top-[825px] z-20 flex h-[80px] w-[230px] cursor-pointer items-center justify-center transition hover:scale-105 active:scale-95"
        >
          <img
            src={gameHistoryBtn}
            alt="GAME HISTORY"
            className="h-full w-full object-contain drop-shadow"
          />
        </button>

        {/* LEAVE TABLE BUTTON */}
        <button
          type="button"
          onClick={() => setIsLeaveOpen(true)}
          className="absolute left-[1650px] top-[872px] z-20 flex h-[48px] w-[250px] cursor-pointer items-center justify-center transition hover:scale-105 active:scale-95"
        >
          <img
            src={leaveTableBtn}
            alt="LEAVE TABLE"
            className="h-full w-full object-fill drop-shadow"
          />
        </button>

        {/* ==============================================================
            MODALS / POPUPS
        ============================================================== */}
        {/* LEAVE TABLE CONFIRMATION POPUP */}
        <ConfirmDialog
          isOpen={isLeaveOpen}
          onClose={() => setIsLeaveOpen(false)}
          onConfirm={() => {
            setIsLeaveOpen(false)
            navigate('/dashboard')
          }}
          message={
            <>
              Are you sure you want to<br />go to Lobby?
            </>
          }
        />

        {/* NEIGHBOUR BET POPUP */}
        <NeighbourPopup
          isOpen={isNeighbourOpen}
          onClose={() => setIsNeighbourOpen(false)}
          onBet={handlePlaceBet}
          bets={bets}
          betChips={betChips}
          selectedChip={selectedChip}
          isLocked={timeLeft <= 10}
        />



        {/* GAME HISTORY POPUP */}
        <GameHistoryPopup
          isOpen={isHistoryOpen}
          onClose={() => setIsHistoryOpen(false)}
        />
      </div>
    </div>
  )
}
