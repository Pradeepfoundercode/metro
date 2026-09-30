import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

import bgSecond from '../../assets/roulette/background_first.png'
import funRouletteBanner from '../../assets/roulette/fun.gif'
import rouletteMachine from '../../assets/roulette/raulette_machine_num.png'
import scoreHd from '../../assets/score_hd.gif'
import winnerGif from '../../assets/winner.gif'
import blinkGif from '../../assets/roulette/blink.gif'
import extraUpper from '../../assets/roulette/extra_box_uppre_design.png'
import extraLower from '../../assets/roulette/extra_box_lower_design.png'
import extraLeft from '../../assets/roulette/blink.gif'
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

import chip1 from '../../assets/roulette/green_with_number.png'
import chip5 from '../../assets/roulette/blue_chip_number.png'
import chip10 from '../../assets/roulette/red_chip_number.png'
import chip50 from '../../assets/roulette/yellow_chip_number.png'
import chip100 from '../../assets/roulette/light_blue_chip_number.png'
import chip500 from '../../assets/roulette/voilet_chip_number.png'
import chip1000 from '../../assets/roulette/orange_chip_number.png'
import chip5000 from '../../assets/roulette/dark_blue_chip_number.png'

import {
  CHIPS,
  RED_NUMBERS,
  ROW_1,
  ROW_2,
  ROW_3,
} from '../../constants/funRouletteData'

