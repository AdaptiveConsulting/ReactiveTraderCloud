import type { Page } from "@playwright/test";

import { BasePageComponent } from "../base.component"

export default class AnalyticsComponent extends BasePageComponent {
  constructor(page: Page) {
    super(page.locator("[data-qa='analytics__analytics-content']"), page);
  }
  
}