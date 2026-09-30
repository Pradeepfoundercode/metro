import React, { useState, useEffect, useRef } from 'react'
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
import { CHIPS, RED_NUMBERS, ROW_1, ROW_2, ROW_3 } from '../../constants/funRouletteData'



export default function FunRoulette() {
  const navigate = useNavigate()
  const { user, updateProfile } = useAuth()

  const [balance, setBalance] = useState(() => Number(user?.wallet ?? 6586))
  const [selectedChip, setSelectedChip] = useState(1)
  const [bets, setBets] = useState({})
  const [betHistory, setBetHistory] = useState([])
  const [timeLeft, setTimeLeft] = useState(33)
  const [winnerNumber, setWinnerNumber] = useState('0')
  const [historyList, setHistoryList] = useState(['26', '12', '13', '7', '6'])
  const [isLocked, setIsLocked] = useState(false)
  const [statusMessage, setStatusMessage] = useState('Please Bet to start Game . Minimum Bet = 1')
  const [winningSpot, setWinningSpot] = useState(null)

  const totalBet = Object.values(bets).reduce((a, b) => a + b, 0)
  const betsRef = useRef(bets)
  betsRef.current = bets


 

  

  const handleSpecificCancelBet = () => {
    if (isLocked || betHistory.length === 0) return
    const lastBet = betHistory[betHistory.length - 1]
    const newHistory = betHistory.slice(0, -1)

    setBalance((prev) => {
      const nb = prev + lastBet.amount
      if (updateProfile) updateProfile({ wallet: nb })
      return nb
    })

    setBets((prev) => {
      const cur = prev[lastBet.spot] || 0
      const updated = cur - lastBet.amount
      const nextBets = { ...prev }
      if (updated <= 0) {
        delete nextBets[lastBet.spot]
      } else {
        nextBets[lastBet.spot] = updated
      }
      return nextBets
    })

    setBetHistory(newHistory)
  }

  const handleBetOk = () => {
    if (totalBet > 0) {
      setStatusMessage(`Bet Accepted: Total ${totalBet} placed. Good Luck!`)
    }
  }

  const getChipAsset = (amt) => {
    if (amt >= 5000) return chip5000
    if (amt >= 1000) return chip1000
    if (amt >= 500) return chip500
    if (amt >= 100) return chip100
    if (amt >= 50) return chip50
    if (amt >= 10) return chip10
    if (amt >= 5) return chip5
    return chip1
  }

  const renderChipBadge = (spot) => {
    const val = bets[spot]
    if (!val) return null
    return (
      <div className="absolute inset-0 z-30 pointer-events-none flex items-center justify-center">
        <div className="relative flex items-center justify-center">
          <img src={getChipAsset(val)} alt="chip" className="h-6 w-10 sm:h-7 sm:w-12 object-contain drop-shadow" />
          <span className="absolute text-[10px] sm:text-[11px] font-black text-white drop-shadow-[0_1px_2px_rgba(0,0,0,1)]">
            {val}
          </span>
        </div>
      </div>
    )
  }

  return (
    <div className="relative h-screen w-screen overflow-hidden select-none bg-[#02200d] font-sans flex flex-col justify-between py-1">
      <img
        src={bgSecond}
        alt="Roulette Background"
        className="pointer-events-none absolute inset-0 h-full w-full object-fill"
      />

      <div className="relative z-10 flex w-full items-start justify-between px-4 pt-1">
        <div className="flex flex-col items-start gap-1.5 mt-14">
          <div className="relative  flex items-center justify-center">
            <img src={scoreHd} alt="Score" className="h-[70px] w-[370px]" />
            <div className="absolute  bottom-3 flex items-center justify-center">
              <span className="text-[20px] sm:text-[17px] font-black tracking-wide text-white ">
                {balance.toFixed(2)}
              </span>
            </div>
          </div>

          <div className="relative flex items-center justify-center ml-8  cursor-pointer">
            <img src={extraLeft} alt="Time Left Pill" className="h-[60px] w-[270px]" />
            <span className="absolute text-[15px] font-extrabold tracking-wide text-white drop-shadow">
              Time Left: {timeLeft}
            </span>
          </div>

          <div className="mt-3 flex flex-col gap-5 ml-2">
            <div className="flex items-center gap-2">
              {CHIPS.slice(0, 4).map((c) => (
                <button
                  key={c.value}
                  type="button"
                  onClick={() => setSelectedChip(c.value)}
                  className={`relative cursor-pointer transition-transform mr-2 ${selectedChip === c.value ? 'scale-115 ' : 'hover:scale-105 active:scale-95'
                    }`}
                >
                  <img src={c.img} alt={`chip ${c.value}`} className="h-8 w-14 sm:h-10 sm:w-18" />
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2">
              {CHIPS.slice(4, 8).map((c) => (
                <button
                  key={c.value}
                  type="button"
                  onClick={() => setSelectedChip(c.value)}
                  className={`relative cursor-pointer transition-transform mr-2 ${selectedChip === c.value ? 'scale-115 ' : 'hover:scale-105 active:scale-95'
                    }`}
                >
                  <img src={c.img} alt={`chip ${c.value}`} className="h-8 w-14 sm:h-10 sm:w-18" />
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center flex-1 -mt-2">
          <img src={funRouletteBanner} alt="Fun Roulette" className="h-[72px] sm:h-[82px] w-[400px] sm:w-[580px] " />
          <div className="relative ">
            <img
              src={rouletteMachine}
              alt="Roulette Wheel"
              className="h-[250px] w-[290px] sm:h-[280px] sm:w-[400px]  drop-shadow-[0_14px_28px_rgba(0,0,0,0.9)]"
            />
          </div>
        </div>

        <div className="flex flex-col items-end gap-1 mt-10 mr-5">
          <div className="relative  flex items-center justify-center mr-4">
            <img src={winnerGif} alt="Winner" className="w-[350px]" />
            <div className="absolute inset-x-0 bottom-8 flex items-center justify-center">
              <span className="text-[24px] sm:text-[20px] font-black tracking-wide text-[#39ff14] drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]">
                {winnerNumber}
              </span>
            </div>
          </div>

          <div className="relative  flex items-center justify-center ">
            <img src={extraUpper} alt="History Bar" className="h-[80px] w-[400px] " />
            <div className="absolute inset-x-18 top- flex items-center justify-around px-2">
              {historyList.map((val, idx) => {
                const num = parseInt(val, 10)
                const isRed = RED_NUMBERS.includes(num)
                return (
                  <span
                    key={idx}
                    className={`text-[15px] sm:text-[16px] font-black drop-shadow ${val === '0' || val === '00' ? 'text-[#39ff14]' : isRed ? 'text-[#ff3b30]' : 'text-white'
                      }`}
                  >
                    {val}
                  </span>
                )
              })}
            </div>
          </div>

          <div className=" flex flex-col items-end gap-1 w-full ">
            <button
              type="button"
              onClick={handleBetOk}
              className="relative mr-14 h-[50px] w-[250px] flex items-center justify-center cursor-pointer transition"
            >
              <img src={extraRight} alt="Bet Ok" className="h-full w-full object-fill" />
              <span className="absolute text-[15px] font-black  text-white drop-shadow  top-5 left-15 ">
                Bet Ok
              </span>
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                // onClick={handleCancelBet}
                className="relative h-[40px] w-[200px] flex items-center justify-center cursor-pointer transition "
              >
                <img src={noDesignPill} alt="Cancel Bet" className="h-full w-full object-fill" />
                <span className="absolute text-[15px] font-bold text-white drop-shadow">
                  Cancel Bet
                </span>
              </button>

              <button
                type="button"
                onClick={handleSpecificCancelBet}
                className="relative h-[40px] w-[270px] -mr-5 flex items-center justify-center cursor-pointer transition "
              >
                <img src={noDesignPill} alt="Specific Cancel Bet" className="h-full w-full object-fill" />
                <span className="absolute text-[15px] font-bold text-white drop-shadow">
                  Specific Cancel Bet
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-10 flex flex-col items-center w-full px-3 -mt-2">
        {/* <div className="relative -mb-0.5 z-20">
          <div className="bg-black/90 px-8 py-0.5 border border-[#d4af37] border-b-0">
            <span className="text-[14px] sm:text-[15px] font-serif font-black tracking-widest text-[#f5d061] drop-shadow-[0_2px_4px_rgba(0,0,0,1)] uppercase">
              PLACE YOUR BETS
            </span>
          </div>
        </div> */}

        <div className="relative w-full max-w-[1400px] aspect-[936/209]">
  <img
    src={rouletteGrid}
    alt="Roulette Betting Grid"
    className="absolute inset-0 h-full w-full object-fill"
  />

 <div className="absolute inset-0">

  {/* 00 */}
  <button
    type="button"
    // onClick={() => handlePlaceBet('00')}
    className="absolute left-[0.8%] top-[1%] h-[31%] w-[6.8%] flex items-center justify-center cursor-pointer"
  >
    <img
      src={greenOvalBtn}
      alt="00"
      className="h-[70%] w-[82%] object-contain"
    />

    <span className="absolute text-[15px] sm:text-[16px] font-black text-white drop-shadow">
      00
    </span>

    {winningSpot === '00' && (
      <img
        src={blinkGif}
        alt="blink"
        className="absolute inset-0 h-full w-full object-contain pointer-events-none"
      />
    )}

    {renderChipBadge('00')}
  </button>

  {/* 0 */}
  <button
    type="button"
    onClick={() => handlePlaceBet('0')}
    className="absolute left-[0.8%] top-[32%] h-[31%] w-[6.8%] flex items-center justify-center cursor-pointer"
  >
    <img
      src={greenOvalBtn}
      alt="0"
      className="h-[70%] w-[82%] object-contain"
    />

    <span className="absolute text-[15px] sm:text-[16px] font-black text-white drop-shadow">
      0
    </span>

    {winningSpot === '0' && (
      <img
        src={blinkGif}
        alt="blink"
        className="absolute inset-0 h-full w-full object-contain pointer-events-none"
      />
    )}

    {renderChipBadge('0')}
  </button>

  {/* NUMBER GRID OVERLAY */}
  <div className="absolute left-[8%] top-[1%] h-[61%] w-[84%] grid grid-cols-12 grid-rows-3">

    {[ROW_1, ROW_2, ROW_3].map((row) =>
      row.map((num) => {
        const isRed = RED_NUMBERS.includes(num)
        const sNum = String(num)

        return (
          <button
            key={num}
            type="button"
            onClick={() => handlePlaceBet(sNum)}
            className="relative flex items-center justify-center cursor-pointer"
          >
            <img
              src={isRed ? redOvalBtn : blackOvalBtn}
              alt={sNum}
              className="h-[72%] w-[72%] object-contain"
            />

            <span className="absolute text-[15px] sm:text-[16px] font-black text-white drop-shadow">
              {num}
            </span>

            {winningSpot === sNum && (
              <img
                src={blinkGif}
                alt="blink"
                className="absolute inset-0 h-full w-full object-contain pointer-events-none"
              />
            )}

            {renderChipBadge(sNum)}
          </button>
        )
      })
    )}

  </div>

  {/* 2 TO 1 */}
  <div className="absolute right-[0.8%] top-[1%] h-[61%] w-[6.4%] grid grid-rows-3">

    {['ROW_1', 'ROW_2', 'ROW_3'].map((row) => (
      <button
        key={row}
        type="button"
        onClick={() => handlePlaceBet(row)}
        className="relative flex items-center justify-center cursor-pointer"
      >
        <span className="text-[12px] sm:text-[14px] font-extrabold text-white tracking-widest [writing-mode:vertical-rl] rotate-180 drop-shadow">
          2 to 1
        </span>

        {renderChipBadge(row)}
      </button>
    ))}

  </div>

  {/* 1st 12 / 2nd 12 / 3rd 12 */}
  <div className="absolute left-[8%] top-[63%] h-[17%] w-[84%] grid grid-cols-3">

    {[
      ['1ST12', '1st 12'],
      ['2ND12', '2nd 12'],
      ['3RD12', '3rd 12'],
    ].map(([spot, label]) => (
      <button
        key={spot}
        type="button"
        onClick={() => handlePlaceBet(spot)}
        className="relative flex items-center justify-center cursor-pointer overflow-hidden"
      >
        <span className="text-[22px] sm:text-[34px] font-serif font-black text-[#3bfb22] tracking-wider leading-none drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]">
          {label}
        </span>

        {renderChipBadge(spot)}
      </button>
    ))}

  </div>

  {/* 1 to 18 / EVEN / RED / BLACK / ODD / 19 to 36 */}
  <div className="absolute left-[11.9%] top-[82%] h-[15%] w-[77.2%] grid grid-cols-6">

    {/* 1 to 18 */}
    <button
      type="button"
      onClick={() => handlePlaceBet('1-18')}
      className="relative flex items-center justify-center cursor-pointer overflow-hidden"
    >
      <span className="text-[19px] sm:text-[27px] font-black text-white tracking-wide leading-none drop-shadow">
        1 to 18
      </span>

      {renderChipBadge('1-18')}
    </button>

    {/* EVEN */}
    <button
      type="button"
      onClick={() => handlePlaceBet('EVEN')}
      className="relative flex items-center justify-center cursor-pointer overflow-hidden"
    >
      <span className="text-[19px] sm:text-[27px] font-black text-white leading-none drop-shadow">
        Even
      </span>

      {renderChipBadge('EVEN')}
    </button>

    {/* RED */}
    <button
      type="button"
      onClick={() => handlePlaceBet('RED')}
      className="relative flex items-center justify-center cursor-pointer overflow-hidden"
    >
      <img
  src={redDiamondImg}
  alt="Red"
  className="h-[100%] w-[150px] object-fill drop-shadow"
/>

      {renderChipBadge('RED')}
    </button>

    {/* BLACK */}
    <button
      type="button"
      onClick={() => handlePlaceBet('BLACK')}
      className="relative flex items-center justify-center cursor-pointer overflow-hidden"
    >
      <img
        src={blackDiamondImg}
        alt="Black"
        className="h-[100%] w-[85%] object-fill drop-shadow mr-5"
      />

      {renderChipBadge('BLACK')}
    </button>

    {/* ODD */}
    <button
      type="button"
      onClick={() => handlePlaceBet('ODD')}
      className="relative flex items-center justify-center cursor-pointer overflow-hidden"
    >
      <span className="text-[19px] sm:text-[27px] font-black text-white tracking-wide leading-none drop-shadow">
        Odd
      </span>

      {renderChipBadge('ODD')}
    </button>

    {/* 19 to 36 */}
    <button
      type="button"
      onClick={() => handlePlaceBet('19-36')}
      className="relative flex items-center justify-center cursor-pointer overflow-hidden"
    >
      <span className="text-[17px] sm:text-[25px] font-black text-white tracking-wide leading-none drop-shadow whitespace-nowrap">
        19 to 36
      </span>

      {renderChipBadge('19-36')}
    </button>

  </div>

</div>
</div>
      </div>


      <div className="relative z-20 flex w-full items-end justify-between px-4 pb-2 -mt-5">
        <div className="flex flex-col  gap-2.5 -mt-4">
  <button
    type="button"
    className="cursor-pointer transition  ml-8"
  >
    <img
      src={infoIcon}
      alt="Info"
      className="h-8 w-8 sm:h-11 sm:w-17  drop-shadow"
    />
  </button>

  <div className="relative h-[32px] w-[160px] sm:h-[35px] sm:w-[230px] flex items-center justify-center">
    <img
      src={extraboxleft}
      alt="Total Bet Pill"
      className="h-full w-full object-fill"
    />

    <span className="absolute top-2  text-[13px] sm:text-[15px] font-bold text-white drop-shadow">
      Total Bet: {totalBet}
    </span>
  </div>
</div>

        <div className="relative h-[36px] w-[660px] sm:h-[45px] sm:w-[950px] flex items-center justify-center">
          <img src={extraLower} alt="Marquee Bar" className="h-full w-full object-fill mt-4 " />
          <span className="absolute text-[13px] sm:text-[15px] font-bold tracking-wide text-[#3bfb22] top-5 drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]">
            {statusMessage}
          </span>
        </div>

        <div>
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className="relative h-[32px] w-[145px] sm:h-[35px] sm:w-[160px] flex items-center justify-center cursor-pointer transition "
          >
            <img src={noDesignPill} alt="Leave Table" className="h-full w-full object-fill" />
            <span className="absolute text-[13px] sm:text-[14px] font-bold text-white drop-shadow">
              Leave Table
            </span>
          </button>
        </div>
      </div>
    </div>
  )
}
