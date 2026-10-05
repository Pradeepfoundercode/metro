import { GAME_ID_MAP } from "../constants/funRouletteData"

const EXTRA_MAP = {
  'col-0': 37,
  'col-1': 38,
  'col-2': 39,
  '1st12': 40,
  '2nd12': 41,
  '3rd12': 42,
  'odd': 44,
  'red': 45,
  'black': 46,
  'even': 47,
  '1-18': 48,
  '19-36': 43,
}

export const getGameId = (spot) => {
  if (GAME_ID_MAP[spot] !== undefined) {
    return GAME_ID_MAP[spot]
  }

  const str = String(spot)
  if (EXTRA_MAP[str] !== undefined) {
    return EXTRA_MAP[str]
  }

  const upper = str.toUpperCase()
  if (GAME_ID_MAP[upper] !== undefined) {
    return GAME_ID_MAP[upper]
  }

  const num = Number(spot)
  return isNaN(num) ? spot : num
}

export const createBetPayload = (betHistory, user, gameNo = '450538') => {
  if (!betHistory || betHistory.length === 0) return null

  const bets = betHistory.map((bet) => ({
    game_id: getGameId(bet.spot),
    amount: bet.amount,
  }))

  return {
    user_id: user?.id || '156',
    games_no: String(gameNo),
    bets,
  }
}