export default function FunRoulette() {
  const navigate = useNavigate()
  const { user, updateProfile } = useAuth()

  const [balance, setBalance] = useState(() =>
    Number(user?.wallet ?? 0)
  )

  const [selectedChip, setSelectedChip] = useState(1)
  const [bets, setBets] = useState({})
  const [betHistory, setBetHistory] = useState([])
  const [timeLeft, setTimeLeft] = useState(33)
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

  useEffect(() => {
    if (user?.wallet !== undefined) {
      setBalance(Number(user.wallet))
    }
  }, [user?.wallet])

  const handlePlaceBet = (spot) => {
    if (isLocked || !selectedChip) {
      return
    }

    if (balance < selectedChip) {
      setStatusMessage('Insufficient Balance')
      return
    }

    setBalance((prev) => {
      const nextBalance = prev - selectedChip

      updateProfile({
        wallet: nextBalance,
      })

      return nextBalance
    })

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

    setStatusMessage(
      `Bet Placed: ${selectedChip} on ${spot}`
    )
  }

  const handleSpecificCancelBet = () => {
    if (
      isLocked ||
      betHistory.length === 0
    ) {
      return
    }

    const lastBet =
      betHistory[betHistory.length - 1]

    setBetHistory((prev) => prev.slice(0, -1))

    setBalance((prev) => {
      const nextBalance =
        prev + lastBet.amount

      updateProfile({
        wallet: nextBalance,
      })

      return nextBalance
    })

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

    setStatusMessage('Last bet cancelled')
  }

  const handleBetOk = () => {
    if (totalBet <= 0) {
      setStatusMessage(
        'Please place a bet first'
      )

      return
    }

    setStatusMessage(
      `Bet Accepted: Total ${totalBet} placed. Good Luck!`
    )
  }

  const getChipAsset = (amount) => {
    if (amount >= 5000) return chip5000
    if (amount >= 1000) return chip1000
    if (amount >= 500) return chip500
    if (amount >= 100) return chip100
    if (amount >= 50) return chip50
    if (amount >= 10) return chip10
    if (amount >= 5) return chip5

    return chip1
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
            className="h-[55%] w-[70%] max-h-8 max-w-12 object-contain drop-shadow"
          />

          <span className="absolute text-[clamp(7px,0.65vw,11px)] font-black text-white drop-shadow-[0_1px_2px_rgba(0,0,0,1)]">
            {value}
          </span>
        </div>
      </div>
    )
  }

  return (
    <div className="game-viewport select-none">
      <div className="game-stage">

        <img
          src={bgSecond}
          alt="Roulette Background"
          className="pointer-events-none absolute inset-0 h-full w-full object-fill"
        />

        {/* =========================================
            TOP AREA
        ========================================= */}

        <div className="absolute inset-x-0 top-0 z-20 h-[44%]">

          {/* =========================================
              LEFT PANEL
          ========================================= */}

          <div className="absolute left-[2%] top-[7%] flex w-[19.5%] flex-col items-start">

            {/* SCORE */}

            <div className="relative flex w-full items-center justify-center">
              <img
                src={scoreHd}
                alt="Score"
                className="h-auto w-full object-contain"
              />

              <div className="absolute bottom-[17%] left-0 right-0 flex items-center justify-center">
                <span className="text-[clamp(9px,1.05vw,18px)] font-black tracking-wide text-white">
                  {balance.toFixed(2)}
                </span>
              </div>
            </div>

            {/* TIME */}

            <div className="relative mt-[3%] ml-[7%] flex w-[78%] items-center justify-center">
              <img
                src={extraLeft}
                alt="Time Left"
                className="h-auto w-full object-contain"
              />

              <span className="absolute whitespace-nowrap text-[clamp(8px,0.82vw,14px)] font-extrabold tracking-wide text-white drop-shadow">
                Time Left: {timeLeft}
              </span>
            </div>

            {/* CHIPS */}

            <div className="mt-[4%] flex w-full flex-col gap-[4%]">

              <div className="flex items-center justify-center gap-[2%]">
                {CHIPS.slice(0, 4).map((chip) => (
                  <button
                    key={chip.value}
                    type="button"
                    onClick={() =>
                      setSelectedChip(chip.value)
                    }
                    className={`relative w-[22%] cursor-pointer transition-transform ${
                      selectedChip === chip.value
                        ? 'scale-110'
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

              <div className="flex items-center justify-center gap-[2%]">
                {CHIPS.slice(4, 8).map((chip) => (
                  <button
                    key={chip.value}
                    type="button"
                    onClick={() =>
                      setSelectedChip(chip.value)
                    }
                    className={`relative w-[22%] cursor-pointer transition-transform ${
                      selectedChip === chip.value
                        ? 'scale-110'
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

          {/* =========================================
              CENTER BANNER + WHEEL
          ========================================= */}

          <div className="absolute left-1/2 flex w-[30%] -translate-x-1/2 flex-col items-center">

            {/* BANNER */}

            <img
              src={funRouletteBanner}
              alt="Fun Roulette"
              className="h-auto w-full object-contain"
            />

            {/* WHEEL */}

            <div className="relative  flex w-[68%] items-center justify-center">
              <img
                src={rouletteMachine}
                alt="Roulette Wheel"
                className="h-auto w-full object-contain drop-shadow-[0_10px_22px_rgba(0,0,0,0.9)]"
              />
            </div>

          </div>

          {/* =========================================
              RIGHT PANEL
          ========================================= */}

          <div className="absolute right-[2%] top-[6.5%] flex w-[22.5%] flex-col items-end">

            {/* WINNER */}

            <div className="relative flex w-[90%] items-center justify-center">
              <img
                src={winnerGif}
                alt="Winner"
                className="h-auto w-full object-contain"
              />

              <div className="absolute inset-x-0 bottom-[20%] flex items-center justify-center">
                <span className="text-[clamp(10px,1.15vw,20px)] font-black tracking-wide text-[#39ff14] drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]">
                  {winnerNumber}
                </span>
              </div>
            </div>

            {/* HISTORY */}

            <div className="relative mt-[1.5%] flex w-full items-center justify-center">
              <img
                src={extraUpper}
                alt="History"
                className="h-auto w-full object-contain"
              />

              <div className="absolute inset-x-[18%] top-[20%] flex items-center justify-around">
                {historyList.map((value, index) => {
                  const number =
                    parseInt(value, 10)

                  const isRed =
                    RED_NUMBERS.includes(number)

                  return (
                    <span
                      key={`${value}-${index}`}
                      className={`text-[clamp(7px,0.82vw,14px)] font-black drop-shadow ${
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
                })}
              </div>
            </div>

            {/* RIGHT BUTTONS */}

            <div className="mt-[1.5%] flex w-full flex-col items-end gap-[2%]">

              <button
                type="button"
                onClick={handleBetOk}
                className="relative mr-[8%] flex w-[63%] cursor-pointer items-center justify-center transition hover:brightness-110 active:scale-95"
              >
                <img
                  src={extraRight}
                  alt="Bet Ok"
                  className="h-auto w-full object-contain"
                />

                <span className="absolute text-[clamp(7px,0.82vw,14px)] font-black text-white drop-shadow">
                  Bet Ok
                </span>
              </button>

              <div className="flex w-full items-center justify-end gap-[2%]">

                <button
                  type="button"
                  onClick={handleSpecificCancelBet}
                  className="relative flex w-[41%] cursor-pointer items-center justify-center transition hover:brightness-110 active:scale-95"
                >
                  <img
                    src={noDesignPill}
                    alt="Cancel Bet"
                    className="h-auto w-full object-fill"
                  />

                  <span className="absolute whitespace-nowrap text-[clamp(6px,0.62vw,11px)] font-bold text-white drop-shadow">
                    Cancel Bet
                  </span>
                </button>

                <button
                  type="button"
                  onClick={handleSpecificCancelBet}
                  className="relative flex w-[49%] cursor-pointer items-center justify-center transition hover:brightness-110 active:scale-95"
                >
                  <img
                    src={noDesignPill}
                    alt="Specific Cancel Bet"
                    className="h-auto w-full object-fill"
                  />

                  <span className="absolute whitespace-nowrap text-[clamp(6px,0.62vw,11px)] font-bold text-white drop-shadow">
                    Specific Cancel Bet
                  </span>
                </button>

              </div>
            </div>
          </div>
        </div>

        {/* =========================================
            BETTING GRID
        ========================================= */}

        <div className="absolute left-[4.1%] right-[10.6%] bottom-[11%] z-40">

          <div className="relative aspect-[936/209] w-full">

            <img
              src={rouletteGrid}
              alt="Roulette Betting Grid"
              className="absolute inset-0 z-40 h-full w-full object-fill"
            />

            <div className="absolute inset-0 z-50">

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

                <span className="absolute text-[clamp(7px,0.8vw,14px)] font-black text-white drop-shadow">
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

                <span className="absolute text-[clamp(7px,0.8vw,14px)] font-black text-white drop-shadow">
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

              <div className="absolute left-[8%] top-[1%] grid h-[61%] w-[84%] grid-cols-12 grid-rows-3">

                {[ROW_1, ROW_2, ROW_3].map((row) =>
                  row.map((number) => {
                    const isRed =
                      RED_NUMBERS.includes(number)

                    const spot = String(number)

                    return (
                      <button
                        key={number}
                        type="button"
                        onClick={() =>
                          handlePlaceBet(spot)
                        }
                        className="relative flex cursor-pointer items-center justify-center"
                      >
                        <img
                          src={
                            isRed
                              ? redOvalBtn
                              : blackOvalBtn
                          }
                          alt={spot}
                          className="h-[70%] w-[70%] object-contain"
                        />

                        <span className="absolute text-[clamp(7px,0.8vw,14px)] font-black text-white drop-shadow">
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

              {/* 2 TO 1 */}

              <div className="absolute right-[0.8%] top-[1%] grid h-[61%] w-[6.4%] grid-rows-3">

                {[
                  'ROW_1',
                  'ROW_2',
                  'ROW_3',
                ].map((row) => (
                  <button
                    key={row}
                    type="button"
                    onClick={() =>
                      handlePlaceBet(row)
                    }
                    className="relative flex cursor-pointer items-center justify-center"
                  >
                    <span className="text-[clamp(6px,0.7vw,12px)] font-extrabold tracking-widest text-white [writing-mode:vertical-rl] rotate-180 drop-shadow">
                      2 to 1
                    </span>

                    {renderChipBadge(row)}
                  </button>
                ))}
              </div>

              {/* 12 SECTIONS */}

              <div className="absolute left-[8%] top-[63%] grid h-[17%] w-[84%] grid-cols-3">

                {[
                  ['1ST12', '1st 12'],
                  ['2ND12', '2nd 12'],
                  ['3RD12', '3rd 12'],
                ].map(([spot, label]) => (
                  <button
                    key={spot}
                    type="button"
                    onClick={() =>
                      handlePlaceBet(spot)
                    }
                    className="relative flex cursor-pointer items-center justify-center overflow-hidden"
                  >
                    <span className="text-[clamp(8px,1.35vw,27px)] font-serif font-black leading-none tracking-wider text-[#3bfb22] drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]">
                      {label}
                    </span>

                    {renderChipBadge(spot)}
                  </button>
                ))}
              </div>

              {/* OUTSIDE BETS */}

              <div className="absolute left-[11.9%] top-[82%] grid h-[15%] w-[77.2%] grid-cols-6">

                <button
                  type="button"
                  onClick={() =>
                    handlePlaceBet('1-18')
                  }
                  className="relative flex cursor-pointer items-center justify-center overflow-hidden"
                >
                  <span className="text-[clamp(7px,1.1vw,22px)] font-black leading-none tracking-wide text-white drop-shadow">
                    1 to 18
                  </span>

                  {renderChipBadge('1-18')}
                </button>

                <button
                  type="button"
                  onClick={() =>
                    handlePlaceBet('EVEN')
                  }
                  className="relative flex cursor-pointer items-center justify-center overflow-hidden"
                >
                  <span className="text-[clamp(7px,1.1vw,22px)] font-black leading-none text-white drop-shadow">
                    Even
                  </span>

                  {renderChipBadge('EVEN')}
                </button>

                <button
                  type="button"
                  onClick={() =>
                    handlePlaceBet('RED')
                  }
                  className="relative flex cursor-pointer items-center justify-center overflow-hidden"
                >
                  <img
                    src={redDiamondImg}
                    alt="Red"
                    className="h-full w-[88%] object-fill drop-shadow"
                  />

                  {renderChipBadge('RED')}
                </button>

                <button
                  type="button"
                  onClick={() =>
                    handlePlaceBet('BLACK')
                  }
                  className="relative flex cursor-pointer items-center justify-center overflow-hidden"
                >
                  <img
                    src={blackDiamondImg}
                    alt="Black"
                    className="h-full w-[88%] object-fill drop-shadow"
                  />

                  {renderChipBadge('BLACK')}
                </button>

                <button
                  type="button"
                  onClick={() =>
                    handlePlaceBet('ODD')
                  }
                  className="relative flex cursor-pointer items-center justify-center overflow-hidden"
                >
                  <span className="text-[clamp(7px,1.1vw,22px)] font-black leading-none tracking-wide text-white drop-shadow">
                    Odd
                  </span>

                  {renderChipBadge('ODD')}
                </button>

                <button
                  type="button"
                  onClick={() =>
                    handlePlaceBet('19-36')
                  }
                  className="relative flex cursor-pointer items-center justify-center overflow-hidden"
                >
                  <span className="whitespace-nowrap text-[clamp(7px,1.05vw,21px)] font-black leading-none tracking-wide text-white drop-shadow">
                    19 to 36
                  </span>

                  {renderChipBadge('19-36')}
                </button>

              </div>
            </div>
          </div>
        </div>

        {/* =========================================
            BOTTOM AREA
        ========================================= */}

        <div className="absolute inset-x-[1.5%] bottom-[1.8%] z-[60] flex h-[8%] items-end justify-between gap-[2%]">

          {/* INFO + TOTAL BET */}

          <div className="flex h-full w-[18%] min-w-0 flex-col justify-end gap-[4%]">

            <button
              type="button"
              className="ml-[8%] w-[18%] cursor-pointer transition hover:scale-105 active:scale-95"
            >
              <img
                src={infoIcon}
                alt="Info"
                className="h-auto w-full object-contain drop-shadow"
              />
            </button>

            <div className="relative flex w-full items-center justify-center">

              <img
                src={extraboxleft}
                alt="Total Bet"
                className="h-auto w-full object-fill"
              />

              <span className="absolute whitespace-nowrap text-[clamp(7px,0.7vw,12px)] font-bold text-white drop-shadow">
                Total Bet: {totalBet}
              </span>

            </div>
          </div>

          {/* STATUS */}

          <div className="relative flex h-[75%] w-[58%] min-w-0 items-center justify-center">

            <img
              src={extraLower}
              alt="Status"
              className="h-full w-full object-fill"
            />

            <span className="absolute left-[3%] right-[3%] top-1/2 -translate-y-1/2 truncate text-center text-[clamp(7px,0.7vw,13px)] font-bold tracking-wide text-[#3bfb22] drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]">
              {statusMessage}
            </span>

          </div>

          {/* LEAVE TABLE */}

          <div className="flex w-[18%] min-w-0 items-center justify-end">

            <button
              type="button"
              onClick={() =>
                navigate('/dashboard')
              }
              className="relative flex w-[80%] cursor-pointer items-center justify-center transition hover:brightness-110 active:scale-95"
            >
              <img
                src={noDesignPill}
                alt="Leave Table"
                className="h-auto w-full object-fill"
              />

              <span className="absolute whitespace-nowrap text-[clamp(7px,0.7vw,12px)] font-bold text-white drop-shadow">
                Leave Table
              </span>
            </button>

          </div>
        </div>

      </div>
    </div>
  )
}