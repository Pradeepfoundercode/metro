import API from './api'

export const getFunTargetLastResult = async (userId) => {
  const response = await API.get('/fun_last_result', {
    params: {
      user_id: userId,
    },
  })
  return response.data
}

export const placeFunTargetBet = async (payload) => {
  const response = await API.post('/fun_target_bet', payload)
  return response.data
}

export const getFunTargetWinAmount = async (userId) => {
  const response = await API.get('/fun_win_amount', {
    params: {
      user_id: userId,
    },
  })
  return response.data
}

