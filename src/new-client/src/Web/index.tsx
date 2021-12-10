import { TileView } from "@/App/LiveRates/selectedView"
import { BASE_PATH, ROUTES_CONFIG } from "@/constants"
import { TornOutTile } from "@/App/LiveRates/Tile/TearOut/TornOutTile"
import { BrowserRouter, Route, Switch } from "react-router-dom"
import { MainRoute } from "./MainRoute"
import { TearOutRouteWrapper } from "./Web.styles"
import { Trades } from "@/App/Trades"
import { Analytics } from "@/App/Analytics"
import { LiveRates } from "@/App/LiveRates"
import { TearOutContext } from "../App/TearOutSection/tearOutContext"
import { DisconnectionOverlay } from "@/components/DisconnectionOverlay"

export const WebApp: React.FC = () => (
  <>
    <BrowserRouter basename={BASE_PATH}>
      <Switch>
        <Route exact path="/" render={() => <MainRoute />} />
        <Route
          path={ROUTES_CONFIG.tile}
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
                <TornOutTile symbol={symbol!} view={view} />
              </TearOutRouteWrapper>
            )
          }}
        />
        <TearOutContext.Provider value={{ isTornOut: true }}>
          <Route
            path={ROUTES_CONFIG.tiles}
            render={() => {
              return <LiveRates />
            }}
          />
          <Route
            path={ROUTES_CONFIG.blotter}
            render={() => {
              return <Trades />
            }}
          />
          <Route
            path={ROUTES_CONFIG.analytics}
            render={() => {
              return <Analytics hideIfMatches={""} />
            }}
          />
        </TearOutContext.Provider>
      </Switch>
    </BrowserRouter>
    <DisconnectionOverlay />
  </>
)
