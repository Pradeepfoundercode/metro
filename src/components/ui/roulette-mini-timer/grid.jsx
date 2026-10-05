
import React, { useState } from 'react'

import chip2 from '../../../assets/timer_36/2.png'
import chip5 from '../../../assets/timer_36/5.png'
import chip10 from '../../../assets/timer_36/ten.png'
import chip50 from '../../../assets/timer_36/50.png'
import chip100 from '../../../assets/timer_36/100.png'
import chip500 from '../../../assets/timer_36/500.png'
import chip1000 from '../../../assets/timer_36/one_k.png'
import chip3000 from '../../../assets/timer_36/three_k.png'

const RED_NUMBERS = new Set([
  1, 3, 5, 7, 9,
  12, 14, 16, 18,
  19, 21, 23, 25, 27,
  30, 32, 34, 36,
])

export const CHIP_LABELS = {
  2: '2',
  5: '5',
  10: '10',
  50: '50',
  100: '100',
  500: '500',
  1000: '1k',
  3000: '3k',
}

export const CHIP_IMAGES = {
  2: chip2,
  5: chip5,
  10: chip10,
  50: chip50,
  100: chip100,
  500: chip500,
  1000: chip1000,
  3000: chip3000,
}

export const CHIP_VALUES = [
  2,
  5,
  10,
  50,
  100,
  500,
  1000,
  3000,
]

const GRID_COLUMNS = [
  { top: 34, middle: 35, bottom: 36 },
  { top: 31, middle: 32, bottom: 33 },
  { top: 28, middle: 29, bottom: 30 },
  { top: 25, middle: 26, bottom: 27 },
  { top: 22, middle: 23, bottom: 24 },
  { top: 19, middle: 20, bottom: 21 },
  { top: 16, middle: 17, bottom: 18 },
  { top: 13, middle: 14, bottom: 15 },
  { top: 10, middle: 11, bottom: 12 },
  { top: 7, middle: 8, bottom: 9 },
  { top: 4, middle: 5, bottom: 6 },
  { top: 1, middle: 2, bottom: 3 },
]

const ROWS = ['top', 'middle', 'bottom']

const COLUMN_BETS = [
  { key: 'col-0', label: '2 to 1' },
  { key: 'col-1', label: '2 to 1' },
  { key: 'col-2', label: '2 to 1' },
]

const DOZEN_BETS = [
  { key: '3rd12', label: '3rd 12' },
  { key: '2nd12', label: '2nd 12' },
  { key: '1st12', label: '1st 12' },
]

const OUTSIDE_BETS = [
  { key: '19-36', label: '19 to 36' },
  { key: 'odd', label: 'ODD' },
  { key: 'red', label: 'RED' },
  { key: 'black', label: 'BLACK' },
  { key: 'even', label: 'EVEN' },
  { key: '1-18', label: '1 to 18' },
]

const CORNER_BETS = [
  // Between Row 0 (top) & Row 1 (middle) - y = 110px
  { key: '31-32-34-35', colIndex: 0, y: 110 },
  { key: '28-29-31-32', colIndex: 1, y: 110 },
  { key: '25-26-28-29', colIndex: 2, y: 110 },
  { key: '22-23-25-26', colIndex: 3, y: 110 },
  { key: '19-20-22-23', colIndex: 4, y: 110 },
  { key: '16-17-19-20', colIndex: 5, y: 110 },
  { key: '13-14-16-17', colIndex: 6, y: 110 },
  { key: '10-11-13-14', colIndex: 7, y: 110 },
  { key: '7-8-10-11',   colIndex: 8, y: 110 },
  { key: '4-5-7-8',     colIndex: 9, y: 110 },
  { key: '1-2-4-5',     colIndex: 10, y: 110 },

  // Between Row 1 (middle) & Row 2 (bottom) - y = 220px
  { key: '32-33-35-36', colIndex: 0, y: 220 },
  { key: '29-30-32-33', colIndex: 1, y: 220 },
  { key: '26-27-29-30', colIndex: 2, y: 220 },
  { key: '23-24-26-27', colIndex: 3, y: 220 },
  { key: '20-21-23-24', colIndex: 4, y: 220 },
  { key: '17-18-20-21', colIndex: 5, y: 220 },
  { key: '14-15-17-18', colIndex: 6, y: 220 },
  { key: '11-12-14-15', colIndex: 7, y: 220 },
  { key: '8-9-11-12',   colIndex: 8, y: 220 },
  { key: '5-6-8-9',     colIndex: 9, y: 220 },
  { key: '2-3-5-6',     colIndex: 10, y: 220 },
]

