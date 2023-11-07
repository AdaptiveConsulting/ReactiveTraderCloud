import type { Page } from "@playwright/test";

import { BaseComponent } from "../Base.component"

export default class AnalyticsComponent extends BaseComponent {
  constructor(page: Page) {
    super(page.locator("[data-qa='analytics__analytics-content']"), page);
  }
  
}