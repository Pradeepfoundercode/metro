import API from './api'
import { getDeviceId } from '../utils/device'

const USE_MOCK = true

export const loginUser = async ({ username, password }) => {
  if (USE_MOCK) {
    await new Promise((resolve) => {
      setTimeout(resolve, 500)
    })

    return {
      success: true,
      message: ' login successfully',
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
    await new Promise((resolve) => {
      setTimeout(resolve, 300)
    })

    const currentUsername = localStorage.getItem('username') || 'pradeep'

    return {
      success: true,
      message: 'User found..!',
      data: {
        id: userId,
        username: currentUsername,
        name: currentUsername,
        mobile: '0987654321',
        email: `${currentUsername}@gmail.com`,
        wallet: 8486,
        status: 1,
      },
    }
  }

  const response = await API.get(`/profile/${userId}`)

  return response.data
}