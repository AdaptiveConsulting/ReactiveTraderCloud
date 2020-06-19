import { useEffect, useState } from 'react'
import { usePlatform } from 'rt-platforms'
import { isMobileDevice, isAndroid, isiOS } from 'apps/utils'
import { MobileDevice } from './PWAInstallPrompt'

export const usePWABannerPrompt = (): [
  BeforeInstallPromptEvent | null,
  () => Promise<void> | undefined,
  MobileDevice | null
] => {
  const [prompt, setPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [device, setDevice] = useState<MobileDevice | null>(null)
  const platform = usePlatform()

  const promptToInstall = () => {
    if (prompt) {
      return prompt.prompt()
    }
    return Promise.reject(new Error("Browser hasn't sent a 'beforeinstallprompt' event"))
  }

  useEffect(() => {
    const ready = (e: BeforeInstallPromptEvent) => {
      if (isMobileDevice || platform.type !== 'browser') {
        setPrompt(null)
      } else {
        setPrompt(e)
        setDevice(null)
      }
    }

    if (isAndroid) setDevice(MobileDevice.Android)
    else if (isiOS) setDevice(MobileDevice.iOS)
    else if (typeof window.beforeInstallPromptEvent === 'undefined') {
      window.addEventListener('beforeinstallprompt', ready)
    } else {
      ready(window.beforeInstallPromptEvent)
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', ready)
    }
  }, [platform.type])

  return [prompt, promptToInstall, device]
}
