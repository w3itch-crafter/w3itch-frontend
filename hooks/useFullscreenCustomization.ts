import { useFullscreen } from 'ahooks'
import { MutableRefObject, useCallback, useState } from 'react'

type UseFullscreenCustomization = {
  ref: MutableRefObject<null>
  // ['Escape']
  keyboardLock?: Iterable<string>
}

/**
 * useFullscreenCustomization
 * @export
 * @param {UseFullscreenCustomization} {
 *   ref,
 *   keyboardLock: ['Escape'],
 * }
 * @return {*}
 */
export function useFullscreenCustomization({
  ref,
  keyboardLock,
}: UseFullscreenCustomization) {
  // Adapt to IOS
  // Need customization css fixed + PWA manifest support
  const [iosFullscreen, setIosFullscreen] = useState<boolean>(false)
  const [isFullscreen, { enterFullscreen, exitFullscreen }] = useFullscreen(
    ref,
    {
      onExit: () => {
        // console.log('exit')
        if (
          keyboardLock &&
          'keyboard' in navigator &&
          'lock' in navigator.keyboard
        ) {
          navigator.keyboard.unlock()
        }
        setIosFullscreen(false)
      },
    }
  )

  // handle Fullscreen
  const handleFullscreen = useCallback(() => {
    // https://developer.mozilla.org/en-US/docs/Web/API/Lock
    if (isFullscreen) {
      exitFullscreen()
      if (
        keyboardLock &&
        'keyboard' in navigator &&
        'lock' in navigator.keyboard
      ) {
        navigator.keyboard.unlock()
      }
    } else {
      if (
        keyboardLock &&
        'keyboard' in navigator &&
        'lock' in navigator.keyboard
      ) {
        navigator.keyboard.lock(keyboardLock)
      }
      enterFullscreen()
    }
    setIosFullscreen(!iosFullscreen)
  }, [
    enterFullscreen,
    exitFullscreen,
    isFullscreen,
    iosFullscreen,
    keyboardLock,
  ])

  return {
    iosFullscreen,
    isFullscreen,
    handleFullscreen,
  }
}
