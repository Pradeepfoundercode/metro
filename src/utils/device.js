let memoryDeviceId = null

export const getDeviceId = () => {
  if (!memoryDeviceId) {
    memoryDeviceId = `WEB_CHROME_${Math.random()
      .toString(36)
      .substring(2, 10)}`
  }

  return memoryDeviceId
}