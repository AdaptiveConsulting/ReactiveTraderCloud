export {}

declare global {
  interface Window {
    installPromptEvent: InstallPromptEvent
  }
}

declare module '*.json'