const SPLIT_BETS = [
  // ==========================================
  // ROW SPLITS - Between Row 0 (top) & Row 1 (middle) - y = 110px
  // ==========================================
  { key: '34-35', colIndex: 0,  y: 110, isHorizontal: true },
  { key: '31-32', colIndex: 1,  y: 110, isHorizontal: true },
  { key: '28-29', colIndex: 2,  y: 110, isHorizontal: true },
  { key: '25-26', colIndex: 3,  y: 110, isHorizontal: true },
  { key: '22-23', colIndex: 4,  y: 110, isHorizontal: true },
  { key: '19-20', colIndex: 5,  y: 110, isHorizontal: true },
  { key: '16-17', colIndex: 6,  y: 110, isHorizontal: true },
  { key: '13-14', colIndex: 7,  y: 110, isHorizontal: true },
  { key: '10-11', colIndex: 8,  y: 110, isHorizontal: true },
  { key: '7-8',   colIndex: 9,  y: 110, isHorizontal: true },
  { key: '4-5',   colIndex: 10, y: 110, isHorizontal: true },
  { key: '1-2',   colIndex: 11, y: 110, isHorizontal: true },

  // ==========================================
  // ROW SPLITS - Between Row 1 (middle) & Row 2 (bottom) - y = 220px
  // ==========================================
  { key: '35-36', colIndex: 0,  y: 220, isHorizontal: true },
  { key: '32-33', colIndex: 1,  y: 220, isHorizontal: true },
  { key: '29-30', colIndex: 2,  y: 220, isHorizontal: true },
  { key: '26-27', colIndex: 3,  y: 220, isHorizontal: true },
  { key: '23-24', colIndex: 4,  y: 220, isHorizontal: true },
  { key: '20-21', colIndex: 5,  y: 220, isHorizontal: true },
  { key: '17-18', colIndex: 6,  y: 220, isHorizontal: true },
  { key: '14-15', colIndex: 7,  y: 220, isHorizontal: true },
  { key: '11-12', colIndex: 8,  y: 220, isHorizontal: true },
  { key: '8-9',   colIndex: 9,  y: 220, isHorizontal: true },
  { key: '5-6',   colIndex: 10, y: 220, isHorizontal: true },
  { key: '2-3',   colIndex: 11, y: 220, isHorizontal: true },

  // ==========================================
  // COLUMN SPLITS - Row 0 (top) - y = 55px
  // ==========================================
  { key: '31-34', colIndex: 0,  y: 55, isHorizontal: false },
  { key: '28-31', colIndex: 1,  y: 55, isHorizontal: false },
  { key: '25-28', colIndex: 2,  y: 55, isHorizontal: false },
  { key: '22-25', colIndex: 3,  y: 55, isHorizontal: false },
  { key: '19-22', colIndex: 4,  y: 55, isHorizontal: false },
  { key: '16-19', colIndex: 5,  y: 55, isHorizontal: false },
  { key: '13-16', colIndex: 6,  y: 55, isHorizontal: false },
  { key: '10-13', colIndex: 7,  y: 55, isHorizontal: false },
  { key: '7-10',  colIndex: 8,  y: 55, isHorizontal: false },
  { key: '4-7',   colIndex: 9,  y: 55, isHorizontal: false },
  { key: '1-4',   colIndex: 10, y: 55, isHorizontal: false },

  // ==========================================
  // COLUMN SPLITS - Row 1 (middle) - y = 165px
  // ==========================================
  { key: '32-35', colIndex: 0,  y: 165, isHorizontal: false },
  { key: '29-32', colIndex: 1,  y: 165, isHorizontal: false },
  { key: '26-29', colIndex: 2,  y: 165, isHorizontal: false },
  { key: '23-26', colIndex: 3,  y: 165, isHorizontal: false },
  { key: '20-23', colIndex: 4,  y: 165, isHorizontal: false },
  { key: '17-20', colIndex: 5,  y: 165, isHorizontal: false },
  { key: '14-17', colIndex: 6,  y: 165, isHorizontal: false },
  { key: '11-14', colIndex: 7,  y: 165, isHorizontal: false },
  { key: '8-11',  colIndex: 8,  y: 165, isHorizontal: false },
  { key: '5-8',   colIndex: 9,  y: 165, isHorizontal: false },
  { key: '2-5',   colIndex: 10, y: 165, isHorizontal: false },

  // ==========================================
  // COLUMN SPLITS - Row 2 (bottom) - y = 275px
  // ==========================================
  { key: '33-36', colIndex: 0,  y: 275, isHorizontal: false },
  { key: '30-33', colIndex: 1,  y: 275, isHorizontal: false },
  { key: '27-30', colIndex: 2,  y: 275, isHorizontal: false },
  { key: '24-27', colIndex: 3,  y: 275, isHorizontal: false },
  { key: '21-24', colIndex: 4,  y: 275, isHorizontal: false },
  { key: '18-21', colIndex: 5,  y: 275, isHorizontal: false },
  { key: '15-18', colIndex: 6,  y: 275, isHorizontal: false },
  { key: '12-15', colIndex: 7,  y: 275, isHorizontal: false },
  { key: '9-12',  colIndex: 8,  y: 275, isHorizontal: false },
  { key: '6-9',   colIndex: 9,  y: 275, isHorizontal: false },
  { key: '3-6',   colIndex: 10, y: 275, isHorizontal: false },
]

