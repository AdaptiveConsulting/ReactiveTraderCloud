import { by, ElementFinder, ProtractorBrowser } from 'protractor'
import { AnalyticsComponent } from './analytics.component'
import { BlotterComponent } from './blotter.component'
import { WorkspaceComponent } from './workspace.component'
import { TileComponent } from './tile.component'

const CONNECTED_REGEX = /^Connected to .*$/gi

export class MainPage {
  workspace: WorkspaceComponent
  tile: TileComponent
  analytics: AnalyticsComponent
  blotter: BlotterComponent

  constructor(private browser: ProtractorBrowser) {
    this.workspace = new WorkspaceComponent(browser, browser.element(by.qa('workspace__tiles-workspace')))
    this.tile = new TileComponent(browser, browser.element(by.qa('workspace__tiles-workspace-items')))
    this.analytics = new AnalyticsComponent(browser, browser.element(by.qa('shell-route__analytics-wrapper')))
    this.blotter = new BlotterComponent(browser, browser.element(by.qa('shell-route__blotter-wrapper')))
  }

  async isConnected() {
    const connectionElement = this.browser.element(by.qa('status-button__toggle-button'))
    return connectionElement.isPresent()
  }
}
