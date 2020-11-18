import { UAParser } from 'ua-parser-js'

export const isRunningInIE = () => {
  const browser = new UAParser().getBrowser().name
  return browser && browser.indexOf('IE') !== -1
}
