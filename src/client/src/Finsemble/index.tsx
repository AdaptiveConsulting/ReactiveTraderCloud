import { BrowserRouter, Route, Routes } from "react-router-dom"

import { Analytics } from "@/App/Analytics"
import { LiveRates } from "@/App/LiveRates"
import { TornOutTileWrapper } from "@/App/LiveRates/Tile"
import { FxTrades } from "@/App/Trades"
import { DisconnectionOverlay } from "@/components/DisconnectionOverlay"
import { DocTitle } from "@/components/DocTitle"
import { BASE_PATH, ROUTES_CONFIG } from "@/constants"

export const FinsembleApp = () => (
  <BrowserRouter basename={BASE_PATH}>
    <Routes>
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
    </Routes>
  </BrowserRouter>
)
