import { Admin } from "@/App/Admin"
import { Analytics } from "@/App/Analytics"
import { CreditRfqForm, CreditSellSideTicket } from "@/App/Credit"
import { LiveRates } from "@/App/LiveRates"
import { TileView } from "@/App/LiveRates/selectedView"
import { TornOutTile } from "@/App/LiveRates/Tile/TearOut/TornOutTile"
import { FxTrades } from "@/App/Trades"
import CreditTrades from "@/App/Trades/CoreCreditTrades"
import { DisconnectionOverlay } from "@/components/DisconnectionOverlay"
import { BASE_PATH, ROUTES_CONFIG } from "@/constants"
import { isMobileDevice } from "@/utils"
import { FEATURE_FLAG, useFeature } from "@/utils/featureFlag"
import { lazy } from "react"
import { BrowserRouter, Redirect, Route, Switch } from "react-router-dom"
import { TearOutContext } from "../App/TearOutSection/tearOutContext"
import MainCreditRoute from "./MainCreditRoute"
import { MainFxRoute } from "./MainFxRoute"
import { TearOutRouteWrapper } from "./Web.styles"

const StyleguideRoute = lazy(() => import("@/styleguide"))

// Note: for the Redirect (or anything) to work, the Route components above it must be at the
//       top level of the switch e.g. no fragments, context providers ..

const TornOut: React.FC = ({ children }) => (
  <TearOutContext.Provider value={{ isTornOut: true }}>
    {children}
    <DisconnectionOverlay />
  </TearOutContext.Provider>
)

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
                <MainCreditRoute />
              </>
            )}
          />
        )}
        {canDisplayCredit && (
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
          render={() => <StyleguideRoute />}
        />

        {canUseAdmin && (
          <Route path={ROUTES_CONFIG.admin} render={() => <Admin />} />
        )}

        <Route
          path={ROUTES_CONFIG.tiles}
          render={() => {
            return (
              <TornOut>
                <LiveRates />
              </TornOut>
            )
          }}
        />
        <Route
          path={ROUTES_CONFIG.blotter}
          render={() => {
            return (
              <TornOut>
                <FxTrades />
              </TornOut>
            )
          }}
        />
        <Route
          path={ROUTES_CONFIG.analytics}
          render={() => {
            return (
              <TornOut>
                <Analytics hideIfMatches={""} />
              </TornOut>
            )
          }}
        />

        {canDisplayCredit && (
          <Route
            path={ROUTES_CONFIG.newRfq}
            render={() => {
              return (
                <TornOut>
                  <CreditRfqForm />
                </TornOut>
              )
            }}
          />
        )}
        {canDisplayCredit && (
          <Route
            path={ROUTES_CONFIG.creditBlotter}
            render={() => {
              return (
                <TornOut>
                  <CreditTrades />
                </TornOut>
              )
            }}
          />
        )}

        <Redirect to="/" />
      </Switch>
    </BrowserRouter>
  )
}
