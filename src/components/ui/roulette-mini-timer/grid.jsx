import React from 'react'

import chip2 from '../../../assets/timer_36/2.png'
import chip5 from '../../../assets/timer_36/5.png'
import chip10 from '../../../assets/timer_36/ten.png'
import chip50 from '../../../assets/timer_36/50.png'
import chip100 from '../../../assets/timer_36/100.png'
import chip500 from '../../../assets/timer_36/500.png'
import chip1000 from '../../../assets/timer_36/one_k.png'
import chip3000 from '../../../assets/timer_36/three_k.png'

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

/**
 * 8 Chips situated in the wooden groove at bottom-right of roulettemini.png
 */
export const CHIPS = [
  {
    value: 2,
    label: '2',
    left: '48.5%',
    top: '90.2%',
    width: '56px',
    height: '56px',
    transform: 'translate(-55%, -65%) rotateX(59deg)',
    borderInset: '-inset-4',
    borderTransform: '',
  },
  {
    value: 5,
    label: '5',
    left: '52.7%',
    top: '85.6%',
    width: '56px',
    height: '56px',
    transform: 'translate(-55%, -61%) rotateX(59deg)',
    borderInset: '-inset-3',
    borderTransform: '',
  },
  {
    value: 10,
    label: '10',
    left: '56.8%',
    top: '81.4%',
    width: '56px',
    height: '56px',
    transform: 'translate(-55%, -57%) rotateX(59deg)',
    borderInset: '-inset-2.5',
    borderTransform: '',
  },
  {
    value: 50,
    label: '50',
    left: '60.8%',
    top: '77.2%',
    width: '56px',
    height: '56px',
    transform: 'translate(-55%, -50%) rotateX(59deg)',
    borderInset: '-inset-3',
    borderTransform: '',
  },
  {
    value: 100,
    label: '100',
    left: '64.6%',
    top: '73.4%',
    width: '56px',
    height: '56px',
    transform: 'translate(-55%, -50%) rotateX(59deg)',
    borderInset: '-inset-2.5',
    borderTransform: '',
  },
  {
    value: 500,
    label: '500',
    left: '68.2%',
    top: '69.8%',
    width: '56px',
    height: '56px',
    transform: 'translate(-55%, -50%) rotateX(59deg)',
    borderInset: '-inset-2.5',
    borderTransform: '',
  },
  {
    value: 1000,
    label: '1k',
    left: '71.6%',
    top: '66.2%',
    width: '56px',
    height: '56px',
    transform: 'translate(-52%, -49%) rotateX(59deg)',
    borderInset: '-inset-2',
    borderTransform: '',
  },
  {
    value: 3000,
    label: '3k',
    left: '75.0%',
    top: '62.8%',
    width: '56px',
    height: '56px',
    transform: 'translate(-52%, -47%) rotateX(59deg)',
    borderInset: '-inset-2',
    borderTransform: '',
  },
]

export const RED_NUMBERS = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36]
export const BLACK_NUMBERS = [2, 4, 6, 8, 10, 11, 13, 15, 17, 20, 22, 24, 26, 28, 29, 31, 33, 35]

export const getChipAsset = (value) => {
  return CHIP_IMAGES[value] || CHIP_IMAGES[2]
}

/**
 * Placed chip component matching the exact table perspective:
 * - Lies completely flat on the felt table
 * - Formatted to cover the red/black oval number area
 */
