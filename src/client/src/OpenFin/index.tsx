import { lazy, Suspense } from "react"
import { BrowserRouter, Route, Routes } from "react-router-dom"

import { TornOutTileWrapper } from "@/App/LiveRates/Tile" // TODO check
import { DisconnectionOverlay } from "@/components/DisconnectionOverlay"
import { DocTitle } from "@/components/DocTitle"
import { Loader } from "@/components/Loader"
import { BASE_PATH, ROUTES_CONFIG } from "@/constants"
import { OpenFinContactDisplay } from "@/OpenFin/Footer/ContactUsButton"

import LimitCheckerRoutes from "./apps/LimitChecker"
import { Snapshots } from "./Snapshots/Snapshots"
import { ChildWindowFrame } from "./Window/ChildWindowFrame"
import { WindowFrame } from "./Window/WindowFrame"

const Launcher = lazy(() => import("@/OpenFin/apps/Launcher"))

const Analytics = lazy(() => import("@/App/Analytics/Analytics"))
const FxTrades = lazy(() => import("@/App/Trades/FxTrades"))
const LiveRates = lazy(() => import("@/App/LiveRates/LiveRates"))
const CreditRfqs = lazy(() => import("@/App/Credit/CreditRfqs/CreditRfqs"))
const CreditTrades = lazy(() => import("@/App/Trades/CreditTrades"))
const CreditRfqForm = lazy(
  () => import("@/App/Credit/CreditRfqForm/CreditRfqForm"),
)
const SellSidePage = lazy(() => import("@/Web/SellSidePage"))

export const OpenFinApp = () => (
  <BrowserRouter basename={BASE_PATH}>
    <Routes>
      {/* Launcher */}

      <Route
        path={ROUTES_CONFIG.launcher}
        element={
          <Suspense fallback={<Loader />}>
            <Launcher />
          </Suspense>
        }
      />

      {/* FX */}

      <Route
        path={ROUTES_CONFIG.analytics}
        element={
          <DocTitle title="Analytics">
            <Analytics hideIfMatches={null} />
            <DisconnectionOverlay />
          </DocTitle>
        }
      />
      <Route
        path={ROUTES_CONFIG.blotter}
        element={
          <DocTitle title="Trades">
            <FxTrades />
            <DisconnectionOverlay />
          </DocTitle>
        }
      />
      <Route
        path={ROUTES_CONFIG.tiles}
        element={
          <DocTitle title="Live Rates">
            <LiveRates />
            <DisconnectionOverlay />
          </DocTitle>
        }
      />
      <Route path={ROUTES_CONFIG.tile} element={<TornOutTileWrapper />} />

      {/* Credit */}

      <Route
        path={ROUTES_CONFIG.creditRfqs}
        element={
          <DocTitle title="RFQs">
            <DisconnectionOverlay />
            <CreditRfqs />
          </DocTitle>
        }
      />
      <Route
        path={ROUTES_CONFIG.creditBlotter}
        element={
          <DocTitle title="Trades">
            <DisconnectionOverlay />
            <CreditTrades />
          </DocTitle>
        }
      />

      <Route
        path={ROUTES_CONFIG.newRfq}
        element={
          <DocTitle title="New RFQ">
            <DisconnectionOverlay />
            <CreditRfqForm />
          </DocTitle>
        }
      />
      <Route
        path={ROUTES_CONFIG.sellSide}
        element={
          <DocTitle title="Adaptive Bank RFQ Queue">
            <DisconnectionOverlay />
            <SellSidePage />
          </DocTitle>
        }
      />

      {/* ..the rest */}
      <Route
        path={`${ROUTES_CONFIG.limitChecker}/*`}
        element={
          <Suspense fallback={<Loader />}>
            <LimitCheckerRoutes />
          </Suspense>
        }
      />

      <Route
        path="/openfin-window-frame"
        element={<WindowFrame admin={false} />}
      />
      <Route
        path="/openfin-admin-window-frame"
        element={<WindowFrame admin={true} />}
      />
      <Route path="/openfin-sub-window-frame" element={<ChildWindowFrame />} />
      <Route path={ROUTES_CONFIG.contact} element={<OpenFinContactDisplay />} />
      <Route path={ROUTES_CONFIG.snapshots} element={<Snapshots />} />

      <Route path={ROUTES_CONFIG.status} element={<div />} />
    </Routes>
  </BrowserRouter>
)
