import userAgentParser from 'ua-parser-js';

let isRunningInIE = null;

export default class Environment {

  static get isRunningInIE() {
    if (isRunningInIE === null) {
      let browser = new userAgentParser().getBrowser().name;
      isRunningInIE = browser.indexOf('IE') !== -1;
    }
    return isRunningInIE;
  }
}
