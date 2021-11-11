import { TileView } from "@/App/LiveRates/selectedView"
import { BASE_URL } from "@/constants"
import { BrowserRouter, Route, Switch } from "react-router-dom"
import { MainRoute } from "./MainRoute"
import { TornOutTile } from "./Tiles"
import { TearOutRouteWrapper } from "./Web.styles"
import { Tiles } from "./Tiles"
import { Trades } from "@/App/Trades"
import { Analytics } from "@/App/Analytics"
export const WebApp: React.FC = () => (
  <BrowserRouter basename={BASE_URL}>
    <Switch>
      <Route exact path="/" render={() => <MainRoute />} />
      <Route
        path="/spot/:symbol"
        render={({
          location: { search },
          match: {
            params: { symbol },
          },
        }) => {
          const query = new URLSearchParams(search)
          const view = query.has("tileView")
            ? (query.get("tileView") as TileView)
            : TileView.Analytics

          return (
            <TearOutRouteWrapper>
              <TornOutTile symbol={symbol} view={view} />
            </TearOutRouteWrapper>
          )
        }}
      />
      <Route path="/tiles" render={() => <Tiles />} />
      <Route path="/trades" render={() => <Trades />} />
      <Route path="/analytics" render={() => <Analytics />} />
    </Switch>
  </BrowserRouter>
)
