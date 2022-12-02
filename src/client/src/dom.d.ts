export {}

declare global {
  interface Window {
    beforeInstallPromptEvent: BeforeInstallPromptEvent
    // Set in index.html
    supportsBigInt: boolean
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    FSBL: any // Finsemble
    ga: ga
  }

  interface WindowEventMap {
    beforeinstallprompt: BeforeInstallPromptEvent
  }

  interface BeforeInstallPromptEvent extends Event {
    readonly platforms: string[]
    readonly userChoice: Promise<{
      outcome: "accepted" | "dismissed"
      platform: string
    }>
    prompt(): Promise<void>
  }
}
