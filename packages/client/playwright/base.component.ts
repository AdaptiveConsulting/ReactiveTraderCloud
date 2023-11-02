import type { Locator, Page } from "@playwright/test"

export abstract class BasePageComponent {
  constructor(public readonly host: Locator, public readonly page: Page) {}
}
