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
    const contextPages = context.pages()
    let pages: CreditPages

    if (isOpenFin(workerInfo)) {
      pages = Object.keys(creditOpenfinUrlSuffixes).reduce<CreditPages>(
        (rec, urlPath) => {
          const page = contextPages.find(
            (p) => p.url() === `${process.env.E2E_RTC_WEB_ROOT_URL}/${urlPath}`,
          )

          if (!page) throw Error(`Openfin page at ${urlPath} was not found`)

          switch (urlPath) {
            case "openfin-window-frame?app=CREDIT":
              rec.mainPage = page
              break
            case "credit-blotter":
              rec.blotterPO = new CreditBlotterPageObject(page)
              break
            case "credit-new-rfq":
              rec.newRfqPO = new CreditNewRfqPageObject(page)
              break
            case "credit-rfqs":
              rec.rfqsPO = new CreditRfqTilesPageObject(page)
              break
            default:
              throw Error(`Unknown Openfin page URL - ${urlPath}`)
          }
          return rec
        },
        {} as CreditPages,
      )
    } else {
      const mainWindow =
        contextPages.length > 0 ? contextPages[0] : await context.newPage()

      pages = {
        mainPage: mainWindow,
        blotterPO: new CreditBlotterPageObject(mainWindow),
        newRfqPO: new CreditNewRfqPageObject(mainWindow),
        rfqsPO: new CreditRfqTilesPageObject(mainWindow, workerInfo),
      }
    }

    use(pages)
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
