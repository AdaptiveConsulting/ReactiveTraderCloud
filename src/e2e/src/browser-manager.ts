import { MainPage } from './pages/main.page'
import { browser, ProtractorBrowser } from 'protractor'

// test some changes

let activeBrowser: ProtractorBrowser

const waitForConnected = async (browser: ProtractorBrowser) => {
  const mainPage = new MainPage(browser)
  browser.wait(
    () => mainPage.isConnected(),
    20_000,
    'Application failed to connect to the services.',
  )
}

async function prepareBrowser(): Promise<ProtractorBrowser> {
  // We are testing a React project. We need to disable Angular sync.
  await browser.waitForAngularEnabled(false)

  console.info('Getting page: ', browser.baseUrl)
  await browser.get(browser.baseUrl, 10000)

  // Wait for application to be up and connected to services
  await waitForConnected(browser)

  return browser
}

export async function getBrowser() {
  if (!activeBrowser) {
    console.log('Preparing browser')
    activeBrowser = await prepareBrowser()
  }

  return activeBrowser
}
