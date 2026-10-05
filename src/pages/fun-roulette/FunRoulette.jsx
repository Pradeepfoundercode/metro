import React, { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { useWalletStore } from '../../store/useWalletStore'
import toast from 'react-hot-toast'


import bgSecond from '../../assets/roulette/background_first.png'
import funRouletteBanner from '../../assets/roulette/fun.gif'
import rouletteMachine from '../../assets/roulette/raulette_machine_num.png'
import scoreHd from '../../assets/score_hd.gif'
import winnerGif from '../../assets/winner.gif'
import blinkGif from '../../assets/roulette/blink.gif'
import noblink from '../../assets/roulette/noblink.png'
import extraUpper from '../../assets/roulette/extra_box_uppre_design.png'
import extraLower from '../../assets/roulette/extra_box_lower_design.png'
import extraRight from '../../assets/roulette/extra_box_right_design.png'
import noDesignPill from '../../assets/roulette/no_designe.png'
import extraboxleft from '../../assets/roulette/extra_box_left_design.png'
import redOvalBtn from '../../assets/roulette/red_button.png'
import blackOvalBtn from '../../assets/roulette/black_button.png'
import greenOvalBtn from '../../assets/roulette/green_button.png'
import redDiamondImg from '../../assets/roulette/red_diamond.png'
import blackDiamondImg from '../../assets/roulette/black_diamond.png'
import infoIcon from '../../assets/info.png'
import rouletteGrid from '../../assets/roulette/grid.png'
import waitToComplete from '../../assets/timer_36/wait_to_complete.png'
import placeYourBets from '../../assets/timer_36/pace_your_bets.png'
import greaterThan10Rs from '../../assets/timer_36/gr_than_10.png'
import RouletteMachinePopup from '../../components/ui/RouletteMachinePopup'
import GameHistoryPopup from '../../components/ui/GameHistoryPopup'
import ConfirmDialog from '../../components/ui/ConfirmDialog'


import bet1 from "../../assets/timer_36/2.png"
import bet2 from "../../assets/timer_36/5.png"
import bet3 from "../../assets/timer_36/50.png"
import bet4 from "../../assets/timer_36/100.png"
import bet5 from "../../assets/timer_36/500.png"
import bet6 from "../../assets/timer_36/1000.png"
import bet7 from "../../assets/timer_36/3000.png"

import {
  CHIPS,
  RED_NUMBERS,
  ROW_1,
  ROW_2,
  ROW_3,
} from '../../constants/funRouletteData'
import { placeFunRouletteBet } from '../../services/funroulette.services'
import { getGameId, createBetPayload } from '../../utils/helper'


const MIN_10_BET_SPOTS = [
  '00',
  '1ST12',
  '2ND12',
  '3RD12',
  '1-18',
  'EVEN',
  'RED',
  'BLACK',
  'ODD',
  '19-36',
  'ROW_1',
  'ROW_2',
  'ROW_3',
]


const CHIP_GLOW_COLORS = {
  1: '#00ff38',
  5: '#315cff',
  10: '#ff2020',
  50: '#ffe500',
  100: '#00eaff',
  500: '#ff32d2',
  1000: '#ff7518',
  5000: '#394cff',
}
export default function FunRoulette() {

  const [showGreaterThan10, setShowGreaterThan10] = useState(false)
  const navigate = useNavigate()
  const { user } = useAuth()
  const { wallet, deductWallet, addWallet } = useWalletStore()
  const balance = wallet

  const [selectedChip, setSelectedChip] = useState(1)
  const [bets, setBets] = useState({})
  const [betHistory, setBetHistory] = useState([])
  const [showWaitToComplete, setShowWaitToComplete] = useState(false)

  const [timeLeft, setTimeLeft] = useState(25)
  const initialTimeRef = useRef(timeLeft)
  const [isPopupOpen, setIsPopupOpen] = useState(false)
  const [isHistoryOpen, setIsHistoryOpen] = useState(false)
  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false)

  const [winnerNumber, setWinnerNumber] = useState('0')

  const [historyList, setHistoryList] = useState([
    '26',
    '12',
    '13',
    '7',
    '6',
  ])

  const [isLocked, setIsLocked] = useState(false)

  const [statusMessage, setStatusMessage] = useState(
    'Please Bet to start Game . Minimum Bet = 1'
  )

  const [winningSpot, setWinningSpot] = useState(null)

  const totalBet = Object.values(bets).reduce(
    (total, amount) => total + amount,
    0
  )

 const handlePlaceBet = (spot) => {
  if (isLocked || !selectedChip) {
    return
  }

  
  if (timeLeft <= 10) {
    setShowWaitToComplete(true)
    return
  }

  const requiresMinimum10 = MIN_10_BET_SPOTS.includes(spot)

  if (requiresMinimum10 && selectedChip < 10) {
    setShowGreaterThan10(true)
    return
  }

  setShowGreaterThan10(false)
  setShowWaitToComplete(false)

  // Balance insufficient => bet nahi lagega
  if (wallet < selectedChip) {
    return
  }

  deductWallet(selectedChip)

  setBets((prev) => ({
    ...prev,
    [spot]: (prev[spot] || 0) + selectedChip,
  }))

  setBetHistory((prev) => [
    ...prev,
    {
      spot,
      amount: selectedChip,
    },
  ])
}

  const handleSpecificCancelBet = () => {
  if (isLocked) {
    return
  }

  if (timeLeft <= 10) {
    toast.error("You can't cancel bets in the last 10 seconds")
    return
  }

  if (betHistory.length === 0) {
    return
  }

  const lastBet =
    betHistory[betHistory.length - 1]

  setBetHistory((prev) =>
    prev.slice(0, -1)
  )

  addWallet(lastBet.amount)

  setBets((prev) => {
    const currentAmount =
      prev[lastBet.spot] || 0

    const updatedAmount =
      currentAmount - lastBet.amount

    const nextBets = {
      ...prev,
    }

    if (updatedAmount <= 0) {
      delete nextBets[lastBet.spot]
    } else {
      nextBets[lastBet.spot] =
        updatedAmount
    }

    return nextBets
  })

  // setStatusMessage('Last bet cancelled')
}

 const handleCancelBet = () => {
  if (isLocked) {
    return
  }

  if (timeLeft <= 10) {
    toast.error("You can't cancel bets in the last 10 seconds")
    return
  }

  if (betHistory.length === 0) {
    return
  }

  const refundAmount = betHistory.reduce(
    (total, bet) => total + bet.amount,
    0
  )

  setBetHistory([])
  setBets({})

  addWallet(refundAmount)

  // setStatusMessage(
  //   `All bets cancelled: ${refundAmount} refunded`
  // )
}

  const handleBetOk = () => {
    const payload = createBetPayload(betHistory, user, '450538')
    if (!payload) return

    console.log(payload, " payload")
    console.log('Bets Payload:', payload)
    toast.success('Bet Placed Successfully')
  }



  const getChipAsset = (amount) => {
    if (amount >= 5000) {
      return bet6
    }

    if (amount >= 1000) {
      return bet5
    }

    if (amount >= 500) {
      return bet4
    }

    if (amount >= 100) {
      return bet3
    }

    if (amount >= 50) {
      return bet1
    }

    if (amount >= 10) {
      return bet2
    }

    if (amount >= 5) {
      return bet1
    }

    return bet1
  }

  const renderChipBadge = (spot) => {
    const value = bets[spot]

    if (!value) {
      return null
    }

    return (
      <div className="pointer-events-none absolute inset-0 z-30 flex items-center justify-center">
        <div className="relative flex items-center justify-center">
          <img
            src={getChipAsset(value)}
            alt="chip"
            className=" max-h-11 max-w-14 object-contain drop-shadow"
          />

          <span className="absolute text-[clamp(7px,0.65vw,11px)] md:text-[15px] font-black  ">
            {value}
          </span>
        </div>
      </div>
    )
  }



  const isPopupOpenRef = useRef(isPopupOpen)
  useEffect(() => {
    isPopupOpenRef.current = isPopupOpen
  }, [isPopupOpen])

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 0) {
          if (!isPopupOpenRef.current) {
            // Normal countdown reached 0 -> Open popup & start 10s countdown
            setIsPopupOpen(true)
            setBets({})
            return 10
          } else {
            // Popup 10s countdown reached 0 -> Close popup & resume from base round time
            setIsPopupOpen(false)
            return initialTimeRef.current
          }
        }

        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const handleClosePopup = () => {
    setIsPopupOpen(false)
    setTimeLeft(initialTimeRef.current)
  }







  return (
    <div className="game-viewport select-none">

      <div className="game-stage">

        <img
          src={bgSecond}
          alt="Roulette Background"
          className="pointer-events-none absolute inset-0 z-0 h-full w-full object-fill"
        />

        {/* =========================
            TOP AREA
        ========================= */}

        <div className="absolute inset-x-0 top-0 z-20 h-[43%]">

          {/* SCORE */}

          <div className="absolute left-[4%] top-[20%] flex w-[23%] flex-col items-start">

            <div className="relative flex w-full items-center justify-center">

              <img
  src={scoreHd}
  alt="Score"
  className="h-[85px] w-[200%] object-fill"
/>

              <div className="absolute bottom-[20%] left-0 right-0 flex items-center justify-center">

                <span className="text-[20px] font-bold tracking-wide text-white">
                  {Number(wallet).toFixed(2)}
                </span>

              </div>

            </div>

            {/* TIME */}

            <div className="relative mt-[1%] ml-[7%] flex w-[78%] items-center justify-center">

  <img
    src={noblink}
    alt="Time Left"
    className="w-[100%] h-[79px] object-contain"
  />

  {/* Top & Bottom Blinking Border (Dip-Dip) when timeLeft <= 20 */}
  {timeLeft <= 20 && (
    <div className="pointer-events-none absolute inset-x-[7%] top-[19%] bottom-[38%] border-t-[5px] border-b-[5px] rounded-[4px] flash-border w-[85%]" />
  )}

  <span className="absolute  whitespace-nowrap text-[19px] top-4 font-bold tracking-wide text-white drop-shadow">
    Time Left: {timeLeft}
  </span>

</div>

            {/* CHIPS */}

           <div className="mt-[4%] flex w-full flex-col gap-3">

  <div className="flex items-center justify-center gap-[5%]">
    {CHIPS.slice(0, 4).map((chip) => (
      <button
        key={chip.value}
        type="button"
        onClick={() => setSelectedChip(chip.value)}
        style={{
          '--chip-glow': CHIP_GLOW_COLORS[chip.value],
        }}
        className={`relative w-[25%] cursor-pointer transition-transform duration-200 ${
          selectedChip === chip.value
            ? 'scale-120 selected-chip-glow'
            : 'hover:scale-105 active:scale-95'
        }`}
      >
        <img
          src={chip.img}
          alt={`chip ${chip.value}`}
          className="h-auto w-full object-contain"
        />
      </button>
    ))}
  </div>

  <div className="flex items-center justify-center gap-[5%]">
    {CHIPS.slice(4, 8).map((chip) => (
      <button
        key={chip.value}
        type="button"
        onClick={() => setSelectedChip(chip.value)}
        style={{
          '--chip-glow': CHIP_GLOW_COLORS[chip.value],
        }}
        className={`relative w-[25%] cursor-pointer transition-transform duration-200 ${
          selectedChip === chip.value
            ? 'scale-120 selected-chip-glow'
            : 'hover:scale-105 active:scale-95'
        }`}
      >
        <img
          src={chip.img}
          alt={`chip ${chip.value}`}
          className="h-auto w-full object-contain"
        />
      </button>
    ))}
  </div>

</div>

          </div>

          {/* CENTER */}

        <div className="absolute left-1/2 top-0 z-50 flex w-[34%] -translate-x-1/2 flex-col items-center">

  {/* FUN ROULETTE BANNER */}

  <img
    src={funRouletteBanner}
    alt="Fun Roulette"
    className="h-[95px] w-[300%] object-fill"
  />

  {/* ROULETTE MACHINE */}

  <div className="relative mt-[6%] flex w-full items-center justify-center">
    <img
      src={rouletteMachine}
      alt="Roulette Wheel"
      className="h-[300px] w-[500px] object-fill drop-shadow-[0_8px_18px_rgba(0,0,0,0.9)]"
    />
  </div>

  {/* PLACE YOUR BETS */}

  <div className="relative -mt-[2px] flex w-[85%] items-center justify-center">
    <img
  src={
    timeLeft <= 10
      ? waitToComplete
      : showGreaterThan10
        ? greaterThan10Rs
        : placeYourBets
  }
  alt="Bet Message"
  className="h-[30px] w-full object-fill"
/>
  </div>

</div>

          {/* WINNER / RIGHT */}

          <div className="absolute right-[4%] top-[20%] flex w-[21%] flex-col items-end">

            {/* WINNER */}

            <div className="relative flex w-[90%] items-center justify-center">

              <img
                src={winnerGif}
                alt="Winner"
                className="h-[140px] w-[230%] object-fill"
              />

              <div className="absolute inset-x-0 bottom-[20%] flex items-center justify-center">

                <span className="text-[30px] mb-1  font-bold tracking-wide text-[#39ff14] drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]">
                  {winnerNumber}
                </span>

              </div>

            </div>

            {/* HISTORY */}

            <div
              onClick={() => setIsHistoryOpen(true)}
              className="relative mt-[1.5%] flex w-full items-center justify-center cursor-pointer transition hover:brightness-110 active:scale-95"
            >

              <img
                src={extraUpper}
                alt="History"
                className="h-[70px] w-full object-contain"
              />

              <div className="absolute inset-x-[18%] top-[30%] flex items-center justify-around">

                {historyList.map(
                  (value, index) => {
                    const number =
                      parseInt(
                        value,
                        10
                      )

                    const isRed =
                      RED_NUMBERS.includes(
                        number
                      )

                    return (
                      <span
                        key={`${value}-${index}`}
                        className={`text-[20px]  font-black drop-shadow ${
                          value === '0' ||
                          value === '00'
                            ? 'text-[#39ff14]'
                            : isRed
                              ? 'text-[#ff3b30]'
                              : 'text-white'
                        }`}
                      >
                        {value}
                      </span>
                    )
                  }
                )}

              </div>

            </div>

            {/* BET BUTTONS */}

            <div className="mt-[1.5%] flex w-full flex-col items-end gap-[2%]">

              <button
                type="button"
                onClick={handleBetOk}
                className="relative mr-[8%] flex w-[80%] cursor-pointer items-center justify-center transition hover:brightness-110 active:scale-95"
              >

                <img
                  src={extraRight}
                  alt="Bet Ok"
                  className="h-[50px] w-full object-fill"
                />

                <span className="absolute text-[20px]  font-bold text-white drop-shadow mr-4 mt-1">
                  Bet Ok
                </span>

              </button>

              <div className="flex w-[125%] items-center justify-end gap-[2%]">

                <button
                  type="button"
                  onClick={
                    handleCancelBet
                  }
                  className="relative flex w-[50%] cursor-pointer items-center justify-center transition hover:brightness-110 active:scale-95"
                >

                  <img
                    src={noDesignPill}
                    alt="Cancel Bet"
                    className="h-[40px] w-full object-fill"
                  />

                  <span className="absolute whitespace-nowrap text-[20px] font-bold text-white drop-shadow">
                    Cancel Bet
                  </span>

                </button>

                <button
                  type="button"
                  onClick={
                    handleSpecificCancelBet
                  }
                  className="relative flex w-[50%] cursor-pointer items-center justify-center transition hover:brightness-110 active:scale-95"
                >

                  <img
                    src={noDesignPill}
                    alt="Specific Cancel Bet"
                    className="h-[40px] w-full object-fill"
                  />

                  <span className="absolute whitespace-nowrap text-[20px] font-bold text-white drop-shadow">
                    Specific Cancel Bet
                  </span>

                </button>

              </div>

            </div>

          </div>

        </div>

        {/* =========================
            BETTING GRID
        ========================= */}

       <div className="absolute left-[3.5%] right-[4.5%] top-[50.5%] z-40">

          <div className="relative aspect-[936/209] w-full">

            <img
              src={rouletteGrid}
              alt="Roulette Betting Grid"
              className="absolute inset-0 z-0 h-full w-full object-fill"
            />

            <div className="absolute inset-0 z-10">

              {/* 00 */}

              <button
                type="button"
                onClick={() =>
                  handlePlaceBet('00')
                }
                className="absolute left-[0.8%] top-[1%] flex h-[31%] w-[6.8%] cursor-pointer items-center justify-center"
              >

                <img
                  src={greenOvalBtn}
                  alt="00"
                  className="h-[70%] w-[82%] object-contain"
                />

                <span className="absolute text-[22px] font-black text-white drop-shadow">
                  00
                </span>

                {winningSpot === '00' && (
                  <img
                    src={blinkGif}
                    alt="blink"
                    className="pointer-events-none absolute inset-0 h-full w-full object-contain"
                  />
                )}

                {renderChipBadge('00')}

              </button>

              {/* 0 */}

              <button
                type="button"
                onClick={() =>
                  handlePlaceBet('0')
                }
                className="absolute left-[0.8%] top-[32%] flex h-[31%] w-[6.8%] cursor-pointer items-center justify-center"
              >

                <img
                  src={greenOvalBtn}
                  alt="0"
                  className="h-[70%] w-[82%] object-contain"
                />

                <span className="absolute text-[22px] font-black text-white drop-shadow">
                  0
                </span>

                {winningSpot === '0' && (
                  <img
                    src={blinkGif}
                    alt="blink"
                    className="pointer-events-none absolute inset-0 h-full w-full object-contain"
                  />
                )}

                {renderChipBadge('0')}

              </button>

              {/* NUMBER GRID */}

              <div className="absolute left-[8%] top-[1%] z-10 grid h-[65%] w-[84.5%] grid-cols-12 grid-rows-3">

  {[
    ROW_1,
    ROW_2,
    ROW_3,
  ].map((row) =>
    row.map((number) => {

      const isRed = RED_NUMBERS.includes(number)

      const spot = String(number)

      return (
        <button
          key={number}
          type="button"
          onClick={() => handlePlaceBet(spot)}
          className="relative z-50 flex cursor-pointer items-center justify-center"
        >

          <img
            src={
              isRed
                ? redOvalBtn
                : blackOvalBtn
            }
            alt={spot}
            className="h-[60%] w-[75%] object-fill"
          />

          <span className="absolute text-[28px] font-black text-white drop-shadow">
            {number}
          </span>

          {winningSpot === spot && (
            <img
              src={blinkGif}
              alt="blink"
              className="pointer-events-none absolute inset-0 h-full w-full object-contain"
            />
          )}

          {renderChipBadge(spot)}

        </button>
      )
    })
  )}

</div>

              {/* =========================
    SPLIT BET HIT AREAS
========================= */}

<div className="absolute left-[8%] top-[1%] h-[65%] w-[84.5%]">

  {/* Between Row 1 and Row 2 */}

  <div className="absolute inset-x-0 z-20 top-[33.33%] flex -translate-y-1/2">

    {[
      '2-3',
      '5-6',
      '8-9',
      '11-12',
      '14-15',
      '17-18',
      '20-21',
      '23-24',
      '26-27',
      '29-30',
      '32-33',
      '35-36',
    ].map((spot) => (
      <button
        key={spot}
        type="button"
        onClick={() => handlePlaceBet(spot)}
        className="relative h-[12px] w-[8.33%] cursor-pointer"
      >
        {renderChipBadge(spot)}
      </button>
    ))}

  </div>


  {/* Between Row 2 and Row 3 */}

  <div className="absolute inset-x-0 z-20 top-[66.66%] flex -translate-y-1/2">

    {[
      '1-2',
      '4-5',
      '7-8',
      '10-11',
      '13-14',
      '16-17',
      '19-20',
      '22-23',
      '25-26',
      '28-29',
      '31-32',
      '34-35',
    ].map((spot) => (
      <button
        key={spot}
        type="button"
        onClick={() => handlePlaceBet(spot)}
        className="relative h-[12px] w-[8.33%] cursor-pointer"
      >
        {renderChipBadge(spot)}
      </button>
    ))}

  </div>

</div>

{/* =========================
    BETWEEN COLUMN SPLIT BETS
========================= */}

<div className="absolute left-[7.5%] top-[1%] z-30 h-[65%] w-[85.5%] pointer-events-none">

  {[
    '3-6',
    '6-9',
    '9-12',
    '12-15',
    '15-18',
    '18-21',
    '21-24',
    '24-27',
    '27-30',
    '30-33',
    '33-36',
  ].map((spot, index) => (
    <button
      key={spot}
      type="button"
      onClick={() => handlePlaceBet(spot)}
      style={{
        left: `${((index + 1) / 12) * 100}%`,
      }}
      className="
        pointer-events-auto
        absolute
        top-[19%]
        -translate-x-1/2
        -translate-y-1/2
        h-[40px]
        w-[40px]
        cursor-pointer
      "
    >
      {renderChipBadge(spot)}
    </button>
  ))}

</div>


{/* =========================
    4 NUMBER / CORNER BETS
========================= */}

<div className="absolute left-[7.5%] top-[1%] z-20 h-[65%] w-[85.5%] pointer-events-none">

  {/* =========================
      ROW 1 + ROW 2
  ========================= */}

  {[
    '2-3-5-6',
    '5-6-8-9',
    '8-9-11-12',
    '11-12-14-15',
    '14-15-17-18',
    '17-18-20-21',
    '20-21-23-24',
    '23-24-26-27',
    '26-27-29-30',
    '29-30-32-33',
    '32-33-35-36',
  ].map((spot, index) => (
    <button
      key={spot}
      type="button"
      onClick={() => handlePlaceBet(spot)}
      style={{
        left: `${((index + 1) / 12) * 100}%`,
        top: '33.33%',
      }}
      className="
        pointer-events-auto
        absolute
        -translate-x-1/2
        -translate-y-1/2
        flex
        
        h-[42px]
        w-[50px]
        cursor-pointer
        items-center
        justify-center
      "
    >
      {renderChipBadge(spot)}
    </button>
  ))}


  {/* =========================
      ROW 2 + ROW 3
  ========================= */}

  {[
    '1-2-4-5',
    '4-5-7-8',
    '7-8-10-11',
    '10-11-13-14',
    '13-14-16-17',
    '16-17-19-20',
    '19-20-22-23',
    '22-23-25-26',
    '25-26-28-29',
    '28-29-31-32',
    '31-32-34-35',
  ].map((spot, index) => (
    <button
      key={spot}
      type="button"
      onClick={() => handlePlaceBet(spot)}
      style={{
        left: `${((index + 1) / 12) * 100}%`,
        top: '66.66%',
      }}
      className="
        pointer-events-auto
        absolute
        -translate-x-1/2
        -translate-y-1/2
        flex
        
        h-[42px]
        w-[50px]
        cursor-pointer
        items-center
        justify-center
      "
    >
      {renderChipBadge(spot)}
    </button>
  ))}

</div>




<div className="absolute left-[7.5%] top-[1%] z-40 h-[65%] w-[85.5%] pointer-events-none">

  {[
    '1-2-3-4-5-6',
    '4-5-6-7-8-9',
    '7-8-9-10-11-12',
    '10-11-12-13-14-15',
    '13-14-15-16-17-18',
    '16-17-18-19-20-21',
    '19-20-21-22-23-24',
    '22-23-24-25-26-27',
    '25-26-27-28-29-30',
    '28-29-30-31-32-33',
    '31-32-33-34-35-36',
  ].map((spot, index) => (
    <button
      key={spot}
      type="button"
      onClick={() => handlePlaceBet(spot)}
      style={{
        left: `${((index + 1) / 12) * 100}%`,
      }}
      className="
        pointer-events-auto
        absolute
        bottom-0
        -translate-x-1/2
        translate-y-1/2
        flex
        h-[44px]
        w-[50px]
        cursor-pointer
        items-center
        justify-center
      "
    >
      {renderChipBadge(spot)}
    </button>
  ))}

</div>


{/* =========================
    3 NUMBER / STREET BETS
    BOTTOM OF EACH COLUMN
========================= */}

<div className="absolute left-[8%] top-[1%] z-40 h-[65%] w-[84.5%] pointer-events-none">

  {[
    '1-2-3',
    '4-5-6',
    '7-8-9',
    '10-11-12',
    '13-14-15',
    '16-17-18',
    '19-20-21',
    '22-23-24',
    '25-26-27',
    '28-29-30',
    '31-32-33',
    '34-35-36',
  ].map((spot, index) => (
    <button
      key={spot}
      type="button"
      onClick={() => handlePlaceBet(spot)}
      style={{
        left: `${((index + 0.5) / 12) * 100}%`,
      }}
      className="
        pointer-events-auto
        absolute
        bottom-0
        -translate-x-1/2
        translate-y-1/2
        flex
        h-[27px]
        w-[34px]
        cursor-pointer
        items-center
        justify-center
      "
    >
      {renderChipBadge(spot)}
    </button>
  ))}

</div>



{/* =========================
    COLUMN SPLIT BETS - ROW 2
========================= */}

<div className="absolute left-[7.5%] top-[1%] z-30 h-[65%] w-[85.5%] pointer-events-none">

  {[
  '2-5',
  '5-8',
  '8-11',
  '11-14',
  '14-17',
  '17-20',
  '20-23',
  '23-26',
  '26-29',
  '29-32',
  '32-35',
].map((spot, index) => (
  <button
    key={spot}
    type="button"
    onClick={() => handlePlaceBet(spot)}
    style={{
      left: `${((index + 1) / 12) * 100}%`,
      top: '50%',
    }}
    className="
      pointer-events-auto
      absolute
      
      -translate-x-1/2
      -translate-y-1/2
      h-[40px]
      w-[40px]
      cursor-pointer
    "
  >
    {renderChipBadge(spot)}
  </button>
))}

</div>

{/* =========================
    COLUMN SPLIT BETS - ROW 3
========================= */}

<div className="absolute left-[7.5%] top-[1%] z-30 h-[65%] w-[85.5%] pointer-events-none">

  {[
  '1-4',
  '4-7',
  '7-10',
  '10-13',
  '13-16',
  '16-19',
  '19-22',
  '22-25',
  '25-28',
  '28-31',
  '31-34',
].map((spot, index) => (
  <button
    key={spot}
    type="button"
    onClick={() => handlePlaceBet(spot)}
    style={{
      left: `${((index + 1) / 12) * 100}%`,
      top: '83.33%',
    }}
    className="
      pointer-events-auto
      absolute
      
      -translate-x-1/2
      -translate-y-1/2
      h-[40px]
      w-[40px]
      cursor-pointer
    "
  >
    {renderChipBadge(spot)}
  </button>
))}

</div>

              {/* 2 TO 1 */}

              <div className="absolute right-[0.8%] top-[1%] grid h-[65%] w-[6.4%] grid-rows-3">

                {[
                  'ROW_1',
                  'ROW_2',
                  'ROW_3',
                ].map((row) => (
                  <button
                    key={row}
                    type="button"
                    onClick={() =>
                      handlePlaceBet(
                        row
                      )
                    }
                    className="relative flex cursor-pointer items-center justify-center"
                  >

                    <span className="text-[20px] font-extrabold tracking-widest text-white [writing-mode:vertical-rl] drop-shadow">
                      2 to 1
                    </span>

                    {renderChipBadge(row)}

                  </button>
                ))}

              </div>

              {/* 12 SECTIONS */}

              <div className="absolute left-[8%] top-[65%] grid h-[17%] w-[84%] grid-cols-3">

                {[
                  ['1ST12', '1st 12'],
                  ['2ND12', '2nd 12'],
                  ['3RD12', '3rd 12'],
                ].map(
                  ([spot, label]) => (
                    <button
                      key={spot}
                      type="button"
                      onClick={() =>
                        handlePlaceBet(
                          spot
                        )
                      }
                      className="relative flex cursor-pointer items-center justify-center overflow-hidden"
                    >

                      <span className="text-[40px] font-serif font-black leading-none tracking-wider text-[#3bfb22] drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]">
                        {label}
                      </span>

                      {renderChipBadge(
                        spot
                      )}

                    </button>
                  )
                )}

              </div>

              {/* OUTSIDE BETS */}

              <div className="absolute left-[11.9%] top-[84%] grid h-[15%] w-[77.2%] grid-cols-6">

                <button
                  type="button"
                  onClick={() =>
                    handlePlaceBet(
                      '1-18'
                    )
                  }
                  className="relative flex cursor-pointer items-center justify-center overflow-hidden"
                >

                  <span className="text-[35px] font-black leading-none tracking-wide text-white drop-shadow">
                    1 to 18
                  </span>

                  {renderChipBadge(
                    '1-18'
                  )}

                </button>

                <button
                  type="button"
                  onClick={() =>
                    handlePlaceBet(
                      'EVEN'
                    )
                  }
                  className="relative flex cursor-pointer items-center justify-center overflow-hidden"
                >

                  <span className="text-[35px] font-black leading-none text-white drop-shadow">
                    Even
                  </span>

                  {renderChipBadge(
                    'EVEN'
                  )}

                </button>

                <button
                  type="button"
                  onClick={() =>
                    handlePlaceBet(
                      'RED'
                    )
                  }
                  className="relative flex cursor-pointer items-center justify-center overflow-hidden"
                >

                  <img
                    src={redDiamondImg}
                    alt="Red"
                    className="h-full w-[98%] object-fill drop-shadow"
                  />

                  {renderChipBadge(
                    'RED'
                  )}

                </button>

                <button
                  type="button"
                  onClick={() =>
                    handlePlaceBet(
                      'BLACK'
                    )
                  }
                  className="relative flex cursor-pointer items-center justify-center overflow-hidden"
                >

                  <img
                    src={blackDiamondImg}
                    alt="Black"
                    className="h-full w-[98%] object-fill drop-shadow mr-6"
                  />

                  {renderChipBadge(
                    'BLACK'
                  )}

                </button>

                <button
                  type="button"
                  onClick={() =>
                    handlePlaceBet(
                      'ODD'
                    )
                  }
                  className="relative flex cursor-pointer items-center justify-center overflow-hidden"
                >

                  <span className="text-[35px] font-black leading-none tracking-wide text-white drop-shadow">
                    Odd
                  </span>

                  {renderChipBadge(
                    'ODD'
                  )}

                </button>

                <button
                  type="button"
                  onClick={() =>
                    handlePlaceBet(
                      '19-36'
                    )
                  }
                  className="relative flex cursor-pointer items-center justify-center overflow-hidden"
                >

                  <span className="whitespace-nowrap text-[35px] font-black leading-none tracking-wide text-white drop-shadow">
                    19 to 36
                  </span>

                  {renderChipBadge(
                    '19-36'
                  )}

                </button>

              </div>

            </div>
          </div>
        </div>

        {/* =========================
            BOTTOM AREA
        ========================= */}

        <div className="absolute inset-x-[1.5%] bottom-[0%] z-50 flex h-[8%] items-end justify-between gap-[2%]">

          {/* INFO + TOTAL */}

          <div className="flex h-full w-[18%] min-w-0 flex-col justify-end gap-[4%]">

            <button
              type="button"
              onClick={() => setIsHistoryOpen(true)}
              className="ml-[8%] w-[26%] cursor-pointer transition hover:scale-105 active:scale-95"
            >

              <img
                src={infoIcon}
                alt="Info"
                className="h-[60%] w-full object-fill drop-shadow"
              />

            </button>

            <div className="relative flex w-full items-center justify-center">

              <img
                src={extraboxleft}
                alt="Total Bet"
                className="h-[70%] w-full object-fill"
              />

              <span className="absolute  text-[21px] mt-2 font-bold text-white drop-shadow ml-4  ">
                Total Bet: {totalBet}
              </span>

            </div>

          </div>

          {/* STATUS */}

          <div className="relative flex h-[85%] w-[70%] min-w-0 items-center justify-center">

            <img
              src={extraLower}
              alt="Status"
              className="h-full w-full object-fill"
            />

            <span className="absolute left-[3%] right-[3%] top-1/2 -translate-y-1/2 truncate text-center text-[17px] font-bold tracking-wide text-[#3bfb22] drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]">
              {statusMessage}
            </span>

          </div>

          {/* LEAVE */}

          <div className="flex w-[20%] min-w-0 items-center justify-end mb-2">

            <button
              type="button"
              onClick={() => setIsLeaveModalOpen(true)}
              className="relative flex w-[80%] cursor-pointer items-center justify-center transition hover:brightness-110 active:scale-95"
            >

              <img
                src={noDesignPill}
                alt="Leave Table"
                className="h-auto w-full object-fill"
              />

              <span className="absolute whitespace-nowrap text-[20px] font-bold text-white drop-shadow">
                Leave Table
              </span>

            </button>

          </div>

        </div>

        {/* =========================
            ROULETTE MACHINE POPUP (SHOWS ON TIMER 0)
        ========================= */}
        <RouletteMachinePopup
          isOpen={isPopupOpen}
          onClose={handleClosePopup}
          timeLeft={timeLeft}
        />

        {/* =========================
            ROULETTE GAME HISTORY POPUP
        ========================= */}
        <GameHistoryPopup
          isOpen={isHistoryOpen}
          onClose={() => setIsHistoryOpen(false)}
          userName={user?.username || 'PLAYER'}
          balance={balance}
        />

        {/* =========================
            LEAVE TABLE CONFIRMATION POPUP
        ========================= */}
        <ConfirmDialog
          isOpen={isLeaveModalOpen}
          onClose={() => setIsLeaveModalOpen(false)}
          onConfirm={() => {
            setIsLeaveModalOpen(false)
            navigate('/dashboard')
          }}
          message={
            <>
              Are you sure you want to<br />go to Lobby?
            </>
          }
        />

      </div>
    </div>
  )
}