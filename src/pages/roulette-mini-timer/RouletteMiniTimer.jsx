import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { useWalletStore } from '../../store/useWalletStore'
import toast from 'react-hot-toast'
import { getGameId, createBetPayload } from '../../utils/helper'
import { playGameTapSound, playBlueWheelSound, stopBlueWheelSound } from '../../utils/sound'

const RED_NUMS = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36]
const BLACK_NUMS = [2, 4, 6, 8, 10, 11, 13, 15, 17, 20, 22, 24, 26, 28, 29, 31, 33, 35]

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
import GameHistoryPopup from '../../components/ui/roulette-mini-timer/GameHistoryPopup'
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

const ROULETTE_ORDER = [
  0, 32, 15, 19, 4, 21, 2, 25, 17, 34, 6, 27, 13, 36, 11, 30, 8, 23, 10,
  5, 24, 16, 33, 1, 20, 14, 31, 9, 22, 18, 29, 7, 28, 12, 35, 3, 26,
];

const getWheelAngle = (num) => {
  const idx = ROULETTE_ORDER.indexOf(Number(num));
  if (idx === -1) return 0;
  return -idx * (360 / 37);
};

export default function RouletteMiniTimer() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { wallet, deductWallet, addWallet } = useWalletStore()

  const [selectedChip, setSelectedChip] = useState(2)
  const [timeLeft, setTimeLeft] = useState(40)
  const [isSpinning, setIsSpinning] = useState(false)
  const [winningNumber, setWinningNumber] = useState(0)
  const [boxWheelAngle, setBoxWheelAngle] = useState(0)
  const [bigWheelAngle, setBigWheelAngle] = useState(0)
  const [ballAngle, setBallAngle] = useState(0)
  const pendingWinnerRef = useRef(0)
  const winnerBadgeTimeoutRef = useRef(null)
  const [youWon, setYouWon] = useState(0)
  const [historyList, setHistoryList] = useState(ITEMS)
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
    playGameTapSound()
  }, [])

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0))
    }, 1000)

    return () => {
      clearInterval(timer)
      stopBlueWheelSound()
      if (waitTimeoutRef.current) clearTimeout(waitTimeoutRef.current)
      if (selectChipsTimeoutRef.current) clearTimeout(selectChipsTimeoutRef.current)
      if (greaterThan10TimeoutRef.current) clearTimeout(greaterThan10TimeoutRef.current)
      if (winnerBadgeTimeoutRef.current) clearTimeout(winnerBadgeTimeoutRef.current)
    }
  }, [])

  useEffect(() => {
    if (timeLeft === 0) {
      if (!isSpinning) {
        setIsSpinning(true)
        setShowWaitToComplete(false)
        setShowPleaseSelectChips(false)
        setShowGreaterThan10(false)
        playBlueWheelSound()
        setTimeLeft(10)

        const nextWinner = Math.floor(Math.random() * 37)
        pendingWinnerRef.current = nextWinner
        const baseAngle = getWheelAngle(nextWinner)

        setBoxWheelAngle((prev) => {
          let diff = (baseAngle - (prev % 360)) % 360
          if (diff <= 0) diff += 360
          return prev + 360 * 8 + diff
        })

        setBigWheelAngle((prev) => {
          let diff = (baseAngle - (prev % 360)) % 360
          if (diff <= 0) diff += 360
          return prev + 360 * 8 + diff
        })

        setBallAngle((prev) => prev - 360 * 14)

        if (winnerBadgeTimeoutRef.current) clearTimeout(winnerBadgeTimeoutRef.current)
        winnerBadgeTimeoutRef.current = setTimeout(() => {
          setWinningNumber(nextWinner)
        }, 8500)
      } else {
        stopBlueWheelSound()
        setIsSpinning(false)

        const newWinner = pendingWinnerRef.current
        setWinningNumber(newWinner)

        const side = newWinner === 0 ? 'm' : RED_NUMS.includes(newWinner) ? 'r' : 'l'
        setHistoryList((prev) => [[newWinner, side], ...prev.slice(0, 9)])

        let winPayout = 0
        if (bets[String(newWinner)]) {
          winPayout += bets[String(newWinner)] * 36
        }
        if (RED_NUMS.includes(newWinner) && bets['red']) {
          winPayout += bets['red'] * 2
        }
        if (BLACK_NUMS.includes(newWinner) && bets['black']) {
          winPayout += bets['black'] * 2
        }
        if (newWinner > 0 && newWinner % 2 === 0 && bets['even']) {
          winPayout += bets['even'] * 2
        }
        if (newWinner % 2 === 1 && bets['odd']) {
          winPayout += bets['odd'] * 2
        }
        if (newWinner >= 1 && newWinner <= 18 && (bets['1-18'] || bets['1_18'])) {
          winPayout += (bets['1-18'] || bets['1_18']) * 2
        }
        if (newWinner >= 19 && newWinner <= 36 && (bets['19-36'] || bets['19_36'])) {
          winPayout += (bets['19-36'] || bets['19_36']) * 2
        }
        if (newWinner >= 1 && newWinner <= 12 && (bets['1st12'] || bets['1ST12'])) {
          winPayout += (bets['1st12'] || bets['1ST12']) * 3
        }
        if (newWinner >= 13 && newWinner <= 24 && (bets['2nd12'] || bets['2ND12'])) {
          winPayout += (bets['2nd12'] || bets['2ND12']) * 3
        }
        if (newWinner >= 25 && newWinner <= 36 && (bets['3rd12'] || bets['3RD12'])) {
          winPayout += (bets['3rd12'] || bets['3RD12']) * 3
        }
        if (newWinner > 0 && newWinner % 3 === 1 && (bets['col-0'] || bets['ROW_1'])) {
          winPayout += (bets['col-0'] || bets['ROW_1']) * 3
        }
        if (newWinner > 0 && newWinner % 3 === 2 && (bets['col-1'] || bets['ROW_2'])) {
          winPayout += (bets['col-1'] || bets['ROW_2']) * 3
        }
        if (newWinner > 0 && newWinner % 3 === 0 && (bets['col-2'] || bets['ROW_3'])) {
          winPayout += (bets['col-2'] || bets['ROW_3']) * 3
        }

        if (winPayout > 0) {
          addWallet(winPayout)
          setYouWon(winPayout)
        } else {
          setYouWon(0)
        }

        setBets({})
        setBetChips({})
        setBetHistory([])
        setIsBetConfirmed(false)
        setShowBetAccepted(false)
        setTotalBet(0)

        setTimeLeft(40)
      }
    }
  }, [timeLeft, isSpinning, bets, addWallet])

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
    if (isBetConfirmed || isSpinning) return
    if (isSpinning || timeLeft <= 10) {
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
    if (betHistory.length === 0 || isBetConfirmed || isSpinning || timeLeft <= 10) return

    const payload = createBetPayload(betHistory, user, '450538')
    if (!payload) return

    console.log(payload, ' payload')
    console.log('Bets Payload:', payload)
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

    if (isSpinning || timeLeft <= 10) {
      toast.error("You can't clear bets during spin or last 10 seconds")
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

    if (isSpinning || timeLeft <= 10) {
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

  const getTimerColor = (time) => {
    if (isSpinning) return '#ff2222'
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
    const maxTime = isSpinning ? 10 : 40

    if (timeLeft >= maxTime) {
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

    const elapsed = maxTime - timeLeft
    const startAngle = (elapsed / maxTime) * 2 * Math.PI
    const startX = cx + rx * Math.sin(startAngle)
    const startY = cy - ry * Math.cos(startAngle)
    const largeArcFlag = timeLeft > (maxTime / 2) ? 1 : 0

    const pathData = `M ${cx} ${cy} L ${startX.toFixed(2)} ${startY.toFixed(2)} A ${rx} ${ry} 0 ${largeArcFlag} 1 ${cx} ${cy - ry} Z`

    return (
      <path
        d={pathData}
        fill={color}
        className="opacity-80"
      />
    )
  }

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
          {historyList.map(([n, side], i) => (
            <div key={i} className={`flex flex-1 items-center ${STYLE[side]}`}>
              {n}
            </div>
          ))}
        </div>

        <div className="absolute left-[265px] top-[17px] z-10 flex h-[200px]  w-[417px] flex-col  p-[0px_12px] pointer-events-none">
          <div className="relative flex h-[122px] w-full overflow-hidden rounded-t-[10px] bg-[#ea926b] border-t-2 border-[#ffd700]/70">
            <div className="absolute left-[200px] h-[600px] w-[600px] -translate-x-1/2 origin-center pointer-events-none">
              <img
                src={wheelImg}
                alt="Arched Roulette Wheel"
                className="h-full w-full object-fill pointer-events-none origin-center"
                style={{
                  transform: `rotate(${boxWheelAngle}deg)`,
                  transition: isSpinning ? 'transform 8.5s cubic-bezier(0.15, 0.85, 0.25, 1)' : 'none'
                }}
              />
            </div>

            <div className="pointer-events-none absolute left-[203px] top-[100px] z-20 h-[22px] w-[22px] -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-[radial-gradient(circle_at_35%_35%,#ffffff_0%,#ffffff_65%,#f1f5f9_85%,#cbd5e1_100%)] " />
          </div>

          <div className="flex flex-col justify-center  ">
            <div className="border-t border-b border-yellow1 py- pl-6 text-[21px] font-semibold text-white drop-shadow">
              Current Play : {totalBet}
            </div>
            <div className="pl-6 text-[21px] font-semibold text-green drop-shadow">
              You Won {youWon}
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

        <button
          type="button"
          className="absolute left-[720px] top-[115px] z-20 h-[32px] w-[280px] cursor-pointer transition hover:scale-105 active:scale-95"
        >
          <img
            src={rulesBtn}
            alt="GAME RULES"
            className="h-full w-full object-fill drop-shadow"
          />
        </button>

        <div className="absolute left-[1058px] z-10 flex h-[98px] w-[190px] items-center justify-center pointer-events-none">
          <span 
            className="text-[54px] font-black tracking-wider drop-shadow-[0_2px_4px_rgba(0,0,0,0.95)]"
            style={{
              color: winningNumber === 0 
                ? '#2ebd27' 
                : RED_NUMS.includes(winningNumber) 
                ? '#ff2b2b' 
                : '#ffffff'
            }}
          >
            {winningNumber}
          </span>
        </div>

        <div className="absolute left-[1580px] top-[115px] z-10 flex h-[500px] w-[630px] -translate-x-1/2 -translate-y-1/2 items-center justify-center pointer-events-none">
          <div className="relative flex h-full w-full items-center justify-center [transform:perspective(1000px)_rotateX(66deg)_rotate(39deg)] origin-center">
            <div 
              className={`relative flex h-full w-full items-center justify-center select-none origin-center ${
                !isSpinning ? 'animate-[spin_10s_linear_infinite]' : ''
              }`}
            >
              <div 
                className="absolute inset-0 flex items-center justify-center origin-center"
                style={{
                  transform: `rotate(${bigWheelAngle}deg)`,
                  transition: isSpinning ? 'transform 8.5s cubic-bezier(0.15, 0.85, 0.25, 1)' : 'none'
                }}
              >
                <img
                  src={wheelImg}
                  alt="Roulette Wheel"
                  className="h-full w-full object-contain drop-shadow-[0_16px_32px_rgba(0,0,0,0.95)]"
                />
              </div>

              <div 
                className="absolute inset-0 flex items-center justify-center origin-center pointer-events-none"
                style={{
                  transform: `rotate(${ballAngle}deg)`,
                  transition: isSpinning ? 'transform 8.5s cubic-bezier(0.1, 0.8, 0.2, 1)' : 'none'
                }}
              >
                <div 
                  className="pointer-events-none absolute left-1/2 top-[16.5%] z-30 h-6 w-6 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-[radial-gradient(circle_at_35%_35%,#ffffff_0%,#ffffff_65%,#f1f5f9_85%,#cbd5e1_100%)] shadow-[0_0_10px_rgba(255,255,255,0.95),0_3px_6px_rgba(0,0,0,0.55),inset_-2px_-2px_3px_rgba(0,0,0,0.15)]" 
                />
              </div>
            </div>
          </div>

          <img
            src={thudiImg}
            alt="Dolly"
            className="absolute left-1/2 top-1/2 h-[70px] w-[76px] -translate-x-1/2 -translate-y-[68%] pointer-events-none object-contain drop-shadow-[0_10px_18px_rgba(0,0,0,0.95)]"
          />
        </div>

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
            isLocked={(timeLeft <= 10 && !isSpinning) || isSpinning}
          />
        </div>

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

        {showGreaterThan10 && (
          <div className="pointer-events-none absolute left-[960px] top-[480px] z-[60] flex -translate-x-1/2 -translate-y-1/2 items-center justify-center">
            <img
              src={greaterThan10Rs}
              alt="GREATER THAN 10RS"
              className="h-[46px] w-[540px] object-contain drop-shadow-[0_4px_16px_rgba(0,0,0,0.95)]"
            />
          </div>
        )}

        {showBetAccepted && (
          <div className="pointer-events-none absolute left-[960px] top-[480px] z-40 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center">
            <img
              src={betAcceptedImg}
              alt="BET ACCEPTED"
              className="h-[46px] w-[540px] object-contain drop-shadow-[0_4px_16px_rgba(0,0,0,0.95)]"
            />
          </div>
        )}

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

        {!isSpinning && (
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
              <svg className="absolute inset-0 h-full w-full pointer-events-none">
                {renderTimerWedge()}
              </svg>
            </div>
          </div>
        )}

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

        <ConfirmDialog
          isOpen={isLeaveOpen}
          onClose={() => setIsLeaveOpen(false)}
          onConfirm={() => {
            stopBlueWheelSound()
            setIsLeaveOpen(false)
            navigate('/dashboard')
          }}
          message={
            <>
              Are you sure you want to<br />go to Lobby?
            </>
          }
        />

        <NeighbourPopup
          isOpen={isNeighbourOpen}
          onClose={() => setIsNeighbourOpen(false)}
          onBet={handlePlaceBet}
          bets={bets}
          betChips={betChips}
          selectedChip={selectedChip}
          isLocked={(timeLeft <= 10 && !isSpinning) || isSpinning}
        />

        <GameHistoryPopup
          isOpen={isHistoryOpen}
          onClose={() => setIsHistoryOpen(false)}
          userName={user?.username || 'PRADEEP'}
          balance={wallet}
        />
      </div>
    </div>
  )
}
