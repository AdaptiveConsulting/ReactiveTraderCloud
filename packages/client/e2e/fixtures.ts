import { chromium, Page, test as base } from "@playwright/test"
import * as dotenv from "dotenv"

import {
  CreditBlotterPageObject,
  CreditNewRfqPageObject,
  CreditRfqTilesPageObject,
} from "./pages"
import { isOpenFin } from "./utils"

dotenv.config({ path: ".env.development" })
dotenv.config()

type FXPage = "mainWindow" | "fx-tiles" | "fx-blotter" | "fx-analytics"

const RUNTIME_ADDRESS = process.env.OPENFIN_RUNTIME_ADDRESS ?? ""

type CreditPages = {
  mainPage: Page
  blotterPO: CreditBlotterPageObject
  newRfqPO: CreditNewRfqPageObject
  rfqsPO: CreditRfqTilesPageObject
}

interface Fixtures {
  fxPagesRec: Record<FXPage, Page>
  creditPagesRec: CreditPages
  limitCheckerPageRec: Page
}

const fxOpenfinUrlPaths: string[] = [
  "openfin-window-frame?app=FX",
  "fx-tiles",
  "fx-blotter",
  "fx-analytics",
]

const creditOpenfinUrlSuffixes: Record<string, keyof CreditPages> = {
  "openfin-window-frame?app=CREDIT": "mainPage",
  "credit-blotter": "blotterPO",
  "credit-new-rfq": "newRfqPO",
  "credit-rfqs": "rfqsPO",
}

const limitCheckerUrlPath = "limit-checker"

const urlPathToFxPage = (path: string): FXPage => {
  switch (path) {
    case "openfin-window-frame?app=FX":
      return "mainWindow"
    default:
      return path as FXPage
  }
}

export const test = base.extend<Fixtures>({
  browser: async ({}, use, workerInfo) => {
    if (isOpenFin(workerInfo)) {
      const runtimeConnection = await chromium.connectOverCDP(RUNTIME_ADDRESS)
      await use(runtimeConnection)
    } else {
      const browser = await chromium.launch()
      await use(browser)
    }
  },
  context: async ({ browser }, use) => {
    try {
      const contexts = browser.contexts()
      if (contexts.length !== 1) {
        throw Error(
          `Unexepcted Context(s): Expected 1, Found ${contexts.length}`,
        )
      }
      await use(contexts[0])
    } catch {
      const context = await browser.newContext()
      use(context)
    }
  },
  fxPagesRec: async ({ context }, use, workerInfo) => {
    const contextPages = context.pages()
    if (isOpenFin(workerInfo)) {
      const pages = fxOpenfinUrlPaths.reduce(
        (rec, urlPath) => {
          const page = contextPages.find(
            (p) => p.url() === `${process.env.E2E_RTC_WEB_ROOT_URL}/${urlPath}`,
          )
          if (!page) throw Error(`Openfin page at ${urlPath} was not found`)
          return { ...rec, [urlPathToFxPage(urlPath)]: page }
        },
        {} as Record<FXPage, Page>,
      )
      use(pages)
    } else {
      const mainWindow =
        contextPages.length > 0 ? contextPages[0] : await context.newPage()
      use({
        mainWindow,
        "fx-analytics": mainWindow,
        "fx-blotter": mainWindow,
        "fx-tiles": mainWindow,
      })
    }
  },
  creditPagesRec: async ({ context }, use, workerInfo) => {
    let mainPage, blotterPage, newRfqPage, rfqsPage
    const contextPages = context.pages()
    if (isOpenFin(workerInfo)) {
      Object.keys(creditOpenfinUrlSuffixes).forEach((urlPath) => {
        const page = contextPages.find(
          (p) => p.url() === `${process.env.E2E_RTC_WEB_ROOT_URL}/${urlPath}`,
        )
        if (!page) throw Error(`Openfin page at ${urlPath} was not found`)
        switch (urlPath) {
          case "openfin-window-frame?app=CREDIT":
            mainPage = page
            break
          case "credit-blotter":
            blotterPage = page
            break
          case "credit-new-rfq":
            newRfqPage = page
            break
          case "credit-rfqs":
            rfqsPage = page
            break
          default:
            throw Error(`Unknown Openfin page URL - ${urlPath}`)
        }
      })
    } else {
      mainPage =
        blotterPage =
        newRfqPage =
        rfqsPage =
          contextPages.length > 0 ? contextPages[0] : await context.newPage()
    }
    use({
      mainPage,
      blotterPO: new CreditBlotterPageObject(blotterPage, workerInfo),
      newRfqPO: new CreditNewRfqPageObject(newRfqPage, workerInfo),
      rfqsPO: new CreditRfqTilesPageObject(rfqsPage, workerInfo),
    })
  },
  limitCheckerPageRec: async ({ context }, use, workerInfo) => {
    const contextPages = context.pages()
    if (isOpenFin(workerInfo)) {
      const page = contextPages.find(
        (p) =>
          p.url() ===
          `${process.env.E2E_RTC_WEB_ROOT_URL}/${limitCheckerUrlPath}`,
      )
      if (!page)
        throw Error(`Openfin page at ${limitCheckerUrlPath} was not found`)
      use(page)
    } else {
      const mainWindow =
        contextPages.length > 0 ? contextPages[0] : await context.newPage()

      use(mainWindow)
    }
  },
})
