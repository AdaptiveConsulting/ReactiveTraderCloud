import { Admin } from "@/App/Admin"
import { Analytics } from "@/App/Analytics"
import { CreditRfqForm, CreditSellSideTicket } from "@/App/Credit"
import { LiveRates } from "@/App/LiveRates"
import { TileView } from "@/App/LiveRates/selectedView"
import { TornOutTile } from "@/App/LiveRates/Tile/TearOut/TornOutTile"
import { Trades } from "@/App/Trades"
import { DisconnectionOverlay } from "@/components/DisconnectionOverlay"
import { BASE_PATH, ROUTES_CONFIG } from "@/constants"
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

  return (
    <Suspense fallback={<div />}>
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
          <Route
            exact
            path={ROUTES_CONFIG.credit}
            render={() => (
              <>
                <DisconnectionOverlay />
                <MainCreditRoute />
              </>
            )}
          />
          <Route
            path={ROUTES_CONFIG.sellSideTicket}
            render={({
              match: {
                params: { rfqId, dealerId },
              },
            }) => (
              <>
                <DisconnectionOverlay />
                <CreditSellSideTicket
                  rfqId={parseInt(rfqId!, 10)}
                  dealerId={parseInt(dealerId!, 10)}
                />
              </>
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
            render={() => <StyleguideRoute />}
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
            <Route
              path={ROUTES_CONFIG.newRfq}
              render={() => {
                return (
                  <>
                    <CreditRfqForm />
                    <DisconnectionOverlay />
                  </>
                )
              }}
            />
          </TearOutContext.Provider>
        </Switch>
      </BrowserRouter>
    </Suspense>
  )
}
