import { Subscribe } from "@react-rxjs/core"
import { BrowserRouter, Route, Switch } from "react-router-dom"
import { Analytics } from "@/App/Analytics"
import { Trades } from "@/App/Trades"
import { Loader } from "@/components/Loader"
import { Snapshots } from "./Snapshots/Snapshots"
import { ChildWindowFrame } from "./Window/ChildWindowFrame"
import { WindowFrame } from "./Window/WindowFrame"
import { DocTitle } from "@/components/DocTitle"
import { OpenFinContactDisplay } from "@/OpenFin/Footer/ContactUsButton"
import { TearOutTile, Tiles } from "./Tiles"
import { TileView } from "@/App/LiveRates/selectedView"

export const OpenFinApp: React.FC = () => (
  <BrowserRouter basename={import.meta.env.BASE_URL}>
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
        render={() => {
          const loader = (
            <Loader
              ariaLabel="Loading live FX exchange rates"
              minWidth="22rem"
              minHeight="22rem"
            />
          )
          return (
            <DocTitle title="Live Rates">
              <Subscribe fallback={loader}>
                <Tiles />
              </Subscribe>
            </DocTitle>
          )
        }}
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

          return <TearOutTile symbol={symbol} view={view} />
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
