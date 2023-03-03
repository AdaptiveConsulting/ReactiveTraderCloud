import { Admin } from "@/App/Admin"
import { Analytics } from "@/App/Analytics"
import { CreditRfqForm } from "@/App/Credit"
import { LiveRates } from "@/App/LiveRates"
import { TileView } from "@/App/LiveRates/selectedView"
import { TornOutTile } from "@/App/LiveRates/Tile/TearOut/TornOutTile"
import { FxTrades } from "@/App/Trades"
import CreditTrades from "@/App/Trades/CoreCreditTrades"
import { DisconnectionOverlay } from "@/components/DisconnectionOverlay"
import { Loader } from "@/components/Loader"
import { BASE_PATH, ROUTES_CONFIG } from "@/constants"
import { isMobileDevice } from "@/utils"
import { FEATURE_FLAG, useFeature } from "@/utils/featureFlag"
import { WithChildren } from "@/utils/utilityTypes"
import { lazy, Suspense } from "react"
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
  useParams,
} from "react-router-dom"
import { TearOutContext } from "../App/TearOutSection/tearOutContext"
import MainCreditRoute from "./MainCreditRoute"
import { MainFxRoute } from "./MainFxRoute"
import { TearOutRouteWrapper } from "./Web.styles"

const StyleguideRoute = lazy(() => import("@/styleguide"))
const MainSellSideRoute = lazy(() => import("./MainSellSideRoute"))

// Note: for the Redirect (or anything) to work, the Route components above it must be at the
//       top level of the switch e.g. no fragments, context providers ..

const TornOut = ({ children }: WithChildren) => (
  <TearOutContext.Provider value={{ isTornOut: true }}>
    {children}
    <DisconnectionOverlay />
  </TearOutContext.Provider>
)

export const TornOutTileView = () => {
  const { search } = useLocation()
  const { symbol } = useParams()
  const query = new URLSearchParams(search)
  const view = query.has("tileView")
    ? (query.get("tileView") as TileView)
    : TileView.Analytics

  return (
    <>
      <DisconnectionOverlay />
      <TearOutRouteWrapper>
        {symbol && <TornOutTile symbol={symbol} view={view} />}
      </TearOutRouteWrapper>
    </>
  )
}

export const WebApp = () => {
  const canUseAdmin = useFeature(FEATURE_FLAG.ADMIN)
  const canDisplayCredit = !isMobileDevice

  return (
    <BrowserRouter basename={BASE_PATH}>
      <Routes>
        <Route
          path="/"
          element={
            <>
              <DisconnectionOverlay />
              <MainFxRoute />
            </>
          }
        />
        {canDisplayCredit && (
          <Route path={ROUTES_CONFIG.credit} element={<MainCreditRoute />} />
        )}
        <Suspense fallback={<Loader />}>
          <Route
            path={ROUTES_CONFIG.sellSide}
            element={
              <>
                <DisconnectionOverlay />
                <MainSellSideRoute />
              </>
            }
          />
        </Suspense>
        <Route path={ROUTES_CONFIG.tile} element={<TornOutTileView />} />

        <Route
          path={ROUTES_CONFIG.styleguide}
          element={
            <Suspense fallback={<Loader />}>
              <StyleguideRoute />
            </Suspense>
          }
        />

        {canUseAdmin && (
          <Route path={ROUTES_CONFIG.admin} element={<Admin />} />
        )}

        <Route
          path={ROUTES_CONFIG.tiles}
          element={
            <TornOut>
              <LiveRates />
            </TornOut>
          }
        />
        <Route
          path={ROUTES_CONFIG.blotter}
          element={
            <TornOut>
              <FxTrades />
            </TornOut>
          }
        />
        <Route
          path={ROUTES_CONFIG.analytics}
          element={
            <TornOut>
              <Analytics hideIfMatches={""} />
            </TornOut>
          }
        />

        {canDisplayCredit && (
          <Route
            path={ROUTES_CONFIG.newRfq}
            element={
              <TornOut>
                <CreditRfqForm />
              </TornOut>
            }
          />
        )}
        {canDisplayCredit && (
          <Route
            path={ROUTES_CONFIG.creditBlotter}
            element={
              <TornOut>
                <CreditTrades />
              </TornOut>
            }
          />
        )}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  )
}
