import { Subscribe } from "@react-rxjs/core"
import { BrowserRouter, Route, Switch } from "react-router-dom"

import { Analytics } from "@/App/Analytics"
import { LiveRates } from "@/App/LiveRates"
import { TileView } from "@/App/LiveRates/selectedView"
import { Trades } from "@/App/Trades"
import { Loader } from "@/components/Loader"
import { DocTitle } from "@/components/DocTitle"
import { TileContent } from "./TileContent"
import { BASE_URL } from "@/constants"

export const FinsembleApp: React.FC = () => (
  <BrowserRouter basename={BASE_URL}>
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

          const loader = (
            <Loader
              ariaLabel="Loading live FX exchange rates"
              minWidth="22rem"
              minHeight="22rem"
            />
          )
          return (
            <Subscribe fallback={loader}>
              <TileContent symbol={symbol} view={view} />
            </Subscribe>
          )
        }}
      />
    </Switch>
  </BrowserRouter>
)
