import { BrowserRouter, Route, Switch } from "react-router-dom"
import { Analytics } from "@/App/Analytics"
import { LiveRates } from "@/App/LiveRates"
import { TileView } from "@/App/LiveRates/selectedView"
import { Trades } from "@/App/Trades"
import { FloatingTile } from "./FloatingTile"
import { ChildWindowFrame } from "./ChildWindowFrame"
import { WindowFrame } from "./WindowFrame"

export const OpenFinApp: React.FC = () => (
  <BrowserRouter>
    <Switch>
      <Route
        path="/analytics"
        render={() => <Analytics hideIfMatches={null} />}
      />
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

      <Route path="/openfin-window-frame" render={() => <WindowFrame />} />
      <Route
        path="/openfin-sub-window-frame"
        render={() => <ChildWindowFrame />}
      />
      <Route path="/status" render={() => <div />} />
      <Route path="/contact" render={() => <div />} />
      <Route path="/snapshots" render={() => <div />} />
    </Switch>
  </BrowserRouter>
)
