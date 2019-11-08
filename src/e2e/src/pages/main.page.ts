import { by, ProtractorBrowser } from 'protractor'
import { BlotterComponent } from './blotter.component'
import { WorkspaceComponent } from './workspace.component'
import { TileComponent } from './tile.component'

export class MainPage {
  workspace: WorkspaceComponent
  tile: TileComponent
  blotter: BlotterComponent

  constructor(private browser: ProtractorBrowser) {
    this.workspace = new WorkspaceComponent(browser, browser.element(by.qa('workspace__tiles-workspace')))
    this.tile = new TileComponent(browser, browser.element(by.qa('workspace__tiles-workspace-items')))
    this.blotter = new BlotterComponent(browser, browser.element(by.qa('shell-route__blotter-wrapper')))
  }

  async isConnected() {
    const connectionElement = this.browser.element(by.qa('status-button__toggle-button'))
    if(!connectionElement.isPresent()) {
      return false;
    }
    const text = await connectionElement.getText()
    return text.trim() === 'Connected'
  }
}