export function PlacedChip({
  amount,
  chipValue,
  width = '100%',
  height = '100%',
  size,
  rotate,
  isSmall = false,
}) {
  if (!amount || amount <= 0) return null

  const isHelmet = chipValue === 10 || chipValue === 1000 || chipValue === 3000
  const displayAmount =
    amount >= 1000 && amount % 1000 === 0
      ? `${amount / 1000}k`
      : amount >= 1000
        ? `${(amount / 1000).toFixed(1)}k`
        : amount

  const chipImg = getChipAsset(chipValue || amount)
  const finalWidth = size ? `${size}px` : (typeof width === 'number' ? `${width}px` : width)
  const finalHeight = size ? `${size}px` : (typeof height === 'number' ? `${height}px` : height)

  const calcFontSize = () => {
    if (isSmall) {
      if (String(displayAmount).length >= 4) return '13px'
      if (String(displayAmount).length >= 3) return '16px'
      if (String(displayAmount).length >= 2) return '22px'
      return '28px'
    }
    if (String(displayAmount).length >= 4) return '14px'
    if (String(displayAmount).length >= 3) return '17px'
    if (String(displayAmount).length >= 2) return '25px'
    return '32px'
  }

  return (
    <div
      className="pointer-events-none relative flex items-center justify-center select-none"
      style={{
        width: finalWidth,
        height: finalHeight,
        transform: rotate !== undefined ? `rotate(${rotate}deg)` : undefined,
        transformOrigin: 'center center',
      }}
    >
      <img
        src={chipImg}
        alt="Chip"
        className="h-full w-full object-fill select-none pointer-events-none"
      />
      <span
        className={`absolute font-semibold select-none text-black drop-shadow-none ${isHelmet ? 'pt-[2px]' : ''
          }`}
        style={{
          color: '#000000',
          fontSize: calcFontSize(),
          fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
          lineHeight: 1,
          letterSpacing: '-0.3px',
        }}
      >
        {displayAmount}
      </span>
    </div>
  )
}

/**
 * 3D Isometric Table Perspective Transform:
 * Matches the exact table slope, rotation, and skew from reference:
 * perspective(2000px) rotateX(30deg) rotateZ(-25deg) skewX(18deg) scale(1.10)
 */
export const BET_WIDTH = '45px'
export const BET_HEIGHT = '48px'
export const MULTI_BET_WIDTH = '41px'
export const MULTI_BET_HEIGHT = '44px'
export const BET_TRANSFORM = 'perspective(2000px) rotateX(50deg)  skewX(15deg) scale(1.10)'

