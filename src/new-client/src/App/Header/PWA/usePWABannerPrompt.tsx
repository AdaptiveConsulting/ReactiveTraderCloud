import { useEffect, useState } from "react"

export const usePWABannerPrompt = (): [
  BeforeInstallPromptEvent | null,
  () => Promise<void> | undefined,
] => {
  const [prompt, setPrompt] = useState<BeforeInstallPromptEvent | null>(null)

  const promptToInstall = () => {
    if (prompt) {
      return prompt.prompt()
    }
    return Promise.reject(
      new Error("Browser hasn't sent a 'beforeinstallprompt' event"),
    )
  }

  useEffect(() => {
    const ready = (e: BeforeInstallPromptEvent) => {
      setPrompt(e)
    }

    if (typeof window.beforeInstallPromptEvent === "undefined") {
      window.addEventListener("beforeinstallprompt", ready)
    } else {
      ready(window.beforeInstallPromptEvent)
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", ready)
    }
  }, [])

  return [prompt, promptToInstall]
}
