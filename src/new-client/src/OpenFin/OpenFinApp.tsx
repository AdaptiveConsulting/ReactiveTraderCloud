import { BrowserRouter, Route, Switch } from "react-router-dom"
import { Analytics } from "@/App/Analytics"
import { Trades } from "@/App/Trades"
import { Snapshots } from "./Snapshots/Snapshots"
import { ChildWindowFrame } from "./Window/ChildWindowFrame"
import { WindowFrame } from "./Window/WindowFrame"
import { DocTitle } from "@/components/DocTitle"
import { OpenFinContactDisplay } from "@/OpenFin/Footer/ContactUsButton"
import { TileView } from "@/App/LiveRates/selectedView"
import { BASE_PATH } from "@/constants"
import { LiveRates } from "@/App/LiveRates"
import { TornOutTile } from "@/App/LiveRates/Tile/TearOut/TornOutTile"

export const OpenFinApp: React.FC = () => (
  <BrowserRouter basename={BASE_PATH}>
    <Switch>
      <Route
        path="/analytics"
        render={() => (
          <DocTitle title="Analytics">
            <Analytics hideIfMatches={null} />
          </DocTitle>
        )}
      />
      <Route
        path="/blotter"
        render={() => (
          <DocTitle title="Trades">
            <Trades />
          </DocTitle>
        )}
      />
      <Route
        path="/tiles"
        render={() => (
          <DocTitle title="Live Rates">
            <LiveRates />
          </DocTitle>
        )}
      />
      <Route
        path="/spot/:symbol"
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
            <TornOutTile symbol={symbol} view={view} supportsTearOut={false} />
          )
        }}
      />
      <Route path="/contact" render={() => <OpenFinContactDisplay />} />
      <Route path="/openfin-window-frame" render={() => <WindowFrame />} />
      <Route
        path="/openfin-sub-window-frame"
        render={() => <ChildWindowFrame />}
      />
      <Route path="/status" render={() => <div />} />
      <Route path="/snapshots" render={() => <Snapshots />} />
    </Switch>
  </BrowserRouter>
)
