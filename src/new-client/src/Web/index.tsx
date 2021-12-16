import { FC, PropsWithChildren } from "react"
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
import { lazy, Suspense } from "react"

const StyleguideRoute = lazy(() => import("@/styleguide"))

const WithDisconnectionOverlay: FC<PropsWithChildren<{}>> = ({ children }) => (
  <>
    {children}
    <DisconnectionOverlay />
  </>
)

export const WebApp: React.FC = () => (
  <Suspense fallback={<div />}>
    <BrowserRouter basename={BASE_PATH}>
      <Switch>
        <Route
          exact
          path="/"
          render={() => (
            <WithDisconnectionOverlay>
              <MainRoute />
            </WithDisconnectionOverlay>
          )}
        />
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
              <WithDisconnectionOverlay>
                <TearOutRouteWrapper>
                  <TornOutTile symbol={symbol!} view={view} />
                </TearOutRouteWrapper>
              </WithDisconnectionOverlay>
            )
          }}
        />
        <TearOutContext.Provider value={{ isTornOut: true }}>
          <Route
            path={ROUTES_CONFIG.tiles}
            render={() => (
              <WithDisconnectionOverlay>
                <LiveRates />
              </WithDisconnectionOverlay>
            )}
          />
          <Route
            path={ROUTES_CONFIG.blotter}
            render={() => (
              <WithDisconnectionOverlay>
                <Trades />
              </WithDisconnectionOverlay>
            )}
          />
          <Route
            path={ROUTES_CONFIG.analytics}
            render={() => (
              <WithDisconnectionOverlay>
                <Analytics hideIfMatches={""} />
              </WithDisconnectionOverlay>
            )}
          />
        </TearOutContext.Provider>
        <Route
          path={ROUTES_CONFIG.styleguide}
          render={() => <StyleguideRoute />}
        />
      </Switch>
    </BrowserRouter>
  </Suspense>
)
