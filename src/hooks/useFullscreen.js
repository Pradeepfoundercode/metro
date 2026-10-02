import { useCallback } from 'react'

export function useFullscreenLandscape() {
  const enterFullscreen = useCallback(async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen({
          navigationUI: 'hide',
        })
      }
    } catch (error) {
      console.log(
        'Fullscreen request was blocked:',
        error
      )
    }

    try {
      if (
        screen.orientation &&
        screen.orientation.lock
      ) {
        await screen.orientation.lock('landscape')
      }
    } catch (error) {
      console.log(
        'Landscape lock not supported:',
        error
      )
    }
  }, [])

  return {
    enterFullscreen,
  }
}