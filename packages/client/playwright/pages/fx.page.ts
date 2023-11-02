import { BasePage } from "../base.page"
import AnalyticsComponent from "../components/analytics.component"
import BlotterComponent from "../components/blotter.component"
import SpotTileComponent from "../components/spotTile.component"

export default class FxPage extends BasePage {
  public readonly spotTileComponent = new SpotTileComponent(this.page)
  public readonly blotterComponent = new BlotterComponent(this.page)
  public readonly analyticsComponent = new AnalyticsComponent(this.page)

  async open() {
    await super.open("/fx")
  }
}
