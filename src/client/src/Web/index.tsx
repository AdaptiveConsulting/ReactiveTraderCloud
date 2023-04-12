import { lazy, Suspense } from "react"
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
  useParams,
} from "react-router-dom"

import { Admin } from "@/App/Admin"
import { Analytics } from "@/App/Analytics"
import { CreditRfqForm } from "@/App/Credit"
import { LiveRates } from "@/App/LiveRates"
import { TileView } from "@/App/LiveRates/selectedView"
import { TornOutTile } from "@/App/LiveRates/Tile/TearOut/TornOutTile"
import { TearOutContext } from "@/App/TearOutSection/tearOutContext"
import { CreditTrades, FxTrades } from "@/App/Trades"
import { DisconnectionOverlay } from "@/components/DisconnectionOverlay"
import { Loader } from "@/components/Loader"
import { BASE_PATH, ROUTES_CONFIG } from "@/constants"
import { isMobileDevice } from "@/utils"
import { FEATURE_FLAG, useFeature } from "@/utils/featureFlag"
import { WithChildren } from "@/utils/utilityTypes"

import CreditPage from "./CreditPage"
import { FxPage } from "./FxPage"
import { TearOutRouteWrapper } from "./Web.styles"

const StyleguidePage = lazy(() => import("@/styleguide"))
const SellSidePage = lazy(() => import("./SellSidePage"))

// Note: for the Redirect (or anything) to work, the Route components above it must be at the
//       top level of the switch e.g. no fragments, context providers ..

const TornOut = ({ children }: WithChildren) => (
  <TearOutContext.Provider value={{ isTornOut: true }}>
    {children}
    <DisconnectionOverlay />
  </TearOutContext.Provider>
)

export const TileWrapper = () => {
  const { symbol } = useParams()
  const { search } = useLocation()
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
              <FxPage />
            </>
          }
        />
        {canDisplayCredit && (
          <Route
            path={ROUTES_CONFIG.credit}
            element={
              <>
                <DisconnectionOverlay />
                <CreditPage />
              </>
            }
          />
        )}
        {canDisplayCredit && (
          <Route
            path={ROUTES_CONFIG.sellSide}
            element={
              <Suspense fallback={<Loader />}>
                <DisconnectionOverlay />
                <SellSidePage />
              </Suspense>
            }
          />
        )}
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
        <Route path={ROUTES_CONFIG.tile} element={<TileWrapper />} />

        <Route
          path={ROUTES_CONFIG.styleguide}
          element={
            <Suspense fallback={<Loader />}>
              <StyleguidePage />
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
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  )
}
