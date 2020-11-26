import { useEffect, useState } from 'react'
import { usePlatform } from 'rt-platforms'

export const usePWABannerPrompt = (): [
  BeforeInstallPromptEvent | null,
  () => Promise<void> | undefined
] => {
  const [prompt, setPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const platform = usePlatform()

  const promptToInstall = () => {
    if (prompt) {
      return prompt.prompt()
    }
    return Promise.reject(new Error("Browser hasn't sent a 'beforeinstallprompt' event"))
  }

  useEffect(() => {
    const ready = (e: BeforeInstallPromptEvent) => {
      platform.type === 'browser' ? setPrompt(e) : setPrompt(null)
    }

    if (typeof window.beforeInstallPromptEvent === 'undefined') {
      window.addEventListener('beforeinstallprompt', ready)
    } else {
      ready(window.beforeInstallPromptEvent)
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', ready)
    }
  }, [platform.type])

  return [prompt, promptToInstall]
}
