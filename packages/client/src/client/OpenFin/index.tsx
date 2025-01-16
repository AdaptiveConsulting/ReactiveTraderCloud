import { lazy, Suspense } from "react"
import { BrowserRouter, Route, Routes } from "react-router-dom"
import { ThemeProvider } from "styled-components"

import { TornOutTileWrapper } from "@/client/App/LiveRates/Tile"
import { DisconnectionOverlay } from "@/client/components/DisconnectionOverlay"
import { DocTitle } from "@/client/components/DocTitle"
import { Loader } from "@/client/components/Loader"
import { BASE_PATH, ROUTES_CONFIG } from "@/client/constants"
import { OpenFinContactDisplay } from "@/client/OpenFin/Footer/ContactUsButton"
import { ThemeName, themes } from "@/client/theme"

import { Snapshots } from "./Snapshots/Snapshots"
import { ChildWindowFrame } from "./Window/ChildWindowFrame"
import { LimitCheckerWindowFrame } from "./Window/LimitCheckerWindowFrame"
import { WindowFrame } from "./Window/WindowFrame"

const Launcher = lazy(() => import("@/client/OpenFin/apps/Launcher"))

const LimitChecker = lazy(() => import("./apps/LimitChecker/LimitChecker"))
const Analytics = lazy(() => import("@/client/App/Analytics/Analytics"))
const FxTrades = lazy(() => import("@/client/App/Trades/FxTrades"))
const LiveRates = lazy(() => import("@/client/App/LiveRates/LiveRates"))
const CreditRfqs = lazy(
  () => import("@/client/App/Credit/CreditRfqs/CreditRfqs"),
)
const CreditTrades = lazy(() => import("@/client/App/Trades/CreditTrades"))
const CreditRfqForm = lazy(() => import("@/client/App/Credit/NewRfq/NewRfq"))
const SellSidePage = lazy(() => import("@/client/Web/SellSidePage"))

export const OpenFinApp = () => (
  <BrowserRouter basename={BASE_PATH}>
    <Routes>
      {/* Launcher */}

      <Route
        path={ROUTES_CONFIG.launcher}
        element={
          <ThemeProvider theme={themes[ThemeName.Dark]}>
            <Suspense fallback={<Loader opacity={1} />}>
              <Launcher />
            </Suspense>
          </ThemeProvider>
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
        path={ROUTES_CONFIG.limitChecker}
        element={
          <ThemeProvider theme={themes[ThemeName.Dark]}>
            <DocTitle title="Limit Checker">
              <LimitChecker />
              <DisconnectionOverlay />
            </DocTitle>
          </ThemeProvider>
        }
      />

      <Route path="/openfin-window-frame" element={<WindowFrame />} />
      <Route
        path="/openfin-admin-window-frame"
        element={
          <ThemeProvider theme={themes[ThemeName.Dark]}>
            <LimitCheckerWindowFrame />
          </ThemeProvider>
        }
      />
      <Route path="/openfin-sub-window-frame" element={<ChildWindowFrame />} />
      <Route path={ROUTES_CONFIG.contact} element={<OpenFinContactDisplay />} />
      <Route path={ROUTES_CONFIG.snapshots} element={<Snapshots />} />

      <Route path={ROUTES_CONFIG.status} element={<div />} />
    </Routes>
  </BrowserRouter>
)
