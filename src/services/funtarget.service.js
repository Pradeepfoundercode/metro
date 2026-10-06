import API from './api'
import axios from 'axios'

export const placeFunTargetBet = async (payload) => {
  try {
    console.log(payload)
    // const response = await API.post('/fun_target_bet', payload)
    // return response.data
  } catch (error) {
    console.log(error)
  }
}
