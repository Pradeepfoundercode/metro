import gameTapSoundFile from '../assets/sounds/game_tap_sound.mp3'
import tickSoundFile from '../assets/sounds/tick.mp3'
import rouletteWheelNewSoundFile from '../assets/sounds/roulette_wheel_new.mp3'
import blueWheelSoundFile from '../assets/sounds/blue_wheel.mp3'
import coinSplash from '../assets/sounds/coin_splash.mp3'
import placeChipSound from '../assets/sounds/placechip.mp3'

let tapAudio = null
let lastPlayTime = 0

export const playGameTapSound = () => {
  try {
    const now = Date.now()
    if (now - lastPlayTime < 300) return

    if (!tapAudio) {
      tapAudio = new Audio(gameTapSoundFile)
    }
    tapAudio.currentTime = 0
    tapAudio.play().catch(() => {})
    lastPlayTime = now
  } catch (e) {
    // Autoplay restrictions or unsupported audio
  }
}

let tickAudio = null

export const playTickSound = () => {
  try {
    if (!tickAudio) {
      tickAudio = new Audio(tickSoundFile)
    }
    tickAudio.currentTime = 0
    tickAudio.play().catch(() => {})
  } catch (e) {
    // Autoplay restrictions or unsupported audio
  }
}

export const stopTickSound = () => {
  try {
    if (tickAudio) {
      tickAudio.pause()
      tickAudio.currentTime = 0
    }
  } catch (e) {
    // Autoplay restrictions or unsupported audio
  }
}

let rouletteWheelAudio = null

export const playRouletteWheelSound = () => {
  try {
    if (!rouletteWheelAudio) {
      rouletteWheelAudio = new Audio(rouletteWheelNewSoundFile)
    }
    rouletteWheelAudio.currentTime = 0
    rouletteWheelAudio.play().catch(() => {})
  } catch (e) {
    // Autoplay restrictions or unsupported audio
  }
}

export const stopRouletteWheelSound = () => {
  try {
    if (rouletteWheelAudio) {
      rouletteWheelAudio.pause()
      rouletteWheelAudio.currentTime = 0
    }
  } catch (e) {
    // Autoplay restrictions or unsupported audio
  }
}

let blueWheelAudio = null

export const playBlueWheelSound = () => {
  try {
    if (!blueWheelAudio) {
      blueWheelAudio = new Audio(blueWheelSoundFile)
    }
    blueWheelAudio.currentTime = 0
    blueWheelAudio.play().catch(() => {})
  } catch (e) {
    // Autoplay restrictions or unsupported audio
  }
}

export const stopBlueWheelSound = () => {
  try {
    if (blueWheelAudio) {
      blueWheelAudio.pause()
      blueWheelAudio.currentTime = 0
    }
  } catch (e) {
    // Autoplay restrictions or unsupported audio
  }
}

import moveChakraSoundFile from '../assets/sounds/movechakra.mp3'

let moveChakraAudio = null

export const playMoveChakraSound = () => {
  try {
    if (!moveChakraAudio) {
      moveChakraAudio = new Audio(moveChakraSoundFile)
    }
    moveChakraAudio.currentTime = 0
    moveChakraAudio.play().catch(() => {})
  } catch (e) {
    // Autoplay restrictions or unsupported audio
  }
}

export const stopMoveChakraSound = () => {
  try {
    if (moveChakraAudio) {
      moveChakraAudio.pause()
      moveChakraAudio.currentTime = 0
    }
  } catch (e) {
    // Autoplay restrictions or unsupported audio
  }
}








const coinSplashSound = new Audio(coinSplash)

export const playCoinSplashSound = () => {
  coinSplashSound.currentTime = 0
  coinSplashSound.play().catch(() => {})
}


const placeChipAudio = new Audio(placeChipSound)

export const playPlaceChipSound = () => {
  try {
    placeChipAudio.currentTime = 0
    placeChipAudio.play().catch(() => {})
  } catch (e) {
    // Autoplay restrictions or unsupported audio
  }
}