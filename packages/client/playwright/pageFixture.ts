import { chromium, test as base } from "@playwright/test"

import FxPage from "./pages/fx.page"

export type PageObjects = {
  fxPage: FxPage
}

export const test = base.extend<PageObjects>({
  context: async ({ browser }, use) => {
    try {
      const contexts = browser.contexts()
      if (contexts.length !== 1) {
        throw Error(
          `Unexpected Context(s): Expected 1, Found ${contexts.length}`,
        )
      }
      await use(contexts[0])
    } catch (e) {
      const context = await browser.newContext()
      use(context)
    }
  },
  fxPage: async ({ page }, use) => {
    const fxPage = new FxPage(page)
    use(fxPage)
  },
})

export { expect, Locator, Page, Response } from "@playwright/test"
