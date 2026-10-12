import React, { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'

import rouletteMiniBg from '../../assets/timer_36/roulettemini1.png'
// import rouletteMiniBg from '../../assets/timer_36/blue_36_bg.png'

import { useAuth } from '../../hooks/useAuth'
import { useWalletStore } from '../../store/useWalletStore'
import toast from 'react-hot-toast'

import {
  playPlaceChipSound,
  playGameTapSound,
  playBlueWheelSound,
  stopBlueWheelSound,
  playCoinSplashSound,
} from '../../utils/sound'

import { getGameId, createBetPayload } from '../../utils/helper'

import {
  CHIPS,
  PlacedChip,
  getNumberCoordinates,
  OUTSIDE_BETS,
  SPLIT_BETS,
  CORNER_BETS,
  STREET_BETS,
  LINE_BETS,
  BET_WIDTH,
  BET_HEIGHT,
  MULTI_BET_WIDTH,
  MULTI_BET_HEIGHT,
  BET_TRANSFORM,
} from '../../components/ui/roulette-mini-timer/grid'

import GameRulesPopup from '../../components/ui/roulette-mini-timer/GameRulesPopup'
import GameHistoryPopup from '../../components/ui/roulette-mini-timer/GameHistoryPopup'
import NeighbourPopup from '../../components/ui/roulette-mini-timer/NeighbourPopup'
import ConfirmDialog from '../../components/common/ConfirmDialog'

import wheelImg from '../../assets/timer_36/wheel.png'
import thudiImg from '../../assets/timer_36/thudi.png'
import watch40Img from '../../assets/timer_36/watch_40.png'
import waitToComplete from '../../assets/timer_36/wait_to_complete.png'
import betAcceptedImg from '../../assets/timer_36/bet_accepted.png'
import pleaseSelectChipsImg from '../../assets/timer_36/please_select_chips.png'
import greaterThan10Rs from '../../assets/timer_36/gr_than_10.png'
import lastCallImg from '../../assets/timer_36/last_call.png'
import buttonBg from '../../assets/timer_36/button_bg.png'
import removeBtn from "../../assets/timer_36/remove.png"
import doubleBtn from "../../assets/timer_36/double.png"
import clearBetBtn from "../../assets/timer_36/clear_bet.png"
import repeatBtn from "../../assets/timer_36/repeat.png"
import gameHistoryBtn from "../../assets/timer_36/game_history.png"
import neighbourBtn from "../../assets/timer_36/neighbour.png"
import leaveTableBtn from "../../assets/timer_36/leave_table.png"
import rulesBtn from "../../assets/timer_36/rules_btn.png"
import betConBtn from "../../assets/bet_con_btn.png"
import betAccBtn from "../../assets/bet_acc_btn.png"
import showResultImg from "../../assets/timer_36/show_result.png"

import image8 from "../../assets/timer_36/2.png"
import image7 from "../../assets/timer_36/5.png"
import image6 from "../../assets/timer_36/ten.png"
import image5 from "../../assets/timer_36/50.png"
import image4 from "../../assets/timer_36/100.png"
import image3 from "../../assets/timer_36/500.png"
import image2 from "../../assets/timer_36/one_k.png"
import image1 from "../../assets/timer_36/three_k.png"

import { speak } from '../../utils/audio'

import {
  ITEMS,
  MIN_10_BET_SPOTS,
  ROULETTE_ORDER,
  STYLE,
} from '../../constants/rouletteTimeData.js'
import { getLastResult, getBlue36BetHistory, placeBlue36Bet, getBlue36WinAmount } from '../../services/blue36.service.js'
import socket from '../../services/socket.service.js'



const imageItems = [
  image1,
  image2,
  image3,
  image4,
  image5,
  image6,
  image7,
  image8,
]

const RED_NUMS = [
  1,
  3,
  5,
  7,
  9,
  12,
  14,
  16,
  18,
  19,
  21,
  23,
  25,
  27,
  30,
  32,
  34,
  36,
]

const BLACK_NUMS = [
  2,
  4,
  6,
  8,
  10,
  11,
  13,
  15,
  17,
  20,
  22,
  24,
  26,
  28,
  29,
  31,
  33,
  35,
]

const NUMBERS = Array.from({ length: 37 }, (_, i) => i)

const getWheelAngle = (num) => {
  const idx = ROULETTE_ORDER.indexOf(Number(num))

  if (idx === -1) {
    return 0
  }

  return -idx * (360 / 37)
}

const getWinningPayout = (winner, currentBets) => {
  let payout = 0

  const add = (key, multiplier) => {
    if (currentBets[key]) {
      payout += currentBets[key] * multiplier
    }
  }

  // Straight number
  if (currentBets[String(winner)]) {
    add(String(winner), 36)
  }

  // Red / Black
  if (RED_NUMS.includes(winner)) {
    add('red', 2)
  }

  if (BLACK_NUMS.includes(winner)) {
    add('black', 2)
  }

  // Even / Odd
  if (winner > 0 && winner % 2 === 0) {
    add('even', 2)
  }

  if (winner > 0 && winner % 2 === 1) {
    add('odd', 2)
  }

  // 1-18 / 19-36
  if (winner >= 1 && winner <= 18) {
    if (currentBets['1-18']) {
      add('1-18', 2)
    } else {
      add('1_18', 2)
    }
  }

  if (winner >= 19 && winner <= 36) {
    if (currentBets['19-36']) {
      add('19-36', 2)
    } else {
      add('19_36', 2)
    }
  }

  // Dozens
  if (winner >= 1 && winner <= 12) {
    if (currentBets['1st12']) {
      add('1st12', 3)
    } else {
      add('1ST12', 3)
    }
  }

  if (winner >= 13 && winner <= 24) {
    if (currentBets['2nd12']) {
      add('2nd12', 3)
    } else {
      add('2ND12', 3)
    }
  }

  if (winner >= 25 && winner <= 36) {
    if (currentBets['3rd12']) {
      add('3rd12', 3)
    } else {
      add('3RD12', 3)
    }
  }

  // Columns
  if (winner > 0 && winner % 3 === 1) {
    if (currentBets['col-0']) {
      add('col-0', 3)
    } else {
      add('ROW_1', 3)
    }
  }

  if (winner > 0 && winner % 3 === 2) {
    if (currentBets['col-1']) {
      add('col-1', 3)
    } else {
      add('ROW_2', 3)
    }
  }

  if (winner > 0 && winner % 3 === 0) {
    if (currentBets['col-2']) {
      add('col-2', 3)
    } else {
      add('ROW_3', 3)
    }
  }

  // Split / Street / Corner / Line bets
  Object.entries(currentBets).forEach(([key, amount]) => {
    if (!key.includes('-')) {
      return
    }

    if (
      key === '1-18' ||
      key === '19-36'
    ) {
      return
    }

    const numbers = key
      .split('-')
      .map((value) => Number(value))
      .filter((value) => Number.isInteger(value))

    if (numbers.length === 2 && numbers.includes(winner)) {
      payout += amount * 18
    }

    if (numbers.length === 3 && numbers.includes(winner)) {
      payout += amount * 12
    }

    if (numbers.length === 4 && numbers.includes(winner)) {
      payout += amount * 9
    }

    if (numbers.length === 6 && numbers.includes(winner)) {
      payout += amount * 6
    }
  })

  return payout
}

function RouletteMiniTimer() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { wallet, deductWallet, addWallet } = useWalletStore()
  const [selectedChip, setSelectedChip] = useState(null)

  const [timeLeft, setTimeLeft] = useState(null);
  const [timerStatus, setTimerStatus] = useState(1);
  const [showClock, setShowClock] = useState(true);

  const previousTimerStatusRef = useRef(null);
  const [isSpinning, setIsSpinning] = useState(false)
  const [winningNumber, setWinningNumber] = useState(0)
  const [boxWheelAngle, setBoxWheelAngle] = useState(0)
  const [bigWheelAngle, setBigWheelAngle] = useState(0)
  const [ballAngle, setBallAngle] = useState(0)
  const pendingWinnerRef = useRef(0)
  const winnerBadgeTimeoutRef = useRef(null)
  const spinTimeoutRef = useRef(null)
  const waitTimeoutRef = useRef(null)
  const selectChipsTimeoutRef = useRef(null)
  const greaterThan10TimeoutRef = useRef(null)
  const betAcceptedTimeoutRef = useRef(null)
  const [showResultMarker, setShowResultMarker] = useState(false)
  const [youWon, setYouWon] = useState(0)
  const [historyList, setHistoryList] = useState([])
  const [gameHistoryData, setGameHistoryData] = useState([])
  const [bets, setBets] = useState({})
  const [betChips, setBetChips] = useState({})
  const [betHistory, setBetHistory] = useState([])
  const [previousBets, setPreviousBets] = useState(null)
  const [previousBetChips, setPreviousBetChips] = useState({})
  const [previousBetHistory, setPreviousBetHistory] = useState([])
  const lastRoundBetsRef = useRef({ bets: {}, betChips: {}, betHistory: [] })
  const activeBetsRef = useRef({ bets: {}, betChips: {}, betHistory: [] })
  const [isBetConfirmed, setIsBetConfirmed] = useState(false)
  const [showBetAccepted, setShowBetAccepted] = useState(false)
  const [showPleaseSelectChips, setShowPleaseSelectChips] = useState(false)
  const [showGreaterThan10, setShowGreaterThan10] = useState(false)
  const [showWaitToComplete, setShowWaitToComplete] = useState(false)
  const [isRulesOpen, setIsRulesOpen] = useState(false)
  const [isHistoryOpen, setIsHistoryOpen] = useState(false)
  const [isNeighbourOpen, setIsNeighbourOpen] = useState(false)
  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false)
  const [isSubmittingBet, setIsSubmittingBet] = useState(false)
  const lastKnownGameNoRef = useRef(null)
  const pendingHistoryListRef = useRef(null)
  const pendingWinAmountRef = useRef(null)
  const betHistoryRef = useRef([])
  const isBetConfirmedRef = useRef(false)
  const isSubmittingBetRef = useRef(false)
  const autoBetSubmittedRef = useRef(false)
  const handleBetConfirmRef = useRef(null)
  const totalBet = Object.values(bets).reduce(
    (sum, value) => sum + value,
    0,
  )

  const hasPreviousBets = Boolean(
    (previousBets && Object.keys(previousBets).length > 0) ||
    (lastRoundBetsRef.current?.bets && Object.keys(lastRoundBetsRef.current.bets).length > 0)
  )

  const fetchLastResult = useCallback(async (updateUI = true) => {
    if (!user?.id) return null;

    try {
      const res = await getLastResult(user.id);
      const resultData = res?.data || res;

      if (Array.isArray(resultData)) {
        if (resultData.length > 0) {
          const lastItem = resultData[resultData.length - 1];
          const lastNo = Number(lastItem?.games_no || lastItem?.game_no);
          if (Number.isFinite(lastNo) && lastNo > 0) {
            lastKnownGameNoRef.current = String(lastNo + 1);
          }
        }

        const formattedHistory = resultData.map((item) => {
          const number = Number(item.number);

          let side = "l";

          if (number === 0) {
            side = "m";
          } else if (RED_NUMS.includes(number)) {
            side = "r";
          }

          return [number, side];
        });

        if (updateUI) {
          setHistoryList(formattedHistory);
        } else {
          pendingHistoryListRef.current = formattedHistory;
        }
        return resultData;
      }
    } catch (error) {
      console.error("Last result API error:", error);
    }
    return null;
  }, [user?.id]);

  useEffect(() => {
    fetchLastResult();
  }, [fetchLastResult]);

  const isSpinningRef = useRef(isSpinning);
  useEffect(() => {
    isSpinningRef.current = isSpinning;
  }, [isSpinning]);

  const fetchWinAmount = useCallback(async () => {
    if (!user?.id) return;
    try {
      const res = await getBlue36WinAmount(user.id);
      console.log("blue_36_win_amount response (pre-fetched):", res);
      if (res?.success && res.win_amount !== undefined && res.win_amount !== null) {
        const wonAmount = Number(res.win_amount);
        pendingWinAmountRef.current = wonAmount;
        // Agar wheel ruk chuka hai toh You Won turant update ho jaye
        if (!isSpinningRef.current) {
          setYouWon(wonAmount);
        }
      }
    } catch (err) {
      console.error("Failed to fetch blue_36 win amount:", err);
    }
  }, [user?.id]);

  const fetchWinAmountRef = useRef(fetchWinAmount);
  useEffect(() => {
    fetchWinAmountRef.current = fetchWinAmount;
  }, [fetchWinAmount]);

  const fetchBetHistory = useCallback(async () => {
    if (!user?.id) return;
    try {
      const res = await getBlue36BetHistory(user.id, 5);
      console.log("blue_36_bet_history response:", res);
      if (res?.success && Array.isArray(res?.data)) {
        setGameHistoryData(res.data);
      }
    } catch (err) {
      console.error("Failed to fetch blue_36 bet history:", err);
    }
  }, [user?.id]);

  const startWheelSpin = useCallback(
    (targetWinner) => {
      // 1. Current active bets save for payout calculation & repeat
      const currentActiveBets =
        Object.keys(bets).length > 0 ? bets : activeBetsRef.current.bets;
      const currentActiveChips =
        Object.keys(betChips).length > 0 ? betChips : activeBetsRef.current.betChips;
      const currentActiveHistory =
        betHistory.length > 0 ? betHistory : activeBetsRef.current.betHistory;

      if (Object.keys(currentActiveBets).length > 0) {
        lastRoundBetsRef.current = {
          bets: { ...currentActiveBets },
          betChips: { ...currentActiveChips },
          betHistory: [...currentActiveHistory],
        };
        setPreviousBets(currentActiveBets);
        setPreviousBetChips(currentActiveChips);
        setPreviousBetHistory(currentActiveHistory);
      }

      // 2. Bets clear ho jayngi
      setBets({});
      setBetChips({});
      setBetHistory([]);
      setIsBetConfirmed(false);
      setShowBetAccepted(false);
      setSelectedChip(null);
      setYouWon(0);
      pendingWinAmountRef.current = null;

      // 3. Clock hide & messages clear
      setShowClock(false);
      setShowWaitToComplete(false);
      setShowPleaseSelectChips(false);
      setShowGreaterThan10(false);
      setShowResultMarker(false);

      // 4. Wheel spin krega
      playBlueWheelSound();
      setIsSpinning(true);

      const nextWinner =
        targetWinner !== undefined && targetWinner !== null
          ? Number(targetWinner)
          : Math.floor(Math.random() * 37);

      pendingWinnerRef.current = nextWinner;

      const baseAngle = getWheelAngle(nextWinner);

      setBoxWheelAngle((prev) => {
        let diff = (baseAngle - (prev % 360)) % 360;
        if (diff <= 0) {
          diff += 360;
        }
        return prev + 360 * 8 + diff;
      });

      setBigWheelAngle((prev) => {
        let diff = (baseAngle - (prev % 360)) % 360;
        if (diff <= 0) {
          diff += 360;
        }
        return prev + 360 * 8 + diff;
      });

      setBallAngle((prev) => {
        const currentMod = ((prev % 360) + 360) % 360;
        return prev - currentMod - 360 * 7;
      });

      if (spinTimeoutRef.current) {
        clearTimeout(spinTimeoutRef.current);
      }

      spinTimeoutRef.current = setTimeout(() => {
        // 1. Winning number set & announce
        stopBlueWheelSound();
        setIsSpinning(false);
        setWinningNumber(nextWinner);
        setShowResultMarker(true);
        speak(`Win number is ${nextWinner}`);

        // 2. UI history list update
        if (pendingHistoryListRef.current) {
          setHistoryList(pendingHistoryListRef.current);
          pendingHistoryListRef.current = null;
        }

        // 3. You won aur wallet win number & history ke sath ek hi time par update honge
        const roundBets = lastRoundBetsRef.current?.bets || {};
        const localPayout = getWinningPayout(nextWinner, roundBets);
        const finalWinAmount =
          pendingWinAmountRef.current !== null && pendingWinAmountRef.current !== undefined
            ? pendingWinAmountRef.current
            : localPayout;

        setYouWon(finalWinAmount);
        if (finalWinAmount > 0) {
          addWallet(finalWinAmount);
        }
        pendingWinAmountRef.current = null;
      }, 8500);
    },
    [bets, betChips, betHistory, addWallet]
  );

  const startWheelSpinRef = useRef(startWheelSpin);
  useEffect(() => {
    startWheelSpinRef.current = startWheelSpin;
  }, [startWheelSpin]);

  const fetchLastResultRef = useRef(fetchLastResult);
  useEffect(() => {
    fetchLastResultRef.current = fetchLastResult;
  }, [fetchLastResult]);

  // Default me bdi wali wheel dheere dheere spin hoti rahegi
  useEffect(() => {
    if (isSpinning) return;

    let animationFrameId;
    let lastTime = performance.now();

    const animate = (currentTime) => {
      const delta = Math.min(currentTime - lastTime, 100);
      lastTime = currentTime;

      const speed = 0.015; // ~15 deg/sec (24 seconds per full rotation)
      const step = delta * speed;

      setBigWheelAngle((prev) => prev + step);
      setBallAngle((prev) => prev + step);

      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [isSpinning]);

  useEffect(() => {
    const handleTimer = (data) => {
      let parsedData = data;

      if (typeof data === "string") {
        try {
          parsedData = JSON.parse(data);
        } catch (error) {
          console.error("Socket parse error:", error);
          return;
        }
      }

      if (!parsedData) return;

      const { timerBetTime, timerStatus: incomingStatus } = parsedData;

      if (incomingStatus === undefined) return;

      const currentStatus = Number(incomingStatus);
      const previousStatus = previousTimerStatusRef.current;

      setTimerStatus(currentStatus);

      // Timer update hota rahega
      if (timerBetTime !== undefined) {
        const timeVal = Number(timerBetTime);
        setTimeLeft(timeVal);

        // Timer 10 and timerstatus 1 hone par bets automatic lag jayegi agar pehle se nahi lagi ho to
        if (currentStatus === 1 && timeVal <= 10 && !autoBetSubmittedRef.current) {
          if (betHistoryRef.current?.length > 0 && !isBetConfirmedRef.current) {
            autoBetSubmittedRef.current = true;
            handleBetConfirmRef.current?.(true);
          }
        }
      }

      // Sirf status change hone par action lo
      if (currentStatus !== previousStatus) {
        previousTimerStatusRef.current = currentStatus;
        console.log("Timer status changed:", {
          previousStatus,
          currentStatus,
        });

        if (currentStatus === 2) {
          setShowClock(false);
          (async () => {
            let winNumber = null;
            try {
              // Yahan fetchLastResultRef(false) chalega jisse winNumber milega aur formatted list pendingHistoryListRef me save hogi
              const resultData = await fetchLastResultRef.current?.(false);
              if (Array.isArray(resultData) && resultData.length > 0) {
                const lastItem = resultData[resultData.length - 1];
                if (lastItem && lastItem.number !== undefined) {
                  winNumber = Number(lastItem.number);
                  console.log("Wheel will stop on last history number:", winNumber, lastItem);
                }
              }
            } catch (err) {
              console.error("Error getting win number from last result:", err);
            }
            startWheelSpinRef.current?.(winNumber);
            fetchWinAmountRef.current?.();
          })();
        } else if (currentStatus === 1) {
          autoBetSubmittedRef.current = false;
          setShowClock(true);
          setIsSpinning(false);
          setShowResultMarker(false);
          setShowWaitToComplete(false);
          setShowGreaterThan10(false);
          setShowPleaseSelectChips(false);
          setShowBetAccepted(false);
          setIsBetConfirmed(false);
          isBetConfirmedRef.current = false;
          stopBlueWheelSound();
          if (spinTimeoutRef.current) {
            clearTimeout(spinTimeoutRef.current);
          }

          if (pendingHistoryListRef.current) {
            setHistoryList(pendingHistoryListRef.current);
            pendingHistoryListRef.current = null;
          }
        }
      }
    };

    socket.on(import.meta.env.VITE_MINITIMER_EVENT_NAME, handleTimer);

    return () => {
     socket.off(import.meta.env.VITE_MINITIMER_EVENT_NAME, handleTimer);
    };
  }, []);

  useEffect(() => {
    return () => {
      if (spinTimeoutRef.current) {
        clearTimeout(spinTimeoutRef.current);
      }
      if (winnerBadgeTimeoutRef.current) {
        clearTimeout(winnerBadgeTimeoutRef.current);
      }
      stopBlueWheelSound();
    };
  }, []);

  useEffect(() => {
    activeBetsRef.current = { bets, betChips, betHistory };
  }, [bets, betChips, betHistory]);

  useEffect(() => {
    playGameTapSound();
  }, []);

  useEffect(() => {
    if (timeLeft === 20 && !isSpinning && timerStatus === 1) {
      speak("Last call");
    }
  }, [timeLeft, isSpinning, timerStatus]);

  const showTemporaryMessage = (
    setter,
    ref,
    duration = 2500,
  ) => {
    setter(true)

    if (ref.current) {
      clearTimeout(ref.current)
    }

    ref.current = setTimeout(() => {
      setter(false)
    }, duration)
  }

  const handleSelectChip = (chipVal) => {
    setSelectedChip(chipVal)

    setShowPleaseSelectChips(false)

    if (chipVal >= 10) {
      setShowGreaterThan10(false)
    }

    playPlaceChipSound()
  }

  const handlePlaceBet = (
    spot,
    amount = selectedChip,
  ) => {
    if (!selectedChip || !amount) {
      setShowGreaterThan10(false)

      setShowWaitToComplete(false)

      showTemporaryMessage(
        setShowPleaseSelectChips,
        selectChipsTimeoutRef,
      )

      return
    }

    const isOutsideBet =
      OUTSIDE_BETS.some((item) => item.key === spot) ||
      MIN_10_BET_SPOTS.includes(spot)

    if (isOutsideBet && amount < 10) {
      setShowPleaseSelectChips(false)

      setShowWaitToComplete(false)

      showTemporaryMessage(
        setShowGreaterThan10,
        greaterThan10TimeoutRef,
      )

      speak('greater than 10 rupees')

      return
    }

    if (
      isBetConfirmed ||
      isSpinning ||
      timerStatus !== 1 ||
      (timeLeft !== null && timeLeft <= 10)
    ) {
      setShowPleaseSelectChips(false)

      setShowGreaterThan10(false)

      showTemporaryMessage(
        setShowWaitToComplete,
        waitTimeoutRef,
      )

      speak('Please wait to complete Last Game')

      return
    }

    if (wallet < amount) {
      toast.error('Insufficient Point Balance!')

      return
    }

    setShowWaitToComplete(false)

    deductWallet(amount)

    playCoinSplashSound()

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

  useEffect(() => {
    betHistoryRef.current = betHistory
  }, [betHistory])

  useEffect(() => {
    isBetConfirmedRef.current = isBetConfirmed
  }, [isBetConfirmed])

  useEffect(() => {
    isSubmittingBetRef.current = isSubmittingBet
  }, [isSubmittingBet])

  useEffect(() => {
    handleBetConfirmRef.current = handleBetConfirm
  })

  const handleBetConfirm = async (isAuto = false) => {
    const isAutomatic = isAuto === true
    const currentBets = betHistoryRef.current || betHistory
    const isConfirmed = isBetConfirmedRef.current ?? isBetConfirmed

    if (
      currentBets.length === 0 ||
      isConfirmed ||
      isSubmittingBetRef.current ||
      isSpinning ||
      (!isAutomatic && timerStatus !== 1) ||
      (!isAutomatic && timeLeft !== null && timeLeft <= 10)
    ) {
      return
    }

    const activeGameNo = lastKnownGameNoRef.current;

    if (!activeGameNo) {
      toast.error('Game number is required');
      return;
    }

    const payload = createBetPayload(
      currentBets,
      user,
      activeGameNo,
    )

    if (!payload) {
      return
    }

    try {
      setIsSubmittingBet(true)
      isSubmittingBetRef.current = true
      const response = await placeBlue36Bet(payload)
      console.log('Blue 36 Bet response:', response)

      if (response?.success === false) {
        toast.error(response?.message || 'Failed to place bet')
        return
      }

      setIsBetConfirmed(true)
      isBetConfirmedRef.current = true
      setShowBetAccepted(true)
      speak('Bet accepted successfully')

      if (betAcceptedTimeoutRef.current) {
        clearTimeout(betAcceptedTimeoutRef.current)
      }

      betAcceptedTimeoutRef.current = setTimeout(() => {
        setShowBetAccepted(false)
      }, 2500)
    } catch (error) {
      console.error('Blue 36 Bet placement error:', error)
      toast.error(error?.response?.data?.message || 'Failed to place bet')
    } finally {
      setIsSubmittingBet(false)
      isSubmittingBetRef.current = false
    }
  }

  const handleClearBets = () => {
    if (isBetConfirmed) {
      toast.error(
        'Confirmed bets cannot be cleared',
      )

      return
    }

    if (
      isSpinning ||
      timerStatus !== 1 ||
      (timeLeft !== null && timeLeft <= 10)
    ) {
      setShowPleaseSelectChips(false)

      setShowGreaterThan10(false)

      showTemporaryMessage(
        setShowWaitToComplete,
        waitTimeoutRef,
      )

      speak(
        'Please wait to complete Last Game',
      )

      return
    }

    if (betHistory.length === 0) {
      return
    }

    const refundAmount =
      betHistory.reduce(
        (total, bet) =>
          total + bet.amount,
        0,
      )

    addWallet(refundAmount)

    setPreviousBets(bets)

    setBets({})

    setBetChips({})

    setBetHistory([])
  }

  const handleUndoBet = () => {
    if (isSpinning || timerStatus !== 1 || (timeLeft !== null && timeLeft <= 10)) {
      setShowPleaseSelectChips(false)
      setShowGreaterThan10(false)
      showTemporaryMessage(
        setShowWaitToComplete,
        waitTimeoutRef,
      )
      speak('Please wait to complete Last Game')
      return
    }

    if (
      isBetConfirmed ||
      betHistory.length === 0
    ) {
      return
    }

    playGameTapSound()

    const last =
      betHistory[
      betHistory.length - 1
      ]

    addWallet(last.amount)

    setBets((prev) => {
      const nextBets = {
        ...prev,
      }

      const newAmount =
        (nextBets[last.spot] || 0) -
        last.amount

      if (newAmount <= 0) {
        delete nextBets[last.spot]
      } else {
        nextBets[last.spot] =
          newAmount
      }

      return nextBets
    })

    setBetHistory((prev) =>
      prev.slice(0, -1),
    )
  }

  const handleDoubleBets = () => {
    if (isBetConfirmed) {
      toast.error(
        'Bets already confirmed',
      )

      return
    }

    if (
      isSpinning ||
      timerStatus !== 1 ||
      (timeLeft !== null && timeLeft <= 10)
    ) {
      setShowPleaseSelectChips(false)

      setShowGreaterThan10(false)

      showTemporaryMessage(
        setShowWaitToComplete,
        waitTimeoutRef,
      )

      speak(
        'Please wait to complete Last Game',
      )

      return
    }

    if (
      totalBet === 0 ||
      betHistory.length === 0
    ) {
      return
    }

    if (wallet < totalBet) {
      toast.error(
        'Insufficient balance to double bet',
      )

      return
    }

    deductWallet(totalBet)

    playGameTapSound()

    setBets((prev) => {
      const doubled = {}

      for (const spot in prev) {
        doubled[spot] =
          prev[spot] * 2
      }

      return doubled
    })

    setBetHistory((prev) => [
      ...prev,
      ...prev,
    ])
  }

  const handleRepeatBets = () => {
    if (isBetConfirmed) {
      toast.error('Bets already confirmed')
      return
    }

    if (isSpinning || timerStatus !== 1 || (timeLeft !== null && timeLeft <= 10)) {
      setShowPleaseSelectChips(false)
      setShowGreaterThan10(false)
      showTemporaryMessage(
        setShowWaitToComplete,
        waitTimeoutRef,
      )
      speak('Please wait to complete Last Game')
      return
    }

    const prevBets =
      previousBets && Object.keys(previousBets).length > 0
        ? previousBets
        : lastRoundBetsRef.current.bets

    const prevChips =
      previousBetChips && Object.keys(previousBetChips).length > 0
        ? previousBetChips
        : lastRoundBetsRef.current.betChips

    const prevHistory =
      previousBetHistory && previousBetHistory.length > 0
        ? previousBetHistory
        : lastRoundBetsRef.current.betHistory

    if (!prevBets || Object.keys(prevBets).length === 0) {
      return
    }

    if (betHistory.length > 0) {
      toast.error('Bets already placed! Please confirm bets.')
      return
    }

    const totalRepeatAmount = Object.values(prevBets).reduce(
      (sum, val) => sum + val,
      0,
    )

    if (wallet < totalRepeatAmount) {
      toast.error('Insufficient Point Balance!')
      return
    }

    setShowWaitToComplete(false)
    setShowPleaseSelectChips(false)
    setShowGreaterThan10(false)

    deductWallet(totalRepeatAmount)
    playCoinSplashSound()

    setBets({ ...prevBets })
    setBetChips({ ...prevChips })
    setBetHistory([...prevHistory])
  }


  const getTimerColor = (time) => {
    if (isSpinning) {
      return '#ff2222'
    }

    if (time >= 21) {
      return '#2ebd27'
    }

    if (time >= 6) {
      return '#ffe600'
    }

    return '#ff2222'
  }

  const renderTimerWedge = () => {
    if (timeLeft <= 0) {
      return null
    }

    const rx = 79
    const ry = 66
    const cx = 90
    const cy = 75

    const color =
      getTimerColor(timeLeft)

    const maxTime =
      isSpinning
        ? 10
        : 40

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

    const elapsed =
      maxTime - timeLeft

    const startAngle =
      (elapsed / maxTime) *
      2 *
      Math.PI

    const startX =
      cx +
      rx *
      Math.sin(startAngle)

    const startY =
      cy -
      ry *
      Math.cos(startAngle)

    const largeArcFlag =
      timeLeft > maxTime / 2
        ? 1
        : 0

    const pathData = `
      M ${cx} ${cy}
      L ${startX.toFixed(2)} ${startY.toFixed(2)}
      A ${rx} ${ry} 0 ${largeArcFlag} 1 ${cx} ${cy - ry}
      Z
    `

    return (
      <path
        d={pathData}
        fill={color}
        className="opacity-80"
      />
    )
  }

  return (
    <div
      className="game-viewport select-none font-sans"
      style={{
        fontFamily:
          'Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}
    >
      <div className="game-stage relative">

        {/* BACKGROUND */}
        <img
          src={rouletteMiniBg}
          alt="Roulette Mini Background"
          className="pointer-events-none absolute inset-0 z-0 h-full w-full object-fill"
        />

        {/* <div className="absolute right-[679px] -bottom-[164px] grid grid-cols-1 w-[113px] border-y-7 border-l-7 rounded-l-2xl border-white [perspective:2000px] [transform-style:preserve-3d] rotate-x-56 rotate-z-40 rotate-y-2 -skew-x-8 -skew-y-2">
      {imageItems.map((image, index) => (
        <div
          key={index}
          className="flex h-[94px]  items-center justify-center "
        >
          <img
            src={image}
            alt={`Option ${index + 1}`}
            className='h-[75px] w-[76px] object-contain -rotate-90  '
            
          />
        </div>
      ))}
    </div> */}


        
    {/* <div className="absolute right-[456px] bottom-59 h-[5px] w-[648px]  bg-white -rotate-z-25 rounded-[100px] ">
    </div>
    <div className="absolute left-[883px] bottom-8 h-[89px] w-[5px]  bg-white -rotate-z-54 rounded-[50px]">
    </div>
    <div className="absolute right-[446px] bottom-78 h-[88px] w-[5px]  bg-white -rotate-z-63 rounded-[100px]">
    </div> */}






        {/* HISTORY */}
        <div className="pointer-events-none absolute rounded-lg left-[84px] top-[16px] bg-black z-10 flex h-[282px] w-[145px] flex-col p-[12px_14px] text-[18px] font-black leading-none">
          {historyList.map(
            ([number, side], index) => (
              <div
                key={`${number}-${index}`}
                className={`flex flex-1 items-center ${STYLE[side]
                  }`}
              >
                {number}
              </div>
            ),
          )}
        </div>

        {/* CURRENT PLAY + YOU WON */}
        <div className="pointer-events-none absolute left-[262px] top-[15px] z-10 flex h-[182px] w-[422px] flex-col p-[0px_12px]">
          <div className="relative flex h-[122px] w-full overflow-hidden rounded-t-[10px]  bg-[#ea926b]">
            <div className="absolute left-[201px] h-[600px] w-[600px] -translate-x-1/2 origin-center">
              <img
                src={wheelImg}
                alt="Roulette Wheel"
                className="h-full w-full origin-center object-fill"
                style={{
                  transform: `rotate(${boxWheelAngle}deg)`,
                  transition: isSpinning
                    ? 'transform 8.5s cubic-bezier(0.15, 0.85, 0.25, 1)'
                    : 'none',
                }}
              />
            </div>

            <div className="pointer-events-none absolute left-[204px] top-[100px] z-20 h-[22px] w-[22px] -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-[radial-gradient(circle_at_35%_35%,#ffffff_0%,#ffffff_65%,#f1f5f9_85%,#cbd5e1_100%)]" />
          </div>

          <div className="flex flex-col justify-center">
            <div className="border-b border-t border-yellow-400 bg-black py-0 pl-6 text-[21px] font-semibold text-white drop-shadow">
              Current Play : {totalBet}
            </div>

            <div className="pl-6 text-[20px] font-semibold bg-black text-green-500 ">
              You Won {youWon}
            </div>
          </div>
        </div>

        {/* MIN / MAX PLAY */}
        <div className="pointer-events-none absolute bg-black rounded-lg left-[706px] top-[18px] z-10 flex h-[88px] w-[322px] flex-col items-center justify-center text-center leading-[20px]">
          <span className="text-[17px] font-semibold tracking-wide text-yellow-300">
            MIN- Play
          </span>

          <span className="text-[17px] font-semibold tracking-wide text-yellow-300">
            IN 1&nbsp;&nbsp; OUT 10
          </span>

          <span className="mt-0.5 text-[17px] font-semibold tracking-wide text-yellow-300">
            MAX- Play
          </span>

          <span className="text-[17px] font-semibold tracking-wide text-yellow-300">
            IN 5000, OUT 50000
          </span>
        </div>

        {/* WINNING NUMBER */}
        <div className="pointer-events-none absolute left-[1060px] rounded-lg top-[17px] bg-black z-10 flex h-[68px] w-[186px] items-center justify-center">
          <span
            className="text-[54px] font-bold tracking-wider drop-shadow-[0_2px_4px_rgba(0,0,0,0.95)]"
            style={{
              color:
                winningNumber === 0
                  ? '#2ebd27'
                  : RED_NUMS.includes(
                    winningNumber,
                  )
                    ? '#ff2b2b'
                    : '#ffffff',
            }}
          >
            {winningNumber}
          </span>
        </div>

        {/* MAIN WHEEL */}
        <div className="pointer-events-none absolute left-[1589px] top-[113px] z-10 flex h-[515px] w-[645px] -translate-x-1/2 -translate-y-1/2 items-center justify-center">
          <div className="relative flex h-full w-full origin-center items-center justify-center [transform:perspective(1000px)_rotateX(66deg)_rotate(39deg)]">
            <div className="relative flex h-full w-full items-center justify-center origin-center">
              <div
                className="absolute inset-0 flex origin-center items-center justify-center"
                style={{
                  transform: `rotate(${bigWheelAngle}deg)`,
                  transition: isSpinning
                    ? 'transform 8.5s cubic-bezier(0.18, 0.88, 0.25, 1)'
                    : 'none',
                }}
              >
                <img
                  src={wheelImg}
                  alt="Roulette Wheel"
                  className="h-full w-full object-contain drop-shadow-[0_16px_32px_rgba(0,0,0,0.95)]"
                />
              </div>

              {/* BALL */}
              <div
                className="absolute inset-0 flex origin-center items-center justify-center"
                style={{
                  transform: `rotate(${ballAngle}deg)`,
                  transition: isSpinning
                    ? 'transform 8.2s cubic-bezier(0.18, 0.88, 0.25, 1)'
                    : 'none',
                }}
              >
                <div className="pointer-events-none absolute left-1/2 top-[16.5%] z-30 h-6 w-6 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-[radial-gradient(circle_at_35%_35%,#ffffff_0%,#ffffff_65%,#f1f5f9_85%,#cbd5e1_100%)] shadow-[0_0_10px_rgba(255,255,255,0.95),0_3px_6px_rgba(0,0,0,0.55),inset_-2px_-2px_3px_rgba(0,0,0,0.15)]" />
              </div>
            </div>
          </div>

          {/* THUDI */}
          <img
            src={thudiImg}
            alt="Dolly"
            className="pointer-events-none absolute left-1/2 top-1/2 h-[70px] w-[76px] -translate-x-1/2 -translate-y-[68%] object-contain drop-shadow-[0_10px_18px_rgba(0,0,0,0.95)]"
          />
        </div>

        {/* POINT BALANCE */}
        <div className="absolute left-[20px] top-[828px] z-20 flex h-[88px] w-[288px] select-none flex-col">
          <img
            src={buttonBg}
            alt="POINT BALANCE"
            className="pointer-events-none absolute inset-0 h-full w-full object-fill drop-shadow-md"
          />
          <div className="relative z-10 flex h-[27px] items-center justify-center text-[24px] font-semibold tracking-wide text-[#081036]">
            POINT BALANCE
          </div>
          <div className="relative z-10 flex flex-1 items-center justify-center pb-1 text-[26px] font-bold tracking-wide text-white">
            {Number(wallet).toFixed(2)}
          </div>
        </div>

        <div className="absolute left-[346px] top-[828px] z-20 flex h-[88px] w-[290px] select-none flex-col">
          <img
            src={buttonBg}
            alt="NAME"
            className="pointer-events-none absolute inset-0 h-full w-full object-fill drop-shadow-md"
          />
          <div className="relative z-10 flex h-[27px] items-center justify-center text-[24px] font-semibold tracking-wide text-[#081036]">
            NAME
          </div>
          <div className="relative z-10 flex flex-1 items-center justify-center px-2 pb-1 text-[26px] font-bold tracking-wide uppercase text-white truncate">
            {user?.username || ''}
          </div>
        </div>

        {/* GAME RULES */}
        <button
          type="button"
          onClick={() => {
            playGameTapSound()
            // setIsRulesOpen(true)
          }}
          className="absolute left-[44.8%] top-[14.3%] z-30 flex h-[32px] w-[290px] -translate-x-1/2 -translate-y-1/2 cursor-pointer items-center justify-center transition hover:scale-105 active:scale-100"

        >
          <img
            src={rulesBtn}
            alt="GAME RULES"
            className="h-full w-full object-fill drop-shadow"
          />
        </button>

        {/* NEIGHBOUR BET */}
        <button
          type="button"
          onClick={() => {
            playGameTapSound()
            setIsNeighbourOpen(true)
          }}
          className="absolute left-[6%] top-[86.5%] z-30 flex h-[75px] w-[190px] -translate-x-1/2 -translate-y-1/2 cursor-pointer items-center justify-center transition hover:scale-105 active:scale-100"

        >
          <img
            src={neighbourBtn}
            alt="NEIGHBOUR BET"
            className="h-full w-full object-fill drop-shadow"
          />
        </button>

        {/* GAME HISTORY */}
        <button
          type="button"
          onClick={() => {
            playGameTapSound()
            setIsHistoryOpen(true)
            fetchBetHistory()
          }}
          className="absolute left-[79.6%] top-[96.1%] z-30 flex h-[74px] w-[212px] -translate-x-1/2 -translate-y-1/2 cursor-pointer items-center justify-center transition hover:scale-105 active:scale-100"

        >
          <img
            src={gameHistoryBtn}
            alt="GAME HISTORY"
            className="h-full w-full object-fill drop-shadow"
          />
        </button>

        {/* LEAVE TABLE */}
        <button
          type="button"
          onClick={() => {
            playGameTapSound()
            setIsLeaveModalOpen(true)
          }}
          className="absolute left-[92.6%] top-[98%] z-30 flex h-[40px] w-[250px] -translate-x-1/2 -translate-y-1/2 cursor-pointer items-center justify-center transition hover:scale-105 active:scale-100"

        >
          <img
            src={leaveTableBtn}
            alt="LEAVE TABLE"
            className="h-full w-full object-fill drop-shadow"
          />
        </button>

        {/* CHIP SELECTION */}
        {CHIPS.map((chip) => {
          const isSelected =
            selectedChip === chip.value

          return (
            <button
              key={`chip-${chip.value}`}
              type="button"
              onClick={() =>
                handleSelectChip(
                  chip.value,
                )
              }
              style={{
                position: 'absolute',
                left: chip.left,
                top: chip.top,
                width: chip.width,
                height: chip.height,
                transform:
                  chip.transform ||
                  'translate(-55%, -57%) rotateX(59deg)',
              }}
              className="z-40 flex cursor-pointer items-center justify-center rounded-full bg-transparent focus:outline-none"

            >
              {isSelected && (
                <span
                  style={{
                    ...(chip.borderStyle || {}),
                    ...(chip.borderTransform
                      ? { transform: chip.borderTransform }
                      : {}),
                  }}
                  className={`pointer-events-none absolute animate-pulse rounded-full border-[3px] border-yellow-300 shadow-[0_0_16px_#ffd700] ring-2 ring-yellow-400/90 ${chip.borderInset || chip.borderClassName || '-inset-2.5'
                    }`}
                />
              )}
            </button>
          )
        })}

        {/* NUMBER BETS */}
        {NUMBERS.map((num) => {
          const coords =
            getNumberCoordinates(num)

          const betAmount =
            bets[num] || 0

          return (
            <button
              key={`num-${num}`}
              type="button"
              onClick={() =>
                handlePlaceBet(num)
              }
              style={{
                position: 'absolute',
                left: coords.left,
                top: coords.top,
                width:
                  typeof coords.width ===
                    'number'
                    ? `${coords.width}px`
                    : coords.width,
                height:
                  typeof coords.height ===
                    'number'
                    ? `${coords.height}px`
                    : coords.height,
                transform: `translate(-50%, -50%) ${coords.transform ||
                  BET_TRANSFORM
                  }`,
                transformOrigin:
                  'center center',
              }}
              className="group z-20 flex cursor-pointer items-center justify-center rounded-full  "

            >
              <span className="pointer-events-none absolute inset-0 rounded-full   " />

              {betAmount > 0 && (
                <PlacedChip
                  amount={betAmount}
                  chipValue={
                    betChips[num] ||
                    selectedChip
                  }
                  width="100%"
                  height="100%"
                />
              )}
            </button>
          )
        })}

        {/* WINNING NUMBER RESULT MARKER (SHOW_RESULT.PNG) */}
        {showResultMarker && winningNumber !== null && winningNumber !== undefined && (() => {
          const coords = getNumberCoordinates(winningNumber)
          if (!coords) return null
          return (
            <div
              key={`win-marker-${winningNumber}`}
              style={{
                position: 'absolute',
                left: coords.left,
                top: coords.top,
                width: '42px',
                height: '56px',
                transform: 'translate(-42%, -73%)',
                transformOrigin: 'center bottom',
                zIndex: 45,
                pointerEvents: 'none',
              }}
              className="flex items-center justify-center select-none"
            >
              <img
                src={showResultImg}
                alt={`Winning Number ${winningNumber}`}
                className="h-full w-full object-contain drop-shadow-[0_4px_8px_rgba(0,0,0,0.85)]"
              />
            </div>
          )
        })()}

        {/* OUTSIDE BETS */}
        {OUTSIDE_BETS.map((item) => {
          const betAmount =
            bets[item.key] || 0

          return (
            <button
              key={`outside-${item.key}`}
              type="button"
              onClick={() =>
                handlePlaceBet(
                  item.key,
                )
              }
              style={{
                position: 'absolute',
                left: item.left,
                top: item.top,
                width:
                  typeof item.width ===
                    'number'
                    ? `${item.width}px`
                    : item.width,
                height:
                  typeof item.height ===
                    'number'
                    ? `${item.height}px`
                    : item.height,
                transform: `translate(-50%, -50%) ${item.transform ||
                  BET_TRANSFORM
                  }`,
                transformOrigin:
                  'center center',
              }}
              className="group z-20 flex scale-105 cursor-pointer items-center justify-center rounded-md "

            >
              <span className="pointer-events-none absolute inset-0 rounded-md  " />

              {betAmount > 0 && (
                <PlacedChip
                  amount={betAmount}
                  chipValue={
                    betChips[item.key] ||
                    selectedChip
                  }
                  width={BET_WIDTH}
                  height={BET_HEIGHT}
                />
              )}
            </button>
          )
        })}

        {/* SPLIT BETS */}
        {SPLIT_BETS.map((item) => {
          const betAmount =
            bets[item.key] || 0

          return (
            <button
              key={`split-${item.key}`}
              type="button"
              onClick={() =>
                handlePlaceBet(
                  item.key,
                )
              }
              style={{
                position: 'absolute',
                left: item.left,
                top: item.top,
                width:
                  betAmount > 0
                    ? MULTI_BET_WIDTH
                    : '26px',
                height:
                  betAmount > 0
                    ? MULTI_BET_HEIGHT
                    : '26px',
                transform: `translate(-50%, -50%) ${BET_TRANSFORM}`,
                transformOrigin:
                  'center center',
              }}
              className="group z-24 flex cursor-pointer items-center justify-center rounded-full "

            >
              <span className="pointer-events-none absolute inset-0 rounded-full " />

              {betAmount > 0 && (
                <PlacedChip
                  amount={betAmount}
                  chipValue={
                    betChips[item.key] ||
                    selectedChip
                  }
                  width={MULTI_BET_WIDTH}
                  height={MULTI_BET_HEIGHT}
                  isSmall
                />
              )}
            </button>
          )
        })}

        {/* STREET BETS */}
        {STREET_BETS.map((item) => {
          const betAmount =
            bets[item.key] || 0

          return (
            <button
              key={`street-${item.key}`}
              type="button"
              onClick={() =>
                handlePlaceBet(
                  item.key,
                )
              }
              style={{
                position: 'absolute',
                left: item.left,
                top: item.top,
                width:
                  betAmount > 0
                    ? MULTI_BET_WIDTH
                    : '30px',
                height:
                  betAmount > 0
                    ? MULTI_BET_HEIGHT
                    : '26px',
                transform: `translate(-50%, -50%) ${BET_TRANSFORM}`,
                transformOrigin:
                  'center center',
              }}
              className="group z-26 flex cursor-pointer items-center justify-center rounded-md "

            >
              <span className="pointer-events-none absolute inset-0 rounded-md " />

              {betAmount > 0 && (
                <PlacedChip
                  amount={betAmount}
                  chipValue={
                    betChips[item.key] ||
                    selectedChip
                  }
                  width={MULTI_BET_WIDTH}
                  height={MULTI_BET_HEIGHT}
                  isSmall
                />
              )}
            </button>
          )
        })}

        {/* LINE BETS */}
        {LINE_BETS.map((item) => {
          const betAmount =
            bets[item.key] || 0

          return (
            <button
              key={`line-${item.key}`}
              type="button"
              onClick={() =>
                handlePlaceBet(
                  item.key,
                )
              }
              style={{
                position: 'absolute',
                left: item.left,
                top: item.top,
                width:
                  betAmount > 0
                    ? MULTI_BET_WIDTH
                    : '26px',
                height:
                  betAmount > 0
                    ? MULTI_BET_HEIGHT
                    : '26px',
                transform: `translate(-50%, -50%) ${BET_TRANSFORM}`,
                transformOrigin:
                  'center center',
              }}
              className="group z-28 flex cursor-pointer items-center justify-center rounded-full "

            >
              <span className="pointer-events-none absolute inset-0 rounded-full  " />

              {betAmount > 0 && (
                <PlacedChip
                  amount={betAmount}
                  chipValue={
                    betChips[item.key] ||
                    selectedChip
                  }
                  width={MULTI_BET_WIDTH}
                  height={MULTI_BET_HEIGHT}
                  isSmall
                />
              )}
            </button>
          )
        })}

        {/* CORNER BETS */}
        {CORNER_BETS.map((item) => {
          const betAmount =
            bets[item.key] || 0

          return (
            <button
              key={`corner-${item.key}`}
              type="button"
              onClick={() =>
                handlePlaceBet(
                  item.key,
                )
              }
              style={{
                position: 'absolute',
                left: item.left,
                top: item.top,
                width:
                  betAmount > 0
                    ? MULTI_BET_WIDTH
                    : '26px',
                height:
                  betAmount > 0
                    ? MULTI_BET_HEIGHT
                    : '26px',
                transform: `translate(-50%, -50%) ${BET_TRANSFORM}`,
                transformOrigin:
                  'center center',
              }}
              className="group z-30 flex cursor-pointer items-center justify-center rounded-full "

            >
              <span className="pointer-events-none absolute inset-0 rounded-full  " />

              {betAmount > 0 && (
                <PlacedChip
                  amount={betAmount}
                  chipValue={
                    betChips[item.key] ||
                    selectedChip
                  }
                  width={MULTI_BET_WIDTH}
                  height={MULTI_BET_HEIGHT}
                  isSmall
                />
              )}
            </button>
          )
        })}

        {/* STATUS - WAIT */}
        {showWaitToComplete && (
          <div className="pointer-events-none absolute left-[960px] top-[480px] z-[60] flex -translate-x-1/2 -translate-y-1/2 items-center justify-center">
            <img
              src={waitToComplete}
              alt="PLEASE WAIT"
              className="h-[46px] w-[540px] object-contain drop-shadow-[0_4px_16px_rgba(0,0,0,0.95)]"
            />
          </div>
        )}

        {/* STATUS - SELECT CHIPS */}
        {showPleaseSelectChips && (
          <div className="pointer-events-none absolute left-[960px] top-[480px] z-[60] flex -translate-x-1/2 -translate-y-1/2 items-center justify-center">
            <img
              src={pleaseSelectChipsImg}
              alt="PLEASE SELECT CHIPS"
              className="h-[46px] w-[540px] object-contain"
            />
          </div>
        )}

        {/* STATUS - GREATER THAN 10 */}
        {showGreaterThan10 && (
          <div className="pointer-events-none absolute left-[960px] top-[480px] z-[60] flex -translate-x-1/2 -translate-y-1/2 items-center justify-center">
            <img
              src={greaterThan10Rs}
              alt="GREATER THAN 10RS"
              className="h-[46px] w-[540px] object-contain "
            />
          </div>
        )}

        {/* LAST CALL */}
        {timeLeft === 20 &&
          !isSpinning && (
            <div className="pointer-events-none absolute left-[960px] top-[480px] z-[60] flex -translate-x-1/2 -translate-y-1/2 items-center justify-center">
              <img
                src={lastCallImg}
                alt="LAST CALL"
                className="h-[46px] w-[540px] object-contain "
              />
            </div>
          )}

        {/* BET ACCEPTED */}
        {showBetAccepted && (
          <div className="pointer-events-none absolute left-[960px] top-[480px] z-40 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center">
            <img
              src={betAcceptedImg}
              alt="BET ACCEPTED"
              className="h-[46px] w-[540px] object-contain "
            />
          </div>
        )}

        {/* BET CONFIRM / BET ACCEPTED */}
        {betHistory.length > 0 && !isBetConfirmed && (
          <button
            type="button"
            onClick={handleBetConfirm}
            disabled={isSubmittingBet}
            className={`absolute left-[1570px] top-[640px] z-30 flex h-[65px] w-[256px] -translate-x-1/2 -translate-y-1/2 cursor-pointer items-center justify-center transition hover:scale-105 active:scale-95 ${isSubmittingBet ? 'opacity-70 pointer-events-none' : ''
              }`}
          >
            <img
              src={betConBtn}
              alt="BET CONFIRM"
              className="h-full w-full object-fill "
            />
          </button>
        )}

        {betHistory.length > 0 && isBetConfirmed && (
          <div
            className="absolute left-[1570px] top-[640px] z-30 flex h-[65px] w-[256px] -translate-x-1/2 -translate-y-1/2 items-center justify-center pointer-events-none"

          >
            <img
              src={betAccBtn}
              alt="BET ACCEPTED"
              className="h-full w-full object-fill "
            />
          </div>
        )}

        {/* TIMER */}
        {timerStatus === 1 && showClock && !isSpinning && (
          <div className="pointer-events-none absolute left-[1785px] top-[760px] z-20 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center">
            <span className="mb-1 text-[14px] font-black tracking-wide text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.95)]">
              Time Left:{timeLeft}
            </span>

            <div className="relative flex h-[150px] w-[180px] items-center justify-center">
              <img
                src={watch40Img}
                alt="Analog Timer"
                className="h-full w-full object-fill drop-shadow-[0_8px_16px_rgba(0,0,0,0.9)]"
              />

              <svg className="pointer-events-none absolute inset-0 h-full w-full">
                {renderTimerWedge()}
              </svg>
            </div>
          </div>
        )}

        {/* REPEAT (SHOWN ONLY IF PREVIOUS BETS EXIST AND NO CHIP SELECTED) */}
        {hasPreviousBets && !selectedChip && !isBetConfirmed && timerStatus === 1 && (timeLeft === null || timeLeft > 10) && !isSpinning && (
          <button
            type="button"
            onClick={handleRepeatBets}
            className="absolute left-[1170px] top-[838px] z-20 flex h-[74px] w-[210px] cursor-pointer items-center justify-center transition hover:scale-105 active:scale-95"

          >
            <img
              src={repeatBtn}
              alt="REPEAT"
              className="h-full w-full object-fill "
            />
          </button>
        )}

        {/* REMOVE, DOUBLE, CLEAR BET */}
        {Boolean(selectedChip) && !isBetConfirmed && timerStatus === 1 && (timeLeft === null || timeLeft > 10) && !isSpinning && (
          <>
            <button
              type="button"
              onClick={handleUndoBet}
              className="absolute left-[670px] top-[838px] z-20 flex h-[74px] w-[210px] cursor-pointer items-center justify-center transition hover:scale-105 active:scale-95"
            >
              <img
                src={removeBtn}
                alt="REMOVE"
                className="h-full w-full object-fill"
              />
            </button>

            <button
              type="button"
              onClick={handleDoubleBets}
              className="absolute left-[920px] top-[838px] z-20 flex h-[74px] w-[210px] cursor-pointer items-center justify-center transition hover:scale-105 active:scale-95"
            >
              <img
                src={doubleBtn}
                alt="DOUBLE"
                className="h-full w-full object-fill "
              />
            </button>

            <button
              type="button"
              onClick={handleClearBets}
              className="absolute left-[1170px] top-[838px] z-20 flex h-[74px] w-[210px] cursor-pointer items-center justify-center transition hover:scale-105 active:scale-95"
            >
              <img
                src={clearBetBtn}
                alt="CLEAR BET"
                className="h-full w-full object-fill"
              />
            </button>
          </>
        )}

        {/* POPUPS */}
        <GameRulesPopup
          isOpen={isRulesOpen}
          onClose={() =>
            setIsRulesOpen(false)
          }
        />

        <GameHistoryPopup
          isOpen={isHistoryOpen}
          onClose={() =>
            setIsHistoryOpen(false)
          }
          userName={
            user?.username || 'PLAYER'
          }
          balance={wallet}
          historyData={gameHistoryData}
        />

        <NeighbourPopup
          isOpen={isNeighbourOpen}
          onClose={() =>
            setIsNeighbourOpen(false)
          }
          onBet={(spot, chipVal) => {
            setSelectedChip(chipVal)

            handlePlaceBet(
              spot,
              chipVal,
            )
          }}
          bets={bets}
          betChips={betChips}
          selectedChip={selectedChip}
          isLocked={timerStatus !== 1 || isSpinning || (timeLeft !== null && timeLeft <= 10)}
        />

        {/* LEAVE TABLE CONFIRMATION POPUP */}
        <ConfirmDialog
          isOpen={isLeaveModalOpen}
          onClose={() => setIsLeaveModalOpen(false)}
          onConfirm={() => {
            playGameTapSound()
            stopBlueWheelSound()
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

export default RouletteMiniTimer