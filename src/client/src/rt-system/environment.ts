import userAgentParser from 'ua-parser-js'

let isRunningInIE: boolean = false

interface Navigator {
  standalone?: boolean
}

export default class Environment {
  static isRunningInIE() {
    if (isRunningInIE === null) {
      const browser = new userAgentParser().getBrowser().name
      isRunningInIE = browser.indexOf('IE') !== -1
    }
    return isRunningInIE
  }

  static isPWA() {
    return (
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as Navigator).standalone
    )
  }
}