export const EXACT_NUMBER_COORDINATES = {
  0: { left: '63.30%', top: '31.80%', width: BET_WIDTH, height: BET_HEIGHT, transform: BET_TRANSFORM },

  // Row 0 (Top row: 1, 4, 7, 10, 13, 16, 19, 22, 25, 28, 31, 34)
  1: { left: '54.30%', top: '29.05%', width: BET_WIDTH, height: BET_HEIGHT, transform: BET_TRANSFORM },
  4: { left: '51.20%', top: '31.20%', width: BET_WIDTH, height: BET_HEIGHT, transform: BET_TRANSFORM },
  7: { left: '48.30%', top: '33.80%', width: BET_WIDTH, height: BET_HEIGHT, transform: BET_TRANSFORM },
  10: { left: '44.80%', top: '36%', width: BET_WIDTH, height: BET_HEIGHT, transform: BET_TRANSFORM },
  13: { left: '41.50%', top: '38.40%', width: BET_WIDTH, height: BET_HEIGHT, transform: BET_TRANSFORM },
  16: { left: '38%', top: '41%', width: BET_WIDTH, height: BET_HEIGHT, transform: BET_TRANSFORM },
  19: { left: '34.40%', top: '43.80%', width: BET_WIDTH, height: BET_HEIGHT, transform: BET_TRANSFORM },
  22: { left: '30.80%', top: '46.60%', width: BET_WIDTH, height: BET_HEIGHT, transform: BET_TRANSFORM },
  25: { left: '26.90%', top: '49.30%', width: BET_WIDTH, height: BET_HEIGHT, transform: BET_TRANSFORM },
  28: { left: '23%', top: '52.10%', width: BET_WIDTH, height: BET_HEIGHT, transform: BET_TRANSFORM },
  31: { left: '18.80%', top: '55.10%', width: BET_WIDTH, height: BET_HEIGHT, transform: BET_TRANSFORM },
  34: { left: '14.60%', top: '58.30%', width: BET_WIDTH, height: BET_HEIGHT, transform: BET_TRANSFORM },

  // Row 1 (Middle row: 2, 5, 8, 11, 14, 17, 20, 23, 26, 29, 32, 35)
  2: { left: '59.80%', top: '34.35%', width: BET_WIDTH, height: BET_HEIGHT, transform: BET_TRANSFORM },
  5: { left: '56.50%', top: '36.70%', width: BET_WIDTH, height: BET_HEIGHT, transform: BET_TRANSFORM },
  8: { left: '53.40%', top: '39.40%', width: BET_WIDTH, height: BET_HEIGHT, transform: BET_TRANSFORM },
  11: { left: '49.95%', top: '41.70%', width: BET_WIDTH, height: BET_HEIGHT, transform: BET_TRANSFORM },
  14: { left: '46.65%', top: '44.50%', width: BET_WIDTH, height: BET_HEIGHT, transform: BET_TRANSFORM },
  17: { left: '43.15%', top: '47.20%', width: BET_WIDTH, height: BET_HEIGHT, transform: BET_TRANSFORM },
  20: { left: '39.50%', top: '50%', width: BET_WIDTH, height: BET_HEIGHT, transform: BET_TRANSFORM },
  23: { left: '35.70%', top: '53%', width: BET_WIDTH, height: BET_HEIGHT, transform: BET_TRANSFORM },
  26: { left: '31.79%', top: '56%', width: BET_WIDTH, height: BET_HEIGHT, transform: BET_TRANSFORM },
  29: { left: '27.80%', top: '59%', width: BET_WIDTH, height: BET_HEIGHT, transform: BET_TRANSFORM },
  32: { left: '23.65%', top: '62.40%', width: BET_WIDTH, height: BET_HEIGHT, transform: BET_TRANSFORM },
  35: { left: '19.40%', top: '65.70%', width: BET_WIDTH, height: BET_HEIGHT, transform: BET_TRANSFORM },

  // Row 2 (Bottom row: 3, 6, 9, 12, 15, 18, 21, 24, 27, 30, 33, 36)
  3: { left: '65%', top: '39.80%', width: BET_WIDTH, height: BET_HEIGHT, transform: BET_TRANSFORM },
  6: { left: '61.90%', top: '42.50%', width: BET_WIDTH, height: BET_HEIGHT, transform: BET_TRANSFORM },
  9: { left: '58.70%', top: '45%', width: BET_WIDTH, height: BET_HEIGHT, transform: BET_TRANSFORM },
  12: { left: '55.60%', top: '48%', width: BET_WIDTH, height: BET_HEIGHT, transform: BET_TRANSFORM },
  15: { left: '52.20%', top: '51%', width: BET_WIDTH, height: BET_HEIGHT, transform: BET_TRANSFORM },
  18: { left: '48.50%', top: '53.80%', width: BET_WIDTH, height: BET_HEIGHT, transform: BET_TRANSFORM },
  21: { left: '44.80%', top: '56.80%', width: BET_WIDTH, height: BET_HEIGHT, transform: BET_TRANSFORM },
  24: { left: '41%', top: '59.70%', width: BET_WIDTH, height: BET_HEIGHT, transform: BET_TRANSFORM },
  27: { left: '37.20%', top: '63.30%', width: BET_WIDTH, height: BET_HEIGHT, transform: BET_TRANSFORM },
  30: { left: '33.20%', top: '66.70%', width: BET_WIDTH, height: BET_HEIGHT, transform: BET_TRANSFORM },
  33: { left: '28.85%', top: '70%', width: BET_WIDTH, height: BET_HEIGHT, transform: BET_TRANSFORM },
  36: { left: '24.50%', top: '73.80%', width: BET_WIDTH, height: BET_HEIGHT, transform: BET_TRANSFORM },
}

export const getNumberCoordinates = (num) => {
  return EXACT_NUMBER_COORDINATES[num] || {
    left: '50%',
    top: '50%',
    width: BET_WIDTH,
    height: BET_HEIGHT,
    transform: BET_TRANSFORM,
  }
}

