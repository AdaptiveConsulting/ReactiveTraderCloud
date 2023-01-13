import { test as base } from "@playwright/test"
import { Page, chromium } from "playwright"
// ensures all window objects we interact with in our spec have fin tyepdefs
export * from "./openfinGlobal"

const RUNTIME_ADDRESS = "http://localhost:9091"

// Define custom fixture interface
interface IPlaywrightFixtures {
  mainWindow: Page
  openfinTile: Page
  openfinBlotter: Page
  openfinNotification: Page
  openfinAnalytics: Page
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
  mainWindow: async ({ context }, use) => {
    const pages = await context.pages()
    try {
      const openfinFramePage = pages.find(
        (page) =>
          page.url() === "http://localhost:1917/openfin-window-frame?app=FX",
      )

      if (!openfinFramePage)
        throw Error(
          "Main Openfin Window not found! Make sure to launch RT openfin application first",
        )
      await use(openfinFramePage)
    } catch (e) {
      if (pages.length > 0) {
        await use(pages[0])
      } else {
        const page = await context.newPage()
        await use(page)
      }
    }
  },
  openfinTile: async ({ context }, use) => {
    const pages = await context.pages()

    try {
      const tilePage = pages.find(
        (page) => page.url() === "http://localhost:1917/fx-tiles", // url matches that of fx tiles defined in rt-fx.json
      )

      if (!tilePage) throw Error("Tiles not found!")
      await use(tilePage)
    } catch (e) {
      if (pages.length > 0) {
        await use(pages[0])
      } else {
        const page = await context.newPage()
        await use(page)
      }
    }
  },
  openfinBlotter: async ({ context }, use) => {
    const pages = await context.pages()
    try {
      const blotterPage = pages.find(
        (page) => page.url() === "http://localhost:1917/fx-blotter",
      )

      if (!blotterPage) throw Error("Blotter not found!")
      await use(blotterPage)
    } catch (e) {
      if (pages.length > 0) {
        await use(pages[0])
      } else {
        const page = await context.newPage()
        await use(page)
      }
    }
  },
  openfinAnalytics: async ({ context }, use) => {
    const pages = await context.pages()
    try {
      const analyticsPage = pages.find(
        (page) => page.url() === "http://localhost:1917/fx-analytics",
      )

      if (!analyticsPage) throw Error("Analytics not found")
      await use(analyticsPage)
    } catch (e) {
      if (pages.length > 0) {
        await use(pages[0])
      } else {
        const page = await context.newPage()
        await use(page)
      }
    }
  },
  openfinNotification: async ({}, use) => {
    const runtimeConnection = await chromium.connectOverCDP(
      "http://localhost:9090",
    )

    const contexts = runtimeConnection.contexts()
    if (contexts.length !== 1) {
      throw Error(
        `Unexepcted Context(s) for Notification: Expected 1, Found ${contexts.length}`,
      )
    }

    const pages = await contexts[0].pages()

    const notificationPage = pages.find(
      (page) =>
        page.url() ===
        "https://cdn.openfin.co/services/openfin/notifications/0.12.10/provider.html",
    )

    if (!notificationPage) throw Error("Notification not found!")
    await use(notificationPage)
  },
})
