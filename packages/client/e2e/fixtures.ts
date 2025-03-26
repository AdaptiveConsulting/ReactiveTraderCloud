import { chromium, Page, test as base } from "@playwright/test"
import * as dotenv from "dotenv"

import {
  CreditBlotterPageObject,
  CreditNewRfqPageObject,
  CreditRfqTilesPageObject,
  FxAnalyticsPageObject,
  FxBlotterPageObject,
  FxTilesPageObject,
  LimitCheckerPageObject,
} from "./pages"
import { isOpenFin } from "./utils"

dotenv.config({ path: ".env.development" })
dotenv.config()

const RUNTIME_ADDRESS = process.env.OPENFIN_RUNTIME_ADDRESS ?? ""

type FxPages = {
  mainPage: Page
  tilePO: FxTilesPageObject
  blotterPO: FxBlotterPageObject
  analyticsPO: FxAnalyticsPageObject
}

type CreditPages = {
  blotterPO: CreditBlotterPageObject
  newRfqPO: CreditNewRfqPageObject
  rfqsPO: CreditRfqTilesPageObject
}

interface Fixtures {
  fxPages: FxPages
  creditPages: CreditPages
  limitCheckerPO: LimitCheckerPageObject
}

const creditOpenfinUrlSuffixes: Record<string, keyof CreditPages> = {
  "credit-blotter": "blotterPO",
  "credit-new-rfq": "newRfqPO",
  "credit-rfqs": "rfqsPO",
}

const fxOpenFinUrlSuffixes: Record<string, keyof FxPages> = {
  "openfin-window-frame?app=FX": "mainPage",
  "fx-blotter": "blotterPO",
  "fx-tiles": "tilePO",
  "fx-analytics": "analyticsPO",
}

const limitCheckerUrlPath = "limit-checker"

export const test = base.extend<Fixtures>({
  browser: async ({}, use, testInfo) => {
    if (isOpenFin(testInfo)) {
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
  fxPages: async ({ context }, use, testInfo) => {
    const contextPages = context.pages()

    if (isOpenFin(testInfo)) {
      use(
        Object.keys(fxOpenFinUrlSuffixes).reduce<FxPages>((rec, urlPath) => {
          const page = contextPages.find(
            (p) => p.url() === `${process.env.E2E_RTC_WEB_ROOT_URL}/${urlPath}`,
          )

          if (!page) throw Error(`Openfin page at ${urlPath} was not found`)

          switch (urlPath) {
            case "openfin-window-frame?app=FX":
              rec.mainPage = page
              break
            case "fx-blotter":
              rec.blotterPO = new FxBlotterPageObject(page, testInfo)
              break
            case "fx-tiles":
              rec.tilePO = new FxTilesPageObject(page, testInfo)
              break
            case "fx-analytics":
              rec.analyticsPO = new FxAnalyticsPageObject(page, testInfo)
              break
            default:
              throw Error(`Unknown Openfin page URL - ${urlPath}`)
          }
          return rec
        }, {} as FxPages),
      )
    } else {
      const mainPage =
        contextPages.length > 0 ? contextPages[0] : await context.newPage()
      await mainPage.goto(`${process.env.E2E_RTC_WEB_ROOT_URL}`)
      use({
        mainPage,
        tilePO: new FxTilesPageObject(mainPage, testInfo),
        blotterPO: new FxBlotterPageObject(mainPage, testInfo),
        analyticsPO: new FxAnalyticsPageObject(mainPage, testInfo),
      })
    }
  },
  creditPages: async ({ context }, use, testInfo) => {
    const contextPages = context.pages()

    if (isOpenFin(testInfo)) {
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
                rec.blotterPO = new CreditBlotterPageObject(page, testInfo)
                break
              case "credit-new-rfq":
                rec.newRfqPO = new CreditNewRfqPageObject(page, testInfo)
                break
              case "credit-rfqs":
                page.setViewportSize({ width: 1280, height: 1024 })
                rec.rfqsPO = new CreditRfqTilesPageObject(page, testInfo)
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
        blotterPO: new CreditBlotterPageObject(mainPage, testInfo),
        newRfqPO: new CreditNewRfqPageObject(mainPage, testInfo),
        rfqsPO: new CreditRfqTilesPageObject(mainPage, testInfo),
      })
    }
  },
  limitCheckerPO: async ({ context }, use, testInfo) => {
    const contextPages = context.pages()

    if (isOpenFin(testInfo)) {
      const page = contextPages.find(
        (p) =>
          p.url() ===
          `${process.env.E2E_RTC_WEB_ROOT_URL}/${limitCheckerUrlPath}`,
      )
      if (!page)
        throw Error(`Openfin page at ${limitCheckerUrlPath} was not found`)

      use(new LimitCheckerPageObject(page, testInfo))
    }
  },
})
