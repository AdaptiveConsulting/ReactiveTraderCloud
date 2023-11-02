import { test as base } from "@playwright/test"

import FxPage from "./pages/fx.page"

export type PageObjects = {
  fxPage: FxPage
}

export const test = base.extend<PageObjects>({
  fxPage: async ({ page }, use) => {
    const fxPage = new FxPage(page)
    await use(fxPage)
  },
})

export { expect, Locator, Page, Response } from "@playwright/test"
