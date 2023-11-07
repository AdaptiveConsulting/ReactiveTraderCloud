import type { Locator, Page } from "@playwright/test"

export abstract class BaseComponent {
  constructor(public readonly host: Locator, public readonly page: Page) {}
}