// ==========================================
// 3 NUMBER / STREET BETS (Bottom edge of each column) - y = 330px
// ==========================================
const STREET_BETS = [
  { key: '34-35-36', colIndex: 0 },
  { key: '31-32-33', colIndex: 1 },
  { key: '28-29-30', colIndex: 2 },
  { key: '25-26-27', colIndex: 3 },
  { key: '22-23-24', colIndex: 4 },
  { key: '19-20-21', colIndex: 5 },
  { key: '16-17-18', colIndex: 6 },
  { key: '13-14-15', colIndex: 7 },
  { key: '10-11-12', colIndex: 8 },
  { key: '7-8-9',     colIndex: 9 },
  { key: '4-5-6',     colIndex: 10 },
  { key: '1-2-3',     colIndex: 11 },
]

// ==========================================
// 6 NUMBER / TWO COLUMN (LINE) BETS (Bottom edge between columns) - y = 330px
// ==========================================
const LINE_BETS = [
  { key: '31-32-33-34-35-36', colIndex: 0 },
  { key: '28-29-30-31-32-33', colIndex: 1 },
  { key: '25-26-27-28-29-30', colIndex: 2 },
  { key: '22-23-24-25-26-27', colIndex: 3 },
  { key: '19-20-21-22-23-24', colIndex: 4 },
  { key: '16-17-18-19-20-21', colIndex: 5 },
  { key: '13-14-15-16-17-18', colIndex: 6 },
  { key: '10-11-12-13-14-15', colIndex: 7 },
  { key: '7-8-9-10-11-12',    colIndex: 8 },
  { key: '4-5-6-7-8-9',        colIndex: 9 },
  { key: '1-2-3-4-5-6',        colIndex: 10 },
]


