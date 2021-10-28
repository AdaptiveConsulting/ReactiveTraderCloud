import { TileView } from "@/App/LiveRates/selectedView"
import { BASE_PATH } from "@/constants"
import { TornOutTile } from "@/App/LiveRates/Tile/TearOut/TornOutTile"
import { BrowserRouter, Route, Switch } from "react-router-dom"
import { MainRoute } from "./MainRoute"
import { TearOutRouteWrapper } from "./Web.styles"

export const WebApp: React.FC = () => (
  <BrowserRouter basename={BASE_PATH}>
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
