import { browser, by, ProtractorBrowser } from 'protractor'
import { wait } from './utils/async.utils'
import { waitForElementToBePresent, waitForElementToBeVisible } from './utils/browser.utils'

let activeBrowser: ProtractorBrowser

export async function getBrowser() {
  if (!activeBrowser) {
    console.log('Preparing browser')
    activeBrowser = await prepareBrowser()
  }

  return activeBrowser
}

async function prepareBrowser(): Promise<ProtractorBrowser> {
  // We are testing a React project. We need to disable Angular sync.
  await browser.waitForAngularEnabled(false)

  await browser.get(browser.params.baseUrl, 10000)

  // Wait for first rendering, for good measure.
  await wait(5000)

  return browser
}
