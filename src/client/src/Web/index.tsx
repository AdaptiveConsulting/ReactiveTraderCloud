import { Admin } from "@/App/Admin"
import { Analytics } from "@/App/Analytics"
import { LiveRates } from "@/App/LiveRates"
import { TileView } from "@/App/LiveRates/selectedView"
import { TornOutTile } from "@/App/LiveRates/Tile/TearOut/TornOutTile"
import { Trades } from "@/App/Trades"
import { DisconnectionOverlay } from "@/components/DisconnectionOverlay"
import { Loader } from "@/components/Loader"
import { BASE_PATH, ROUTES_CONFIG } from "@/constants"
import { isMobileDevice } from "@/utils"
import { FEATURE_FLAG, useFeature } from "@/utils/featureFlag"
import { lazy, Suspense } from "react"
import { BrowserRouter, Route, Switch } from "react-router-dom"
import { TearOutContext } from "../App/TearOutSection/tearOutContext"
import { MainFxRoute } from "./MainFxRoute"
import { TearOutRouteWrapper } from "./Web.styles"

const StyleguideRoute = lazy(() => import("@/styleguide"))
const MainCreditRoute = lazy(() => import("./MainCreditRoute"))

export const WebApp: React.FC = () => {
  const canUseAdmin = useFeature(FEATURE_FLAG.ADMIN)

  const canDisplayCredit = !isMobileDevice
  return (
    <BrowserRouter basename={BASE_PATH}>
      <Switch>
        <Route
          exact
          path="/"
          render={() => (
            <>
              <DisconnectionOverlay />
              <MainFxRoute />
            </>
          )}
        />
        {canDisplayCredit && (
          <Route
            exact
            path={ROUTES_CONFIG.credit}
            render={() => (
              <>
                <DisconnectionOverlay />
                <Suspense fallback={<Loader />}>
                  <MainCreditRoute />
                </Suspense>
              </>
            )}
          />
        )}
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
              <>
                <DisconnectionOverlay />
                <TearOutRouteWrapper>
                  <TornOutTile symbol={symbol!} view={view} />
                </TearOutRouteWrapper>
              </>
            )
          }}
        />
        <Route
          path={ROUTES_CONFIG.styleguide}
          render={() => (
            <Suspense fallback={<Loader />}>
              <StyleguideRoute />
            </Suspense>
          )}
        />
        {canUseAdmin && (
          <Route path={ROUTES_CONFIG.admin} render={() => <Admin />} />
        )}
        <TearOutContext.Provider value={{ isTornOut: true }}>
          <Route
            path={ROUTES_CONFIG.tiles}
            render={() => {
              return (
                <>
                  <LiveRates />
                  <DisconnectionOverlay />
                </>
              )
            }}
          />
          <Route
            path={ROUTES_CONFIG.blotter}
            render={() => {
              return (
                <>
                  <Trades />
                  <DisconnectionOverlay />
                </>
              )
            }}
          />
          <Route
            path={ROUTES_CONFIG.analytics}
            render={() => {
              return (
                <>
                  <Analytics hideIfMatches={""} />
                  <DisconnectionOverlay />
                </>
              )
            }}
          />
        </TearOutContext.Provider>
      </Switch>
    </BrowserRouter>
  )
}
