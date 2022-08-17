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
import { FEATURE_FLAG, useFeature } from "@/utils/featureFlag"
import { lazy } from "react"
import { BrowserRouter, Route, Switch } from "react-router-dom"
import { TearOutContext } from "../App/TearOutSection/tearOutContext"
import MainCreditRoute from "./MainCreditRoute"
import { MainFxRoute } from "./MainFxRoute"
import { TearOutRouteWrapper } from "./Web.styles"

const StyleguideRoute = lazy(() => import("@/styleguide"))

export const WebApp: React.FC = () => {
  const canUseAdmin = useFeature(FEATURE_FLAG.ADMIN)

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
                  <FxTrades />
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
          <Route
            path={ROUTES_CONFIG.creditBlotter}
            render={() => {
              return (
                <>
                  <CreditTrades />
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
