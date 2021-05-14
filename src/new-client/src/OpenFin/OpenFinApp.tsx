import { BrowserRouter, Route, Switch } from "react-router-dom"
import { Analytics } from "@/App/Analytics"
import { LiveRates } from "@/App/LiveRates"
import { Trades } from "@/App/Trades"
import { FloatingTile } from "./FloatingTile"
import { TileView } from "@/App/LiveRates/selectedView"

export const OpenFinApp: React.FC = () => (
  <BrowserRouter>
    <Switch>
      <Route path="/analytics" render={() => <Analytics />} />

      <Route path="/blotter" render={() => <Trades />} />

      <Route path="/tiles" render={() => <LiveRates />} />

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

          return <FloatingTile symbol={symbol} view={view} />
        }}
      />

      <Route path="/openfin-window-frame" render={() => <div />} />
      <Route path="/openfin-sub-window-frame" render={() => <div />} />
      <Route path="/status" render={() => <div />} />
      <Route path="/contact" render={() => <div />} />
      <Route path="/snapshots" render={() => <div />} />
    </Switch>
  </BrowserRouter>
)
