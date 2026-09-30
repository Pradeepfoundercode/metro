const DEVICE_KEY = 'device_id'

export const getDeviceId = () => {
  let deviceId = localStorage.getItem(DEVICE_KEY)

  if (!deviceId) {
    deviceId = `WEB_CHROME_${Math.random()
      .toString(36)
      .substring(2, 10)}`

    localStorage.setItem(DEVICE_KEY, deviceId)
  }

  return deviceId
}