export const OUTSIDE_BETS = [
  { key: '1st 12', label: '1st 12', left: '66.80%', top: '50.50%', width: '7.5%', height: '6.0%', rotate: -33.5 },
  { key: '2nd 12', label: '2nd 12', left: '52.30%', top: '63.40%', width: '8.5%', height: '6.8%', rotate: -33.5 },
  { key: '3rd 12', label: '3rd 12', left: '36.50%', top: '77.50%', width: '9.5%', height: '7.6%', rotate: -33.5 },
  { key: '1to18', label: '1 to 18', left: '75%', top: '53%', width: '4.5%', height: '4.0%', rotate: -33.5 },
  { key: 'EVEN', label: 'EVEN', left: '68.60%', top: '59%', width: '5.2%', height: '4.4%', rotate: -33.5 },
  { key: 'BLACK', label: 'BLACK', left: '61.50%', top: '66%', width: '5.2%', height: '4.6%', rotate: -33.5 },
  { key: 'RED', label: 'RED', left: '54.0%', top: '73%', width: '5.4%', height: '4.8%', rotate: -33.5 },
  { key: 'ODD', label: 'ODD', left: '46.30%', top: '80.40%', width: '5.6%', height: '5.0%', rotate: -33.5 },
  { key: '19to36', label: '19 to 36', left: '37.60%', top: '88.50%', width: '6.2%', height: '5.5%', rotate: -33.5 },
  { key: '2to1_1', label: '2 to 1 (Top)', left: '10%', top: '62.70%', width: '5.5%', height: '6.2%', rotate: -33.5 },
  { key: '2to1_2', label: '2 to 1 (Mid)', left: '14.70%', top: '69.80%', width: '5.5%', height: '6.2%', rotate: -33.5 },
  { key: '2to1_3', label: '2 to 1 (Bot)', left: '19.60%', top: '78.5%', width: '5.5%', height: '6.2%', rotate: -33.5 },
]

// =========================================================
// MULTI-NUMBER INSIDE BETS (Same as FunRoulette.jsx)
// =========================================================

// Helper to calculate midpoint between 2 numbers
const getSplitCoord = (n1, n2) => {
  const c1 = EXACT_NUMBER_COORDINATES[n1]
  const c2 = EXACT_NUMBER_COORDINATES[n2]
  return {
    left: `${((parseFloat(c1.left) + parseFloat(c2.left)) / 2).toFixed(2)}%`,
    top: `${((parseFloat(c1.top) + parseFloat(c2.top)) / 2).toFixed(2)}%`,
  }
}

// Helper to calculate centroid of 4 numbers
const getCornerCoord = (n1, n2, n3, n4) => {
  const c1 = EXACT_NUMBER_COORDINATES[n1]
  const c2 = EXACT_NUMBER_COORDINATES[n2]
  const c3 = EXACT_NUMBER_COORDINATES[n3]
  const c4 = EXACT_NUMBER_COORDINATES[n4]
  return {
    left: `${((parseFloat(c1.left) + parseFloat(c2.left) + parseFloat(c3.left) + parseFloat(c4.left)) / 4).toFixed(2)}%`,
    top: `${((parseFloat(c1.top) + parseFloat(c2.top) + parseFloat(c3.top) + parseFloat(c4.top)) / 4).toFixed(2)}%`,
  }
}

// Helper to calculate street coordinate (bottom edge of 3-number column)
const getStreetCoord = (nTop, nMid, nBot) => {
  const cMid = EXACT_NUMBER_COORDINATES[nMid]
  const cBot = EXACT_NUMBER_COORDINATES[nBot]
  const dLeft = parseFloat(cBot.left) - parseFloat(cMid.left)
  const dTop = parseFloat(cBot.top) - parseFloat(cMid.top)
  return {
    left: `${(parseFloat(cBot.left) + dLeft * 0.48).toFixed(2)}%`,
    top: `${(parseFloat(cBot.top) + dTop * 0.48).toFixed(2)}%`,
  }
}

/**
 * 2 NUMBER BETS (SPLIT BETS - 57 Spots)
 */
