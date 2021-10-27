import { TileView } from "@/App/LiveRates/selectedView"
import { TornOutTile } from "@/App/LiveRates/Tile/TearOut/TornOutTile"
import { BASE_URL } from "@/constants"
import { BrowserRouter, Route, Switch } from "react-router-dom"
import { MainRoute } from "./MainRoute"
import { TearOutRouteWrapper } from "./Web.styles"

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
    </Switch>
  </BrowserRouter>
)
