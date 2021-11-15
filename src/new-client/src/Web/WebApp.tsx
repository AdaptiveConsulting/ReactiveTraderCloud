import { TileView } from "@/App/LiveRates/selectedView"
import { BASE_PATH } from "@/constants"
import { TornOutTile } from "@/App/LiveRates/Tile/TearOut/TornOutTile"
import { BrowserRouter, Route, Switch } from "react-router-dom"
import { MainRoute } from "./MainRoute"
import { TearOutRouteWrapper } from "./Web.styles"
import { Trades } from "@/App/Trades"
import { Analytics } from "@/App/Analytics"
import { LiveRates } from "@/App/LiveRates"

import {
  TornOutTileContext,
  TornOutTradeContext,
  TornOutAnalyticsContext,
} from "./context"
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
      <Route
        path="/liverates"
        render={() => {
          return (
            <TornOutTileContext.Provider value={{ isTornOut: true }}>
              <LiveRates />{" "}
            </TornOutTileContext.Provider>
          )
        }}
      />
      <Route
        path="/trades"
        render={() => {
          return (
            <TornOutTradeContext.Provider value={{ isTornOut: true }}>
              <Trades />{" "}
            </TornOutTradeContext.Provider>
          )
        }}
      />
      <Route
        path="/analytics"
        render={() => {
          return (
            <TornOutAnalyticsContext.Provider value={{ isTornOut: true }}>
              <Analytics hideIfMatches={""} />{" "}
            </TornOutAnalyticsContext.Provider>
          )
        }}
      />
    </Switch>
  </BrowserRouter>
)