export function PlacedChip({
  amount,
  chipValue,
  size = 30,
}) {
  if (!amount) return null

  const isHelmet = chipValue === 10 || chipValue === 1000 || chipValue === 3000
  const displayAmount = amount >= 1000 && amount % 1000 === 0 ? `${amount / 1000}k` : amount

  return (
    <div
      className="
        pointer-events-none
        absolute
        left-1/2
        z-[100]
        -translate-x-1/2
      "
    >
      <div
        className="
          relative
          flex
          items-center
          justify-center
          rounded-full
          border-[3px]
          border-white
        "
        style={{
          width: `${size + 8}px`,
          height: `${size + 8}px`,
          boxShadow: '0 2px 5px rgba(0,0,0,0.9)',
        }}
      >
        <img
          src={CHIP_IMAGES[chipValue]}
          alt=""
          className="h-full w-full rounded-full object-contain"
        />

        <span
          className={`
            pointer-events-none
            absolute
            inset-0
            z-10
            flex
            items-center
            justify-center
            font-black
            text-black
            leading-none
            ${isHelmet ? 'pt-[3px]' : ''}
            ${String(displayAmount).length >= 4 ? 'text-[17px]' : String(displayAmount).length >= 3 ? 'text-[12px]' : 'text-[15px]'}
          `}
        >
          {displayAmount}
        </span>
      </div>
    </div>
  )
}

