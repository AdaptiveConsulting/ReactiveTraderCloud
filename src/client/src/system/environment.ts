import userAgentParser from 'ua-parser-js'

let isRunningInIE: boolean = false

export default class Environment {
  static isRunningInIE() {
    if (isRunningInIE === null) {
      const browser = new userAgentParser().getBrowser().name
      isRunningInIE = browser.indexOf('IE') !== -1
    }
    return isRunningInIE
  }
}
