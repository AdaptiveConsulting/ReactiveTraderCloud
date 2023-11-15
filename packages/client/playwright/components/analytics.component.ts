import type { Page } from "@playwright/test";

import { BaseComponent } from "../base.component"

export default class AnalyticsComponent extends BaseComponent {
  constructor(page: Page) {
    super(page.locator("[data-qa='analytics__analytics-content']"), page);
  }
  
}
