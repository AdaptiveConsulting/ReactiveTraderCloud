import { useEffect, useState } from 'react'
import { usePlatform } from 'rt-platforms'
import { isMobileDevice } from 'apps/utils'

export interface InstallPromptEvent extends Event {
  readonly platforms: string[]
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed'
    platform: string
  }>
  prompt(): Promise<void>
}

export const usePWABannerPrompt = (): [InstallPromptEvent | null, () => void] => {
  const [prompt, setPrompt] = useState<InstallPromptEvent | null>(null)
  const platform = usePlatform()

  const promptToInstall = () => {
    if (!isMobileDevice || platform.type !== 'browser') {
      return
    }
    if (prompt) {
      return prompt.prompt()
    }
    return Promise.reject(new Error("Browser hasn't sent a 'beforeinstallprompt' event"))
  }

  useEffect(() => {
    const ready = (e: InstallPromptEvent) => {
      e.preventDefault()
      setPrompt(e)
    }

    if (typeof window.installPromptEvent === 'undefined') {
      window.addEventListener('beforeinstallprompt', ready as any)
    } else {
      ready(window.installPromptEvent)
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', ready as any)
    }
  }, [platform.type])

  return [prompt, promptToInstall]
}
