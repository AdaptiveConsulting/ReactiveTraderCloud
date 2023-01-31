import { test as base } from "@playwright/test"
import { Page, chromium } from "playwright"
import * as dotenv from "dotenv"

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
  fxOpenfinPagesRec: Record<FXPage, Page>
  creditOpenfinPagesRec: Record<CreditPage, Page>
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
  browser: async ({}, use) => {
    try {
      const runtimeConnection = await chromium.connectOverCDP(RUNTIME_ADDRESS)
      await use(runtimeConnection)
    } catch (e) {
      const browser = await chromium.launch()
      await use(browser)
    }
  },
  context: async ({ browser }, use) => {
    try {
      const contexts = await browser.contexts()
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
  fxOpenfinPagesRec: async ({ context }, use) => {
    const contextPages = await context.pages()
    try {
      const pages = fxOpenfinUrlPaths.reduce((rec, urlPath) => {
        const page = contextPages.find(
          (p) => p.url() === `${process.env.URL_PATH}/${urlPath}`,
        )
        if (!page) throw Error(`Openfin page at ${urlPath} was not found`)
        return { ...rec, [urlPathToFxPage(urlPath)]: page }
      }, {} as Record<FXPage, Page>)
      use(pages)
    } catch (e) {
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
  creditOpenfinPagesRec: async ({ context }, use) => {
    const contextPages = await context.pages()
    try {
      const pages = creditOpenfinUrlPaths.reduce((rec, urlPath) => {
        const page = contextPages.find(
          (p) => p.url() === `${process.env.URL_PATH}/${urlPath}`,
        )
        if (!page) throw Error(`Openfin page at ${urlPath} was not found`)
        return { ...rec, [urlPathToCreditPage(urlPath)]: page }
      }, {} as Record<CreditPage, Page>)
      use(pages)
    } catch (e) {
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
  openfinNotification: async ({}, use) => {
    const runtimeConnection = await chromium.connectOverCDP(
      `${process.env.NOTIFICATION_RUNTIME_ADDRESS}`,
    )

    const contexts = runtimeConnection.contexts()
    if (contexts.length !== 1) {
      throw Error(
        `Unexepcted Context(s) for Notification: Expected 1, Found ${contexts.length}`,
      )
    }

    const pages = await contexts[0].pages()

    const notificationPage = pages.find(
      (page) => page.url() === `${process.env.OPENFIN_NOTIFICATION_URL_PATH}`,
    )

    if (!notificationPage) throw Error("Notification not found!")
    await use(notificationPage)
  },
})
