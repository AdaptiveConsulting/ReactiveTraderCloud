import { lazy, Suspense } from "react"
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom"

import { Admin } from "@/client/App/Admin"
import { Analytics } from "@/client/App/Analytics"
import { NewRfq } from "@/client/App/Credit"
import { LiveRates } from "@/client/App/LiveRates"
import { TornOutTileWrapper } from "@/client/App/LiveRates/Tile"
import { TornOut } from "@/client/App/TearOutSection/TearOutWrapper"
import { CreditTrades, FxTrades } from "@/client/App/Trades"
import { DisconnectionOverlay } from "@/client/components/DisconnectionOverlay"
import { Loader } from "@/client/components/Loader"
import { BASE_PATH, ROUTES_CONFIG } from "@/client/constants"
import { isMobileDevice } from "@/client/utils"
import { FEATURE_FLAG, useFeature } from "@/client/utils/featureFlag"

import CreditPage from "./CreditPage"
import { FxPage } from "./FxPage"
import MainLayout from "./MainLayout"

const SellSidePage = lazy(() => import("./SellSidePage"))

export const WebApp = () => {
  const canUseAdmin = useFeature(FEATURE_FLAG.ADMIN)
  const canDisplayCredit = !isMobileDevice

  return (
    <BrowserRouter basename={BASE_PATH}>
      <Routes>
        <Route path="/" element={<MainLayout />}>
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
        </Route>
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
                <NewRfq />
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
        <Route path={ROUTES_CONFIG.tile} element={<TornOutTileWrapper />} />

        {/* <Route
          path={ROUTES_CONFIG.styleguide}
          element={
            <Suspense fallback={<Loader />}>
              <StyleguidePage />
            </Suspense>
          }
        /> TODO: either remove if UISK takes this role, or refactor with new branding - https://weareadaptive.atlassian.net/jira/software/c/projects/SU/boards/284?selectedIssue=SU-47 */}

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
