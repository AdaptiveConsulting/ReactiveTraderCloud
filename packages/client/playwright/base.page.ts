import type { Page } from "@playwright/test"

export abstract class BasePage {
  constructor(public readonly page: Page) {}

  /**
   * navigates to url
   * @param path - url path
   */
  async open(path: string) {
    await this.page.goto(path)
  }
}
