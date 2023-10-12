import { chromium, Page, test as base } from "@playwright/test"
import * as dotenv from "dotenv"

import { isOpenFin } from "./utils"

dotenv.config({ path: ".env.development" })
dotenv.config()

// ensures all window objects we interact with in our spec have fin tyepdefs
export * from "../openfinGlobal"

type FXPage = "mainWindow" | "fx-tiles" | "fx-blotter" | "fx-analytics"
type CreditPage =
  | "credit-new-rfq"
  | "credit-blotter"
  | "credit-rfqs"
  | "mainWindow"

const RUNTIME_ADDRESS = process.env.OPENFIN_RUNTIME_ADDRESS ?? ""

// Define custom fixture interface
interface IPlaywrightFixtures {
  mainWindow: Page
  openfinNotification: Page
  fxPagesRec: Record<FXPage, Page>
  creditPagesRec: Record<CreditPage, Page>
  limitCheckerPageRec: Page
}

const fxOpenfinUrlPaths: string[] = [
  "openfin-window-frame?app=FX",
  "fx-tiles",
  "fx-blotter",
  "fx-analytics",
]

const creditOpenfinUrlPaths: string[] = [
  "openfin-window-frame?app=CREDIT",
  "credit-new-rfq",
  "credit-blotter",
  "credit-rfqs",
]

const limitCheckerUrlPath = "limit-checker"

const urlPathToFxPage = (path: string): FXPage => {
  switch (path) {
    case "openfin-window-frame?app=FX":
      return "mainWindow"
    default:
      return path as FXPage
  }
}

const urlPathToCreditPage = (path: string): CreditPage => {
  switch (path) {
    case "openfin-window-frame?app=CREDIT":
      return "mainWindow"
    default:
      return path as CreditPage
  }
}

export const test = base.extend<IPlaywrightFixtures>({
  // eslint-disable-next-line no-empty-pattern
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
    } catch (e) {
      const context = await browser.newContext()
      use(context)
    }
  },
  fxPagesRec: async ({ context }, use, workerInfo) => {
    const contextPages = context.pages()
    if (isOpenFin(workerInfo)) {
      const pages = fxOpenfinUrlPaths.reduce((rec, urlPath) => {
        const page = contextPages.find(
          (p) => p.url() === `${process.env.E2E_RTC_WEB_ROOT_URL}/${urlPath}`,
        )
        if (!page) throw Error(`Openfin page at ${urlPath} was not found`)
        return { ...rec, [urlPathToFxPage(urlPath)]: page }
      }, {} as Record<FXPage, Page>)
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
    if (isOpenFin(workerInfo)) {
      const pages = creditOpenfinUrlPaths.reduce((rec, urlPath) => {
        const page = contextPages.find(
          (p) => p.url() === `${process.env.E2E_RTC_WEB_ROOT_URL}/${urlPath}`,
        )
        if (!page) throw Error(`Openfin page at ${urlPath} was not found`)
        return { ...rec, [urlPathToCreditPage(urlPath)]: page }
      }, {} as Record<CreditPage, Page>)
      use(pages)
    } else {
      const mainWindow =
        contextPages.length > 0 ? contextPages[0] : await context.newPage()
      use({
        mainWindow,
        "credit-blotter": mainWindow,
        "credit-new-rfq": mainWindow,
        "credit-rfqs": mainWindow,
      })
    }
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
