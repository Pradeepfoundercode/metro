

const DEVICE_ID_KEY = 'deviceId'

export const getDeviceId = () => {
  let deviceId = localStorage.getItem(DEVICE_ID_KEY)

  if (!deviceId) {
    if (window.crypto?.randomUUID) {
      deviceId = window.crypto.randomUUID()
    } else {
      deviceId = `${Date.now()}-${Math.random()
        .toString(36)
        .substring(2)}`
    }

    localStorage.setItem(DEVICE_ID_KEY, deviceId)
  }

  return deviceId
}