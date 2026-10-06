import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { useWalletStore } from '../../store/useWalletStore'
import { placeFunTargetBet } from '../../services/funtarget.services'
import GameHistoryPopup from '../../components/ui/GameHistoryPopup'
import ConfirmDialog from '../../components/ui/ConfirmDialog'
import { playGameTapSound, playMoveChakraSound, stopMoveChakraSound } from '../../utils/sound'

import homeBgFun from '../../assets/fun_target/home_bg_fun.png'
import scoreWord from '../../assets/fun_target/score_word.png'
import winnerWord from '../../assets/fun_target/winner_word.png'
import timeWord from '../../assets/fun_target/time_word.png'
import rectangleFun from '../../assets/rectangle_fun.gif'
import badaChakra from '../../assets/fun_target/bada_chakra.png'
import mainGif from '../../assets/fun_target/main.gif'
import staticCoin from '../../assets/fun_target/static_coin.png'
import scorpioImg from '../../assets/fun_target/scorpio.png'
import lastDataWord from '../../assets/fun_target/last_data_word.png'
import treasureBoxFun from '../../assets/treasure_box_fun.gif'

import yellowButtons from '../../assets/fun_target/yellow_buttons.png'
import chip1 from '../../assets/fun_target/1.png'
import chip5 from '../../assets/fun_target/5.png'
import chip10 from '../../assets/fun_target/10.png'
import chip50 from '../../assets/fun_target/50.png'
import chip100 from '../../assets/fun_target/100.png'
import chip500 from '../../assets/fun_target/500.png'
import chip1000 from '../../assets/fun_target/1000.png'
import chip5000 from '../../assets/fun_target/5000.png'

import takeBtn from '../../assets/fun_target/take_new.png'
import cancelBetBtn from '../../assets/fun_target/cancel_bet.png'
import infoIcon from '../../assets/info.png'
import betOkBtn from '../../assets/fun_target/bet_ok.png'
import scrollBanner from '../../assets/fun_target/circle_button2.png'
import greenBtn from '../../assets/fun_target/green.png'
import orangeBtn from '../../assets/fun_target/orange.png'
import bottomBig from '../../assets/fun_target/bottom_big.png'
import leftBg from '../../assets/fun_target/left.png'
import rightBg from '../../assets/fun_target/right.png'

const LEFT_CHIPS = [
  { value: 1, img: chip1 },
  { value: 5, img: chip5 },
  { value: 10, img: chip10 },
  { value: 50, img: chip50 },
]

const RIGHT_CHIPS = [
  { value: 100, img: chip100 },
  { value: 500, img: chip500 },
  { value: 1000, img: chip1000 },
  { value: 5000, img: chip5000 },
]

const BET_SPOTS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0]

const STATIC_FUN_TARGET_HISTORY = [
  { no: 1, gameNo: 380929, result: 3, play: '1.00', won: '0.00' },
  { no: 2, gameNo: 380865, result: 1, play: '1.00', won: '0.00' },
  { no: 3, gameNo: 380865, result: 1, play: '1.00', won: '0.00' },
  { no: 4, gameNo: 380865, result: 1, play: '1.00', won: '0.00' },
  { no: 5, gameNo: 380865, result: 1, play: '1.00', won: '0.00' },
  { no: 6, gameNo: 380865, result: 1, play: '1.00', won: '0.00' },
  { no: 7, gameNo: 380865, result: 1, play: '1.00', won: '0.00' },
  { no: 8, gameNo: 380865, result: 1, play: '1.00', won: '0.00' },
  { no: 9, gameNo: 380865, result: 1, play: '1.00', won: '10.00' },
  { no: 10, gameNo: 380865, result: 1, play: '1.00', won: '0.00' },
]

