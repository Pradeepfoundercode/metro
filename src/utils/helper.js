import { GAME_ID_MAP } from "../constants/funRouletteData"

export const getGameId = (spot) => {
  if (GAME_ID_MAP[spot] !== undefined) {
    return GAME_ID_MAP[spot]
  }

  return Number(spot)
}