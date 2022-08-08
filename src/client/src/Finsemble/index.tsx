import { BrowserRouter, Route, Switch } from "react-router-dom"
import { Analytics } from "@/App/Analytics"
import { LiveRates } from "@/App/LiveRates"
import { TileView } from "@/App/LiveRates/selectedView"
import { FxTrades } from "@/App/Trades"
import { DocTitle } from "@/components/DocTitle"
import { BASE_PATH, ROUTES_CONFIG } from "@/constants"
import { TornOutTile } from "@/App/LiveRates/Tile/TearOut/TornOutTile"
import { DisconnectionOverlay } from "@/components/DisconnectionOverlay"

export const FinsembleApp: React.FC = () => (
  <BrowserRouter basename={BASE_PATH}>
    <Switch>
      <Route
        path={ROUTES_CONFIG.analytics}
        render={() => (
          <DocTitle title="Analytics">
            <Analytics hideIfMatches={null} />
            <DisconnectionOverlay />
          </DocTitle>
        )}
      />
      <Route
        path={ROUTES_CONFIG.blotter}
        render={() => (
          <DocTitle title="Trades">
            <FxTrades />
            <DisconnectionOverlay />
          </DocTitle>
        )}
      />
      <Route
        path={ROUTES_CONFIG.tiles}
        render={() => (
          <DocTitle title="Live Rates">
            <LiveRates />
            <DisconnectionOverlay />
          </DocTitle>
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
              <TornOutTile
                symbol={symbol!}
                view={view}
                supportsTearOut={false}
              />
              <DisconnectionOverlay />
            </>
          )
        }}
      />
    </Switch>
  </BrowserRouter>
)
