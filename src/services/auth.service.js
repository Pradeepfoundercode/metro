import API from './api'
import { getDeviceId } from '../utils/device'

const USE_MOCK = true

export const loginUser = async ({ username, password }) => {
  if (USE_MOCK) {
    await new Promise((resolve) => setTimeout(resolve, 300))
    return {
      success: true,
      message: 'User login successfully',
      id: 155,
      device_id: getDeviceId(),
    }
  }

  const response = await API.post('/login', {
    username,
    password,
    device_id: getDeviceId(),
  })

  return response.data
}

export const getUserProfile = async (userId) => {
  if (USE_MOCK) {
    await new Promise((resolve) => setTimeout(resolve, 200))
    return {
      success: true,
      message: 'User found..!',
      data: {
        id: userId || 155,
        username: 'PLAYER',
        name: 'demo',
        mobile: '0987654321',
        email: 'player@gmail.com',
        wallet: 8486,
        status: 1,
      },
    }
  }

  const response = await API.get(`/profile/${userId}`)
  return response.data
}