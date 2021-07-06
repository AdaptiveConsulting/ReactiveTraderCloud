import { Subscribe } from "@react-rxjs/core"
import { BrowserRouter, Route, Switch } from "react-router-dom"
import { Analytics } from "@/App/Analytics"
import { TileView } from "@/App/LiveRates/selectedView"
import { Trades } from "@/App/Trades"
import { Loader } from "@/components/Loader"
import { DetachableLiveRates } from "./DetachableTile/DetachableLiveRates"
import { DetachableTile } from "./DetachableTile/DetachableTile"
import { ChildWindowFrame } from "./Window/ChildWindowFrame"
import { WindowFrame } from "./Window/WindowFrame"

export const OpenFinApp: React.FC = () => (
  <BrowserRouter basename={import.meta.env.BASE_URL}>
    <Switch>
      <Route
        path="/analytics"
        render={() => <Analytics hideIfMatches={null} />}
      />

      <Route path="/blotter" render={() => <Trades />} />
      <Route path="/tiles" render={() => <DetachableLiveRates />} />

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

          const loader = (
            <Loader
              ariaLabel="Loading live FX exchange rates"
              minWidth="22rem"
              minHeight="22rem"
            />
          )

          return (
            <Subscribe fallback={loader}>
              <DetachableTile symbol={symbol} view={view} isTornOut={true} />
            </Subscribe>
          )
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