export default function FunTarget() {
  const navigate = useNavigate()
  const { user, userId } = useAuth()
  const { wallet, deductWallet, addWallet, setWallet } = useWalletStore()

  const timerEndRef = useRef(null)
  const [timeLeft, setTimeLeft] = useState(10)
  const [isSpinning, setIsSpinning] = useState(false)
  const [winnerNumber, setWinnerNumber] = useState(0)
  const [last10Data, setLast10Data] = useState([1, 4, 2, 8, 9, 4, 9, 9, 5, 1])
  const [rotation, setRotation] = useState(0)
  const [selectedChip, setSelectedChip] = useState(1)
  const [isSubmittingBet, setIsSubmittingBet] = useState(false)
  const [isBetAccepted, setIsBetAccepted] = useState(false)
  const [isHistoryOpen, setIsHistoryOpen] = useState(false)
  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false)

  const [bets, setBets] = useState({})
  const totalBet = Object.values(bets).reduce((sum, val) => sum + val, 0)

  const isBettingClosed = timeLeft <= 5 || isSpinning || isBetAccepted

  const rotationRef = useRef(0)
  rotationRef.current = rotation

  const isBetAcceptedRef = useRef(false)
  isBetAcceptedRef.current = isBetAccepted

  const spinTimeoutRef = useRef(null)
  console.log(timeLeft)
  const handleBet = (num) => {
    if (isBettingClosed) return
    if (wallet < selectedChip) return

    deductWallet(selectedChip)
    setBets((prev) => ({
      ...prev,
      [num]: (prev[num] || 0) + selectedChip,
    }))
  }

  const handleCancelBet = () => {
    if (isBettingClosed || isSubmittingBet) return
    if (totalBet > 0) {
      addWallet(totalBet)
    }
    setBets({})
  }

  const handleBetOk = async () => {
    if (isBettingClosed || isSubmittingBet) {
      return
    }

    const formattedBets = BET_SPOTS.filter((num) => (bets[num] || 0) > 0).map((num) => ({
      game_id: Number(num),
      amount: Number(bets[num]),
    }))

    if (formattedBets.length === 0) {
      return
    }

    const activeUserId = String(
      user?.id ||
      userId ||
      localStorage.getItem('user_id') ||
      localStorage.getItem('userId') ||
      '156'
    )

    const payload = {
      user_id: activeUserId,
      bets: formattedBets,
    }

    console.log('Placing Fun Target Bet Payload:', payload)

    try {
      setIsSubmittingBet(true)
      const res = await placeFunTargetBet(payload)
      console.log('Fun Target Bet Response:', res)

      setIsBetAccepted(true)

      if (res?.wallet !== undefined) {
        setWallet(res.wallet)
      } else if (res?.data?.wallet !== undefined) {
        setWallet(res.data.wallet)
      }
    } catch (err) {
      console.error('Failed to place bet:', err)
    } finally {
      setIsSubmittingBet(false)
    }
  }

  const triggerSpin = () => {
    setIsSpinning(true)
    playMoveChakraSound()

    const nextWinner = Math.floor(Math.random() * 10)

    const targetAngle = (360 - nextWinner * 36) % 360
    const spins = 10
    const currentBase = Math.floor(rotationRef.current / 360) * 360
    const nextRotation = currentBase + spins * 360 + targetAngle

    setRotation(nextRotation)

    spinTimeoutRef.current = setTimeout(() => {
      stopMoveChakraSound()
      setIsSpinning(false)
      setWinnerNumber(nextWinner)
      setLast10Data((prev) => [nextWinner, ...prev.slice(0, 9)])

      setBets((currentBets) => {
        const unconfirmedTotal = Object.values(currentBets).reduce((sum, v) => sum + v, 0)
        if (!isBetAcceptedRef.current && unconfirmedTotal > 0) {
          addWallet(unconfirmedTotal)
        }
        return {}
      })

      setIsBetAccepted(false)
      timerEndRef.current = Date.now() + 10000
      setTimeLeft(10)
    }, 10000)
  }

 useEffect(() => {
  if (isSpinning) return

  if (!timerEndRef.current) {
    timerEndRef.current = Date.now() + 10000
  }

  const timer = setInterval(() => {
    const remaining = Math.max(
      0,
      Math.ceil((timerEndRef.current - Date.now()) / 1000)
    )

    setTimeLeft(remaining)

    if (remaining <= 0) {
      clearInterval(timer)
      timerEndRef.current = null
      triggerSpin()
    }
  }, 250)

  return () => {
    clearInterval(timer)
  }
}, [isSpinning])

  useEffect(() => {
    playGameTapSound()
    return () => {
      stopMoveChakraSound()
      if (spinTimeoutRef.current) clearTimeout(spinTimeoutRef.current)
    }
  }, [])

  return (
    <div className="game-viewport select-none font-sans">
      <div className="game-stage">
        <img
          src={homeBgFun}
          alt="Fun Target Background"
          className="pointer-events-none absolute inset-0 z-0 h-full w-full object-fill"
        />

        <div className="absolute left-[9px] top-[15px] z-30 flex flex-col gap-10">
          <div className="flex flex-col items-center">
            <img
              src={scoreWord}
              alt="Score"
              className="h-[30px] w-auto object-contain drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]"
            />
            <div className="relative mt-1 flex h-[60px] w-[380px] items-center justify-center">
              <img
                src={rectangleFun}
                alt="Score Frame"
                className="pointer-events-none absolute inset-0 h-full w-full object-fill"
              />
              <span className="relative z-10 text-[26px] font-black tracking-wider text-black drop-shadow-[0_1px_1px_rgba(255,255,255,0.7)]">
                {wallet ? Number(wallet).toFixed(2) : '0.00'}
              </span>
            </div>
          </div>

          <div className="flex flex-col items-center">
            <img
              src={timeWord}
              alt="Time"
              className="h-[36px] w-auto object-contain drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]"
            />
            <div className="relative mt-1 flex h-[72px] w-[300px] items-center justify-center rounded-2xl">
              <img
                src={rectangleFun}
                alt="Time Frame"
                className="pointer-events-none absolute inset-0 h-full w-full object-fill rounded-2xl"
              />
              <span className="relative z-10 text-[26px] font-black tracking-widest text-black drop-shadow-[0_1px_1px_rgba(255,255,255,0.7)]">
                {isSpinning || timeLeft === 0
                  ? 'WAITING'
                  : `00 : ${timeLeft < 10 ? '0' + timeLeft : timeLeft}`}
              </span>
              {timeLeft <= 5 && !isSpinning && timeLeft > 0 && (
                <div className="pointer-events-none absolute inset-0 z-20 rounded-2xl border-[10px] border-[#ffe600] p-1 flash-border" />
              )}
            </div>
          </div>
        </div>

        <div className="absolute left-1/2 top-[8px] z-10 flex -translate-x-1/2 flex-col items-center">
          <div className="relative flex h-[480px] w-[810px] items-center justify-center">
            <div className="pointer-events-none absolute -top-2 left-1/2 z-30 flex -translate-x-1/2 flex-col items-center">
              <img
                src={scorpioImg}
                alt="Scorpio Pointer"
                className="h-[60px] w-[60px] select-none object-contain drop-shadow-[0_2px_6px_rgba(0,0,0,0.85)]"
                style={{
                  imageRendering: '-webkit-optimize-contrast',
                  transform: 'translateZ(0)',
                }}
              />
            </div>

            <div className="relative flex h-[480px] w-[480px] items-center justify-center [transform:scaleX(1.60)]">
              <div
                className="relative flex h-full w-full items-center justify-center will-change-transform"
                style={{
                  transform: `rotate(${rotation}deg)`,
                  transition: isSpinning
                    ? 'transform 10s cubic-bezier(0.15, 0.85, 0.25, 1)'
                    : 'none',
                }}
              >
                <img
                  src={badaChakra}
                  alt="Fun Target Wheel"
                  className="pointer-events-none h-full w-full object-contain"
                />
              </div>
            </div>

            <div className="pointer-events-none absolute left-1/2 top-1/2 z-20 flex h-[170px] w-[275px] -translate-x-1/2 -translate-y-1/2 items-center justify-center [transform:translateZ(0)]">
              <img
                src={mainGif}
                alt="Center Coins"
                className={`absolute inset-0 h-full w-full select-none object-fill will-change-transform ${
                  isSpinning ? 'opacity-100' : 'opacity-0'
                }`}
                style={{ transform: 'translateZ(0)' }}
              />
              <img
                src={staticCoin}
                alt="Center Coins"
                className={`absolute inset-0 h-full w-full select-none object-fill ${
                  isSpinning ? 'opacity-0' : 'opacity-100'
                }`}
                style={{ transform: 'translateZ(0)' }}
              />
            </div>
          </div>
        </div>

        <div className="absolute  top-[400px] z-30 flex h-[57px] w-[390px] items-center justify-between rounded-r-[25px] bg-[#f5c400]/80 px-3.5 shadow-md">
          {LEFT_CHIPS.map((chip) => (
            <button
              key={chip.value}
              type="button"
              onClick={() => setSelectedChip(chip.value)}
              className={`relative z-10 h-[55px] w-[75px] cursor-pointer transition-transform duration-150 ${
                selectedChip === chip.value
                  ? 'scale-115 drop-shadow-[0_0_8px_#ffd700]'
                  : 'hover:scale-105 active:scale-95'
              }`}
            >
              <img
                src={chip.img}
                alt={`Chip ${chip.value}`}
                className="h-full w-full object-fill"
              />
            </button>
          ))}
        </div>

        <div className="absolute right-[0px] top-[400px] z-30 flex h-[57px] w-[340px] items-center justify-between rounded-l-[20px] bg-[#f5c400]/80 px-3.5 shadow-md">
          {RIGHT_CHIPS.map((chip) => (
            <button
              key={chip.value}
              type="button"
              onClick={() => setSelectedChip(chip.value)}
              className={`relative z-10 h-[57px] w-[75px] cursor-pointer transition-transform duration-150 ${
                selectedChip === chip.value
                  ? 'scale-115 drop-shadow-[0_0_8px_#ffd700]'
                  : 'hover:scale-105 active:scale-95'
              }`}
            >
              <img
                src={chip.img}
                alt={`Chip ${chip.value}`}
                className="h-full w-full object-fill"
              />
            </button>
          ))}
        </div>

        <div className="pointer-events-none absolute left-1/2 top-[340px] z-20 flex h-[340px] w-[1930px] -translate-x-1/2 items-center justify-center">
          <img
            src={treasureBoxFun}
            alt="Fun Target Treasure Box Banner"
            className="h-full w-full select-none object-fill drop-shadow-[0_6px_14px_rgba(0,0,0,0.85)]"
          />
        </div>

        <div className="absolute right-[10px] top-[25px] z-30 flex flex-col gap-10">
          <div className="flex flex-col items-center">
            <img
              src={winnerWord}
              alt="Winner"
              className="h-[45px] w-auto object-contain drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]"
            />

            <div className="relative mt-1 flex h-[60px] w-[380px] items-center justify-center">
              <img
                src={rectangleFun}
                alt="Winner Frame"
                className="pointer-events-none absolute inset-0 h-full w-full object-fill"
              />
              <span className="relative z-10 text-[32px] font-black tracking-wider text-black drop-shadow-[0_1px_1px_rgba(255,255,255,0.7)]">
                {winnerNumber}
              </span>
            </div>
          </div>

          <div className="flex flex-col items-center">
            <img
              src={lastDataWord}
              alt="Last 10 Data"
              className="h-[36px] w-auto object-contain drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]"
            />

            <div className="relative mt-1 flex h-[60px] w-[380px] items-center justify-center">
              <img
                src={rectangleFun}
                alt="Last 10 Data Frame"
                className="pointer-events-none absolute inset-0 h-full w-full object-fill"
              />
              <div className="relative z-10 flex w-full items-center justify-between px-10 text-[21px] font-black tracking-widest text-black drop-shadow-[0_1px_1px_rgba(255,255,255,0.7)]">
                {last10Data.map((val, idx) => (
                  <span key={idx}>{val}</span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="absolute left-0 right-0 top-[650px] z-30 flex items-center justify-between ">
          <div className="flex items-center gap-[170px]">
            <div className="relative flex h-[40px] w-[190px] items-center justify-center select-none opacity-95">
              <img
                src={takeBtn}
                alt="Take"
                className="h-full w-full object-fill drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)]"
              />
            </div>

            <button
              type="button"
              onClick={handleCancelBet}
              disabled={isBettingClosed || isSubmittingBet}
              className={`relative flex h-[40px] w-[260px] items-center justify-center transition ${
                isBettingClosed || isSubmittingBet
                  ? 'cursor-not-allowed opacity-60'
                  : 'cursor-pointer hover:brightness-110 active:scale-95'
              }`}
            >
              <img
                src={cancelBetBtn}
                alt="Cancel Bet"
                className="h-full w-full object-fill drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)]"
              />
              <span className="absolute text-[22px] font-black tracking-wider text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
                Cancel Bet
              </span>
            </button>
          </div>

          <div className="flex items-center gap-[150px]">
            <button
              type="button"
              onClick={() => setIsHistoryOpen(true)}
              className="relative flex h-[50px] w-[76px] cursor-pointer items-center justify-center transition hover:scale-110 active:scale-95"
            >
              <img
                src={infoIcon}
                alt="Game Info"
                className="h-full w-full object-fill drop-shadow-[0_2px_6px_rgba(0,0,0,0.8)]"
              />
            </button>

            <button
              type="button"
              onClick={handleBetOk}
              disabled={isBettingClosed || isSubmittingBet}
              className={`relative flex h-[38px] w-[190px] items-center justify-center transition ${
                isBettingClosed || isSubmittingBet
                  ? 'cursor-not-allowed opacity-60'
                  : 'cursor-pointer hover:brightness-110 active:scale-95'
              }`}
            >
              <img
                src={betOkBtn}
                alt="Bet Ok"
                className="h-full w-full object-fill drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)]"
              />
            </button>
          </div>
        </div>

        <div className="absolute left-1/2 top-[730px] z-30 flex w-[1900px] -translate-x-1/2 items-center justify-between ">
          {BET_SPOTS.map((num) => {
            const betAmount = bets[num] || 0
            const hasBet = betAmount > 0

            return (
              <div key={num} className="flex flex-col items-center">
                <div className="relative mb-1 flex h-[40px] w-[142px] items-center justify-center">
                  <img
                    src={scrollBanner}
                    alt="Bet Display"
                    className="pointer-events-none absolute inset-0 h-full w-full object-fill drop-shadow-sm"
                  />

                  {hasBet && (
                    <span className="relative z-10 text-[20px] font-black text-black drop-shadow-[0_1px_1px_rgba(255,255,255,0.6)]">
                      {betAmount}
                    </span>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => handleBet(num)}
                  disabled={isBettingClosed}
                  className={`group relative flex h-[76px] w-[112px] items-center justify-center transition-transform ${
                    isBettingClosed
                      ? 'cursor-not-allowed'
                      : 'cursor-pointer hover:scale-105 active:scale-95'
                  }`}
                >
                  <img
                    src={hasBet ? greenBtn : orangeBtn}
                    alt={`Bet Spot ${num}`}
                    className="pointer-events-none h-full w-full object-contain drop-shadow-[0_4px_8px_rgba(0,0,0,0.85)]"
                  />
                  <span className="absolute text-[34px] font-black text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.95)]">
                    {num}
                  </span>
                </button>
              </div>
            )
          })}
        </div>

        <div className="absolute bottom-[0px] left-0 right-0 z-30 flex items-center justify-between ">
          <div className="relative flex h-[42px] w-[185px] items-center justify-center select-none">
            <img
              src={leftBg}
              alt="Total Bet Frame"
              className="h-full w-full object-fill drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)]"
            />
            <span className="absolute z-10 text-[24px] font-black tracking-wider text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
              {totalBet}
            </span>
          </div>

          <div className="relative flex h-[60px] w-[1140px] items-center justify-center">
            <img
              src={bottomBig}
              alt="Message Bar"
              className="pointer-events-none h-full w-full object-fill drop-shadow-md"
            />
            <span className="absolute text-[23px] font-black tracking-wider text-black">
              {isBetAccepted
                ? 'Bets Accepted Successfully'
                : timeLeft <= 5 || isSpinning
                ? 'Bets Time is Over'
                : 'Please Bet to Start Game . Minimum Bet=5'}
            </span>
          </div>

          <button
            type="button"
            onClick={() => setIsLeaveModalOpen(true)}
            className="relative flex h-[42px] w-[185px] cursor-pointer items-center justify-center transition hover:brightness-110 active:scale-95"
          >
            <img
              src={rightBg}
              alt="Exit Frame"
              className="h-full w-full object-fill drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)]"
            />
            <span className="absolute z-10 text-[22px] font-black tracking-wider text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
              Exit
            </span>
          </button>
        </div>

        <GameHistoryPopup
          isOpen={isHistoryOpen}
          onClose={() => setIsHistoryOpen(false)}
          title="FUN TARGET.GAME HISTORY"
          gameName="FUN TARGET"
          resultLabel="Card / Result"
          userName={user?.username || localStorage.getItem('username') || 'PRADEEP'}
          balance={wallet || 0}
          historyData={STATIC_FUN_TARGET_HISTORY}
        />

        <ConfirmDialog
          isOpen={isLeaveModalOpen}
          onClose={() => setIsLeaveModalOpen(false)}
          onConfirm={() => {
            stopMoveChakraSound()
            setIsLeaveModalOpen(false)
            if (!isBetAccepted && totalBet > 0) {
              addWallet(totalBet)
            }
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
