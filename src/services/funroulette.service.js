import API from './api'

export const getFunRouletteLast13Result = async (userId) => {
  const response = await API.get('/funroulette_last13_result', {
    params: {
      user_id: userId,
    },  
  })

  return response.data
}


export const getFunRouletteBetHistory = async (userId, limit = 5) => {
  const response = await API.get('/funroulet_bet_history', {
    params: {
      limit,
      user_id: userId,
    },
  })

  return response.data
}

export const placeFunRouletteBet = async(payload)=>{
  const response = await API.post("/funroulet36_bet", payload)
  return response.data
}