import React, { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { useWalletStore } from '../../store/useWalletStore'
import toast from 'react-hot-toast'
import { placeFunTargetBet, getFunTargetLastResult, getFunTargetWinAmount, takeAmount } from '../../services/funtarget.service'
import { getUserProfile } from '../../services/auth.service'
import socket from '../../services/socket.service'
import GameHistoryPopup from '../../components/common/GameHistoryPopup'
import ConfirmDialog from '../../components/common/ConfirmDialog'
import { playGameTapSound, playMoveChakraSound, stopMoveChakraSound, playPlaceChipSound, playCoinSplashSound } from '../../utils/sound'

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
import { speak } from '../../utils/audio'
import { BET_SPOTS, LEFT_CHIPS, RIGHT_CHIPS, STATIC_FUN_TARGET_HISTORY } from '../../constants/funTargetData'



export default function FunTarget() {
  const navigate = useNavigate()
  const { user, userId, userProfile } = useAuth()
  const { wallet, deductWallet, addWallet, setWallet } = useWalletStore()

  const [timeLeft, setTimeLeft] = useState(0)
  const [timerStatus, setTimerStatus] = useState(1)
  const previousTimerStatusRef = useRef(null)
  const [isSpinning, setIsSpinning] = useState(false)
  const [winnerNumber, setWinnerNumber] = useState(0)
  const [isTaking, setIsTaking] = useState(false)
  const [last10Data, setLast10Data] = useState([1, 4, 2, 8, 9, 4, 9, 9, 5, 1])
  const [rotation, setRotation] = useState(0)
  const [selectedChip, setSelectedChip] = useState(1)
  const [isSubmittingBet, setIsSubmittingBet] = useState(false)
  const [isBetAccepted, setIsBetAccepted] = useState(false)
  const [isHistoryOpen, setIsHistoryOpen] = useState(false)
  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false)

  const [bets, setBets] = useState({})
  const totalBet = Object.values(bets).reduce((sum, val) => sum + val, 0)

  const isBettingClosed = timerStatus === 2 || timeLeft <= 5 || isSpinning || isBetAccepted

  const rotationRef = useRef(0)
  rotationRef.current = rotation

  const isBetAcceptedRef = useRef(false)
  isBetAcceptedRef.current = isBetAccepted

  const autoBetSubmittedRef = useRef(false)
  const handleBetOkRef = useRef(null)
  const betsRef = useRef({})
  betsRef.current = bets
  const isSubmittingBetRef = useRef(false)
  isSubmittingBetRef.current = isSubmittingBet

  const spinTimeoutRef = useRef(null)
  const pendingLast10Ref = useRef(null)
  const triggerSpinRef = useRef(null)
  const fetchLastResultRef = useRef(null)
  const lastKnownGameNoRef = useRef(null)
  const pendingWinAmountRef = useRef(0)
  const handleBet = (num) => {
    if (isBettingClosed) return
    if (wallet < selectedChip) return

    deductWallet(selectedChip)
    playPlaceChipSound()
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
    const currentBets = betsRef.current || bets
    const currentlyAccepted = isBetAcceptedRef.current || isBetAccepted
    const currentlySubmitting = isSubmittingBetRef.current || isSubmittingBet

    if (currentlyAccepted || currentlySubmitting || timerStatus === 2 || isSpinning) {
      return
    }

    const formattedBets = BET_SPOTS.filter((num) => (currentBets[num] || 0) > 0).map((num) => ({
      game_id: Number(num),
      amount: Number(currentBets[num]),
    }))

    if (formattedBets.length === 0) {
      return
    }

    const activeGameNo = lastKnownGameNoRef.current

    if (!activeGameNo) {
      toast.error('Game number is required')
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
      games_no: String(activeGameNo),
      bets: formattedBets,
    }

    console.log('Placing Fun Target Bet Payload:', payload)

    try {
      setIsSubmittingBet(true)
      isSubmittingBetRef.current = true
      const res = await placeFunTargetBet(payload)
      console.log('Fun Target Bet Response:', res)

      if (res?.success === false) {
        toast.error(res?.message || 'Failed to place bet')
        return
      }

      setIsBetAccepted(true)
      isBetAcceptedRef.current = true
      speak('Bets Accepted Successfully')

      if (res?.wallet !== undefined) {
        setWallet(res.wallet)
      } else if (res?.data?.wallet !== undefined) {
        setWallet(res.data.wallet)
      }
    } catch (err) {
      console.error('Failed to place bet:', err)
      toast.error('Failed to place bet')
    } finally {
      setIsSubmittingBet(false)
      isSubmittingBetRef.current = false
    }
  }

  useEffect(() => {
    handleBetOkRef.current = handleBetOk
  })

  const handleTake = async () => {
    if (isTaking || isSpinning) return

    const activeUserId = String(
      user?.id ||
      userId ||
      localStorage.getItem('user_id') ||
      localStorage.getItem('userId') ||
      '156'
    )
    const currentWin = Number(winnerNumber || 0)

    setIsTaking(true)
    try {
      const res = await takeAmount({
        user_id: activeUserId,
        amount: currentWin,
      })
      console.log('takeamount response:', res)

      setWinnerNumber(0)
      playCoinSplashSound()

      let profileUpdated = false
      try {
        if (userProfile) {
          const profRes = await userProfile(activeUserId)
          if (profRes?.data?.wallet != null) {
            setWallet(profRes.data.wallet)
            profileUpdated = true
          }
        } else {
          const profRes = await getUserProfile(activeUserId)
          if (profRes?.data?.wallet != null) {
            setWallet(profRes.data.wallet)
            profileUpdated = true
          }
        }
      } catch (profErr) {
        console.error('Failed to update profile after take:', profErr)
      }

      if (!profileUpdated && currentWin > 0) {
        addWallet(currentWin)
      }
    } catch (err) {
      console.error('takeamount error:', err)
      setWinnerNumber(0)
      try {
        if (userProfile) {
          await userProfile(activeUserId)
        }
      } catch (profErr) {
        console.error(profErr)
      }
      if (currentWin > 0) {
        addWallet(currentWin)
      }
    } finally {
      setIsTaking(false)
    }
  }

  const fetchLastResult = useCallback(async (updateUI = true) => {
    const activeUserId = user?.id || userId || localStorage.getItem('user_id')
    if (!activeUserId) return null

    try {
      const res = await getFunTargetLastResult(activeUserId)
      const resultData = Array.isArray(res?.data) ? res.data : (Array.isArray(res) ? res : [])

      if (Array.isArray(resultData) && resultData.length > 0) {
        const lastNo = Number(res?.last_game_no || resultData[0]?.games_no || resultData[0]?.game_no)
        if (Number.isFinite(lastNo) && lastNo > 0) {
          lastKnownGameNoRef.current = String(lastNo + 1)
        }

        if (updateUI && res?.last_win_amount !== undefined && res?.last_win_amount !== null) {
          const initWin = Number(res.last_win_amount)
          setWinnerNumber(initWin)
          pendingWinAmountRef.current = initWin
        }

        // Data me sbse pehla item latest round ka result hai
        const numbers = resultData
          .slice(0, 10)
          .map((item) => (typeof item === 'object' && item !== null ? Number(item.number) : Number(item)))
          .reverse()

        if (updateUI) {
          if (numbers.length > 0) {
            setLast10Data(numbers)
          }
        } else {
          pendingLast10Ref.current = numbers
        }

        return { res, resultData }
      }
    } catch (error) {
      console.error('Failed to fetch fun target last result:', error)
    }
    return null
  }, [user?.id, userId])

  useEffect(() => {
    fetchLastResult(true)
  }, [fetchLastResult])

  useEffect(() => {
    fetchLastResultRef.current = fetchLastResult
  }, [fetchLastResult])

  const triggerSpin = useCallback((winningNum = null) => {
    setIsSpinning(true)
    playMoveChakraSound()

    const nextWinner =
      winningNum !== null && winningNum !== undefined && Number.isFinite(Number(winningNum))
        ? Number(winningNum)
        : Math.floor(Math.random() * 10)

    const targetAngle = (360 - nextWinner * 36) % 360
    const spins = 28
    const currentBase = Math.floor(rotationRef.current / 360) * 360
    const nextRotation = currentBase + spins * 360 + targetAngle

    setRotation(nextRotation)

    spinTimeoutRef.current = setTimeout(() => {
      stopMoveChakraSound()
      setIsSpinning(false)
      const winAmount = Number(pendingWinAmountRef.current ?? 0)
      setWinnerNumber(winAmount)
      pendingWinAmountRef.current = 0
      speak(`Winning number is ${nextWinner}`)

      if (pendingLast10Ref.current && pendingLast10Ref.current.length > 0) {
        setLast10Data(pendingLast10Ref.current)
        pendingLast10Ref.current = null
      } else {
        setLast10Data((prev) => [...prev.slice(1), nextWinner])
      }

      setBets((currentBets) => {
        const unconfirmedTotal = Object.values(currentBets).reduce((sum, v) => sum + v, 0)
        if (!isBetAcceptedRef.current && unconfirmedTotal > 0) {
          addWallet(unconfirmedTotal)
        }
        return {}
      })

      setIsBetAccepted(false)
      isBetAcceptedRef.current = false
      autoBetSubmittedRef.current = false
    }, 11000)
  }, [])

  useEffect(() => {
    triggerSpinRef.current = triggerSpin
  }, [triggerSpin])

  useEffect(() => {
    const handleTimer = (data) => {
      let parsedData = data

      if (typeof data === 'string') {
        try {
          parsedData = JSON.parse(data)
        } catch (error) {
          console.error('Socket timer parse error:', error)
          return
        }
      }

      if (!parsedData) return

      const { timerBetTime, timerStatus: incomingStatus } = parsedData
      const timerStatusVal = incomingStatus !== undefined ? incomingStatus : parsedData?.timer_status

      if (timerStatusVal === undefined) return

      const status = Number(timerStatusVal)
      const previousStatus = previousTimerStatusRef.current

      setTimerStatus(status)

      // Timer har second update hoga
      if (timerBetTime !== undefined) {
        const timeVal = Number(timerBetTime)
        setTimeLeft(timeVal)

        // Agar timer 10 aur timerstatus 1 ho, aur bets pehle se manually confirm na hui ho, to auto-confirm chalega
        if (status === 1 && timeVal <= 10 && !autoBetSubmittedRef.current) {
          const currentBets = betsRef.current || bets
          const hasBets = Object.values(currentBets).some((amount) => Number(amount) > 0)
          if (hasBets && !isBetAcceptedRef.current) {
            autoBetSubmittedRef.current = true
            handleBetOkRef.current?.()
          }
        }
      }

      // Sirf status change hone par actions chalenge
      if (status !== previousStatus) {
        previousTimerStatusRef.current = status

        if (status === 2) {
          (async () => {
            let winNumber = null
            try {
              const responseData = await fetchLastResultRef.current?.(false)
              const list = responseData?.resultData || (Array.isArray(responseData) ? responseData : [])
              const rawRes = responseData?.res

              // Sbse pehle aane wala item (index 0) win number hai
              if (rawRes?.win_number !== undefined && rawRes?.win_number !== null) {
                winNumber = Number(rawRes.win_number)
              } else if (Array.isArray(list) && list.length > 0) {
                const firstItem = list[0]
                if (firstItem && (firstItem.number !== undefined || typeof firstItem === 'number')) {
                  winNumber = Number(firstItem.number !== undefined ? firstItem.number : firstItem)
                }
              }

              // Result API ke just baad fun_win_amount API call hogi
              const activeUserId = user?.id || userId || localStorage.getItem('user_id') || '156'
              const winRes = await getFunTargetWinAmount(activeUserId)
              const winAmount = Number(winRes?.win_amount ?? winRes?.last_win_amount ?? 0)
              pendingWinAmountRef.current = winAmount
            } catch (err) {
              console.error('Error fetching fun last result / win amount:', err)
            }
            triggerSpinRef.current?.(winNumber)
          })()
        }

        if (status === 1) {
          autoBetSubmittedRef.current = false
          setIsSpinning(false)
          setIsBetAccepted(false)
          isBetAcceptedRef.current = false
          setBets({})
        }
      }
    }

    socket.on('ncr_green36', handleTimer)

    return () => {
      socket.off('ncr_green36', handleTimer)
    }
  }, [])

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
                {timerStatus === 2 || timeLeft === 0 || isSpinning
                  ? 'WAITING'
                  : `00 : ${timeLeft < 10 ? '0' + timeLeft : timeLeft}`}
              </span>
              {timeLeft <= 5 && !isSpinning && timeLeft > 0 && timerStatus === 1 && (
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
                className={`absolute inset-0 h-full w-full select-none object-fill will-change-transform ${isSpinning ? 'opacity-100' : 'opacity-0'
                  }`}
                style={{ transform: 'translateZ(0)' }}
              />
              <img
                src={staticCoin}
                alt="Center Coins"
                className={`absolute inset-0 h-full w-full select-none object-fill ${isSpinning ? 'opacity-0' : 'opacity-100'
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
              className={`relative z-10 h-[55px] w-[75px] cursor-pointer transition-transform duration-150 ${selectedChip === chip.value
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
              className={`relative z-10 h-[57px] w-[75px] cursor-pointer transition-transform duration-150 ${selectedChip === chip.value
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
            <button
              type="button"
              onClick={handleTake}
              disabled={isTaking || isSpinning}
              className={`relative flex h-[40px] w-[190px] items-center justify-center select-none transition ${
                winnerNumber > 0 && !isSpinning
                  ? 'cursor-pointer hover:scale-105 active:scale-95 drop-shadow-[0_0_12px_rgba(255,215,0,0.85)] animate-pulse'
                  : 'cursor-pointer hover:brightness-110 active:scale-95'
              } ${isTaking ? 'opacity-60 pointer-events-none' : ''}`}
            >
              <img
                src={takeBtn}
                alt="Take"
                className="h-full w-full object-fill drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)]"
              />
            </button>

            <button
              type="button"
              onClick={handleCancelBet}
              disabled={isBettingClosed || isSubmittingBet}
              className={`relative flex h-[40px] w-[260px] items-center justify-center transition ${isBettingClosed || isSubmittingBet
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
              className={`relative flex h-[38px] w-[190px] items-center justify-center transition ${isBettingClosed || isSubmittingBet
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
                  className={`group relative flex h-[76px] w-[112px] items-center justify-center transition-transform ${isBettingClosed
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