export default function RouletteGrid({
  selectedChip = 2,
  onBet = () => {},
  onChipChange = () => {},
  bets: externalBets,
  betChips: externalBetChips,
  isLocked = false,
}) {
  const [internalBets, setInternalBets] = useState({})
  const [internalBetChips, setInternalBetChips] = useState({})

  const bets = externalBets !== undefined ? externalBets : internalBets
  const betChips = externalBetChips !== undefined ? externalBetChips : internalBetChips

  const placeBet = (key) => {
    onBet(key, selectedChip)

    if (isLocked) return

    if (externalBets === undefined) {
      setInternalBets((previous) => ({
        ...previous,
        [key]: (previous[key] || 0) + selectedChip,
      }))
      setInternalBetChips((previous) => ({
        ...previous,
        [key]: selectedChip,
      }))
    }
  }

  const getBet = (key) => {
    return bets[key] || 0
  }

  const getChip = (key) => {
    return betChips[key] || selectedChip
  }

  return (
    <div className="pointer-events-auto absolute left-0 top-0 select-none">
      <div
        className="
          relative
          w-[1160px]
          [transform:perspective(2000px)_rotateX(30deg)_rotateZ(-25deg)_skewX(18deg)_scale(1.10)]
          [transform-origin:32%_40%]
        "
      >
      
        <div className="flex w-[1050px]">
          <div className="grid w-[70px] shrink-0 grid-rows-3">
            {COLUMN_BETS.map(({ key, label }) => (
              <button
                key={key}
                type="button"
                onClick={() => placeBet(key)}
                className="
                  relative
                  flex
                  h-[110.5px]
                  w-full
                  items-center
                  justify-center
                  border-[4px]
                  border-white
                  bg-transparent
                  text-[21px]
                  font-black
                  text-white
                "
              >
                <span className="whitespace-nowrap">
                  {label}
                </span>

                <PlacedChip
                  amount={getBet(key)}
                  chipValue={getChip(key)}
                />
              </button>
            ))}
          </div>

          <div className="relative w-[850px] shrink-0">
            <div className="grid w-[850px] grid-cols-12">
              {GRID_COLUMNS.map((column, columnIndex) => (
                <div
                  key={columnIndex}
                  className="grid w-[75px] grid-rows-3"
                >
                  {ROWS.map((row) => {
                    const number = column[row]
                    const isRed = RED_NUMBERS.has(number)

                    return (
                      <button
                        key={number}
                        type="button"
                        onClick={() => placeBet(number)}
                        className="
                          relative
                          flex
                          h-[110px]
                          w-[75px]
                          items-center
                          justify-center
                          overflow-visible
                          border-[4px]
                          border-white
                          bg-transparent
                        "
                      >
                        <span
                          className={`
                            pointer-events-none
                            flex
                            h-[54px]
                            w-[68px]
                            items-center
                            justify-center
                            rounded-[50%]
                            text-[25px]
                            font-black
                            leading-none
                            text-white
                            ${
                              isRed
                                ? 'bg-[#ff1010]'
                                : 'bg-black'
                            }
                          `}
                        >
                          {number}
                        </span>

                        <PlacedChip
                          amount={getBet(number)}
                          chipValue={getChip(number)}
                        />
                      </button>
                    )
                  })}
                </div>
              ))}
            </div>

            {/* 2 NUMBER / SPLIT BETS */}
            {SPLIT_BETS.map(({ key, colIndex, y, isHorizontal }) => (
              <button
                key={key}
                type="button"
                onClick={() => placeBet(key)}
                style={{
                  left: isHorizontal
                    ? `${((colIndex + 0.5) / 12) * 100}%`
                    : `${((colIndex + 1) / 12) * 100}%`,
                  top: `${y}px`,
                }}
                className={`
                  pointer-events-auto
                  absolute
                  z-20
                  ${isHorizontal ? 'h-[26px] w-[46px]' : 'h-[46px] w-[26px]'}
                  -translate-x-1/2
                  -translate-y-1/2
                  cursor-pointer
                  items-center
                  justify-center
                  overflow-visible
                  bg-transparent
                  flex
                `}
              >
                <PlacedChip
                  amount={getBet(key)}
                  chipValue={getChip(key)}
                />
              </button>
            ))}

            {/* 4 NUMBER / CORNER BETS */}
            {CORNER_BETS.map(({ key, colIndex, y }) => (
              <button
                key={key}
                type="button"
                onClick={() => placeBet(key)}
                style={{
                  left: `${((colIndex + 1) / 12) * 100}%`,
                  top: `${y}px`,
                }}
                className="
                  pointer-events-auto
                  absolute
                  z-30
                  h-[38px]
                  w-[38px]
                  -translate-x-1/2
                  -translate-y-1/2
                  cursor-pointer
                  items-center
                  justify-center
                  rounded-full
                  overflow-visible
                  bg-transparent
                  flex
                "
              >
                <PlacedChip
                  amount={getBet(key)}
                  chipValue={getChip(key)}
                />
              </button>
            ))}

            {/* 3 NUMBER / STREET BETS */}
            {STREET_BETS.map(({ key, colIndex }) => (
              <button
                key={key}
                type="button"
                onClick={() => placeBet(key)}
                style={{
                  left: `${((colIndex + 0.5) / 12) * 100}%`,
                  top: '330px',
                }}
                className="
                  pointer-events-auto
                  absolute
                  z-20
                  h-[26px]
                  w-[46px]
                  -translate-x-1/2
                  -translate-y-1/2
                  cursor-pointer
                  items-center
                  justify-center
                  overflow-visible
                  bg-transparent
                  flex
                "
              >
                <PlacedChip
                  amount={getBet(key)}
                  chipValue={getChip(key)}
                />
              </button>
            ))}

            {/* 6 NUMBER / TWO COLUMN (LINE) BETS */}
            {LINE_BETS.map(({ key, colIndex }) => (
              <button
                key={key}
                type="button"
                onClick={() => placeBet(key)}
                style={{
                  left: `${((colIndex + 1) / 12) * 100}%`,
                  top: '330px',
                }}
                className="
                  pointer-events-auto
                  absolute
                  z-30
                  h-[38px]
                  w-[38px]
                  -translate-x-1/2
                  -translate-y-1/2
                  cursor-pointer
                  items-center
                  justify-center
                  rounded-full
                  overflow-visible
                  bg-transparent
                  flex
                "
              >
                <PlacedChip
                  amount={getBet(key)}
                  chipValue={getChip(key)}
                />
              </button>
            ))}
          </div>


          <div className="relative w-[110px] shrink-0">
            <button
              type="button"
              onClick={() => placeBet(0)}
              className="
                relative
                flex
                h-[331px]
                w-[110px]
                items-center
                justify-center
                overflow-visible
                bg-transparent
              "
            >
              <span
                className="pointer-events-none absolute inset-0"
                style={{
                  clipPath:
                    'polygon(0 0, 72% 0, 100% 50%, 56% 100%, 0 100%)',
                  background: 'white',
                }}
              />

              <span
                className="pointer-events-none absolute inset-[5px]"
                style={{
                  clipPath:
                    'polygon(0 0, 71.5% 0, 99% 50%, 56% 100%, 0 100%)',
                  background: '#003dac',
                }}
              />

              <span
                className="
                  pointer-events-none
                  relative
                  z-10
                  flex
                  h-[54px]
                  w-[72%]
                  items-center
                  justify-center
                  rounded-[50%]
                  bg-[#008b08]
                  text-[25px]
                  font-black
                  text-white
                "
              >
                0
              </span>

              <PlacedChip
                amount={getBet(0)}
                chipValue={getChip(0)}
              />
            </button>
          </div>
        </div>

        <div className="ml-[69px] mr-[235px] -mt-1 grid grid-cols-3">
          {DOZEN_BETS.map(({ key, label }) => (
            <button
              key={key}
              type="button"
              onClick={() => placeBet(key)}
              className="
                relative
                flex
                h-[95px]
                items-center
                justify-center
                border-[4px]
                border-white
                bg-transparent
                text-[34px]
                font-black
                text-white
              "
            >
              <span
                className="
                  pointer-events-none
                  absolute
                  inset-[8px]
                  border-[3px]
                  border-[#69c6ff]
                "
              />

              <span className="relative z-10">
                {label}
              </span>

              <PlacedChip
                amount={getBet(key)}
                chipValue={getChip(key)}
              />
            </button>
          ))}
        </div>

        <div className="ml-[68px] mr-[235px] grid grid-cols-6">
          {OUTSIDE_BETS.map(({ key, label }) => (
            <button
              key={key}
              type="button"
              onClick={() => placeBet(key)}
              className="
                relative
                flex
                h-[72px]
                items-center
                justify-center
                border-[3px]
                border-white
                bg-transparent
                text-[25px]
                font-black
                text-white
              "
            >
              {key === 'red' && (
                <span
                  className="h-[52px] w-[130px] bg-[#ff1010]"
                  style={{
                    clipPath:
                      'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
                  }}
                />
              )}

              {key === 'black' && (
                <span
                  className="h-[52px] w-[130px] bg-black"
                  style={{
                    clipPath:
                      'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
                  }}
                />
              )}

              {key !== 'red' && key !== 'black' && (
                <span className="relative z-10 whitespace-nowrap">
                  {label}
                </span>
              )}

              <PlacedChip
                amount={getBet(key)}
                chipValue={getChip(key)}
              />
            </button>
          ))}
        </div>

        <div className="mt-[15px] flex w-full justify-center">
          <div
            className="
              flex
              h-[70px]
              w-[550px]
              items-center
              justify-center
              rounded-t-[8px]
              border-x-[4px]
              border-t-[4px]
              border-white
              bg-transparent
            "
          >
            <div className="flex items-center justify-center gap-[8px] ">
              {CHIP_VALUES.map((value) => {
                const isSelected = selectedChip === value
                const label = CHIP_LABELS[value]
                const isHelmet = value === 10 || value === 1000 || value === 3000

                return (
                  <button
                    key={value}
                    type="button"
                    onClick={() => onChipChange(value)}
                    className={`
                      relative
                      flex
                      h-[45px]
                      w-[45px]
                      shrink-0
                      items-center
                      justify-center
                      rounded-full
                      transition-transform
                      duration-150
                      ${
                        isSelected
                          ? 'scale-[1.1]'
                          : 'scale-100'
                      }
                    `}
                  >
                    <img
                      src={CHIP_IMAGES[value]}
                      alt={`${label} chip`}
                      className="
                        relative
                        z-10
                        h-full
                        w-full
                        object-contain
                      "
                    />

                    <span
                      className={`
                        pointer-events-none
                        absolute
                        inset-0
                        z-20
                        flex
                        items-center
                        text-[17px]
                        justify-center
                        font-black
                        text-black
                        leading-none
                        ${isHelmet ? 'pt-[3px]' : ''}
                        
                      `}
                    >
                      {label}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