export const SPLIT_BETS = [
  // Horizontal Splits between Row 0 & Row 1 (1-2, 4-5, ...)
  ...[
    [1, 2], [4, 5], [7, 8], [10, 11], [13, 14], [16, 17],
    [19, 20], [22, 23], [25, 26], [28, 29], [31, 32], [34, 35],
  ].map(([a, b]) => ({
    key: `${a}-${b}`,
    label: `Split ${a}-${b}`,
    numbers: [a, b],
    ...getSplitCoord(a, b),
  })),

  // Horizontal Splits between Row 1 & Row 2 (2-3, 5-6, ...)
  ...[
    [2, 3], [5, 6], [8, 9], [11, 12], [14, 15], [17, 18],
    [20, 21], [23, 24], [26, 27], [29, 30], [32, 33], [35, 36],
  ].map(([a, b]) => ({
    key: `${a}-${b}`,
    label: `Split ${a}-${b}`,
    numbers: [a, b],
    ...getSplitCoord(a, b),
  })),

  // Vertical Column Splits in Row 0 (Top Row: 1-4, 4-7, ...)
  ...[
    [1, 4], [4, 7], [7, 10], [10, 13], [13, 16], [16, 19],
    [19, 22], [22, 25], [25, 28], [28, 31], [31, 34],
  ].map(([a, b]) => ({
    key: `${a}-${b}`,
    label: `Split ${a}-${b}`,
    numbers: [a, b],
    ...getSplitCoord(a, b),
  })),

  // Vertical Column Splits in Row 1 (Middle Row: 2-5, 5-8, ...)
  ...[
    [2, 5], [5, 8], [8, 11], [11, 14], [14, 17], [17, 20],
    [20, 23], [23, 26], [26, 29], [29, 32], [32, 35],
  ].map(([a, b]) => ({
    key: `${a}-${b}`,
    label: `Split ${a}-${b}`,
    numbers: [a, b],
    ...getSplitCoord(a, b),
  })),

  // Vertical Column Splits in Row 2 (Bottom Row: 3-6, 6-9, ...)
  ...[
    [3, 6], [6, 9], [9, 12], [12, 15], [15, 18], [18, 21],
    [21, 24], [24, 27], [27, 30], [30, 33], [33, 36],
  ].map(([a, b]) => ({
    key: `${a}-${b}`,
    label: `Split ${a}-${b}`,
    numbers: [a, b],
    ...getSplitCoord(a, b),
  })),
]

/**
 * 4 NUMBER BETS (CORNER / SQUARE BETS - 22 Spots)
 */
export const CORNER_BETS = [
  // Between Row 0 & Row 1 (1-2-4-5, 4-5-7-8, ...)
  ...[
    [1, 2, 4, 5],
    [4, 5, 7, 8],
    [7, 8, 10, 11],
    [10, 11, 13, 14],
    [13, 14, 16, 17],
    [16, 17, 19, 20],
    [19, 20, 22, 23],
    [22, 23, 25, 26],
    [25, 26, 28, 29],
    [28, 29, 31, 32],
    [31, 32, 34, 35],
  ].map(([a, b, c, d]) => ({
    key: `${a}-${b}-${c}-${d}`,
    label: `Corner ${a}-${b}-${c}-${d}`,
    numbers: [a, b, c, d],
    ...getCornerCoord(a, b, c, d),
  })),

  // Between Row 1 & Row 2 (2-3-5-6, 5-6-8-9, ...)
  ...[
    [2, 3, 5, 6],
    [5, 6, 8, 9],
    [8, 9, 11, 12],
    [11, 12, 14, 15],
    [14, 15, 17, 18],
    [17, 18, 20, 21],
    [20, 21, 23, 24],
    [23, 24, 26, 27],
    [26, 27, 29, 30],
    [29, 30, 32, 33],
    [32, 33, 35, 36],
  ].map(([a, b, c, d]) => ({
    key: `${a}-${b}-${c}-${d}`,
    label: `Corner ${a}-${b}-${c}-${d}`,
    numbers: [a, b, c, d],
    ...getCornerCoord(a, b, c, d),
  })),
]

/**
 * 3 NUMBER BETS (STREET BETS - 12 Spots)
 */
const STREET_COLS = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9],
  [10, 11, 12],
  [13, 14, 15],
  [16, 17, 18],
  [19, 20, 21],
  [22, 23, 24],
  [25, 26, 27],
  [28, 29, 30],
  [31, 32, 33],
  [34, 35, 36],
]

export const STREET_BETS = STREET_COLS.map(([a, b, c]) => ({
  key: `${a}-${b}-${c}`,
  label: `Street ${a}-${b}-${c}`,
  numbers: [a, b, c],
  ...getStreetCoord(a, b, c),
}))

/**
 * 6 NUMBER BETS (SIX LINE / TWO COLUMN BETS - 11 Spots)
 */
export const LINE_BETS = STREET_COLS.slice(0, -1).map((col1, i) => {
  const col2 = STREET_COLS[i + 1]
  const s1 = STREET_BETS[i]
  const s2 = STREET_BETS[i + 1]
  const key = `${col1.join('-')}-${col2.join('-')}`
  return {
    key,
    label: `Line ${key}`,
    numbers: [...col1, ...col2],
    left: `${((parseFloat(s1.left) + parseFloat(s2.left)) / 2).toFixed(2)}%`,
    top: `${((parseFloat(s1.top) + parseFloat(s2.top)) / 2).toFixed(2)}%`,
  }
})
