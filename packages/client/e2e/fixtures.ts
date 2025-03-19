import { chromium, Page, test as base } from "@playwright/test"
import * as dotenv from "dotenv"

import {
  CreditBlotterPageObject,
  CreditNewRfqPageObject,
  CreditRfqTilesPageObject,
  FxNewRfqPageObject,
  FxBlotterPageObject
} from "./pages"
import { isOpenFin } from "./utils"

dotenv.config({ path: ".env.development" })
dotenv.config()

type FXPage = "mainWindow" | "fx-tiles" | "fx-blotter" | "fx-analytics"

const RUNTIME_ADDRESS = process.env.OPENFIN_RUNTIME_ADDRESS ?? ""

type FxPages = {
  fxTilePO: FxNewRfqPageObject
  fxBlotterPO: FxBlotterPageObject
}

type CreditPages = {
  blotterPO: CreditBlotterPageObject
  newRfqPO: CreditNewRfqPageObject
  rfqsPO: CreditRfqTilesPageObject
}

interface Fixtures {
  fxPages: FxPages
  creditPages: CreditPages
  limitCheckerPage: Page
}

const fxOpenfinUrlPaths: string[] = [
  "openfin-window-frame?app=FX",
  "fx-tiles",
  "fx-blotter",
  "fx-analytics",
]

const creditOpenfinUrlSuffixes: Record<string, keyof CreditPages> = {
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
  fxPages: async ({ context }, use, workerInfo) => {
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
    } else {
      const mainPage =
        contextPages.length > 0 ? contextPages[0] : await context.newPage()
      await mainPage.goto(`${process.env.E2E_RTC_WEB_ROOT_URL}`)
      use({
        fxTilePO: new FxNewRfqPageObject(mainPage),
        fxBlotterPO: new FxBlotterPageObject(mainPage)
      })
    }
  },
  creditPages: async ({ context }, use, workerInfo) => {
    const contextPages = context.pages()

    if (isOpenFin(workerInfo)) {
      use(
        Object.keys(creditOpenfinUrlSuffixes).reduce<CreditPages>(
          (rec, urlPath) => {
            const page = contextPages.find(
              (p) =>
                p.url() === `${process.env.E2E_RTC_WEB_ROOT_URL}/${urlPath}`,
            )

            if (!page) throw Error(`Openfin page at ${urlPath} was not found`)

            switch (urlPath) {
              case "credit-blotter":
                rec.blotterPO = new CreditBlotterPageObject(page, workerInfo)
                break
              case "credit-new-rfq":
                rec.newRfqPO = new CreditNewRfqPageObject(page, workerInfo)
                break
              case "credit-rfqs":
                page.setViewportSize({ width: 1280, height: 1024 })
                rec.rfqsPO = new CreditRfqTilesPageObject(page, workerInfo)
                break
              default:
                throw Error(`Unknown Openfin page URL - ${urlPath}`)
            }
            return rec
          },
          {} as CreditPages,
        ),
      )
    } else {
      const mainPage =
        contextPages.length > 0 ? contextPages[0] : await context.newPage()
      await mainPage.goto(`${process.env.E2E_RTC_WEB_ROOT_URL}/credit`)
      use({
        blotterPO: new CreditBlotterPageObject(mainPage, workerInfo),
        newRfqPO: new CreditNewRfqPageObject(mainPage, workerInfo),
        rfqsPO: new CreditRfqTilesPageObject(mainPage, workerInfo),
      })
    }
  },
  limitCheckerPage: async ({ context }, use, workerInfo) => {
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
      const mainPage =
        contextPages.length > 0 ? contextPages[0] : await context.newPage()

      use(mainPage)
    }
  },
})
