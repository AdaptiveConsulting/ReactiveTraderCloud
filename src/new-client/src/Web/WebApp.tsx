import { TileView } from "@/App/LiveRates/selectedView"
import { BASE_PATH } from "@/constants"
import { TornOutTile } from "@/App/LiveRates/Tile/TearOut/TornOutTile"
import { BrowserRouter, Route, Switch } from "react-router-dom"
import { MainRoute } from "./MainRoute"
import { TearOutRouteWrapper } from "./Web.styles"
import { Trades } from "@/App/Trades"
import { Analytics } from "@/App/Analytics"
import { LiveRates } from "@/App/LiveRates"
import { TearOutContext } from "../components/tearOutContext"

export const WebApp: React.FC = () => (
  <BrowserRouter basename={BASE_PATH}>
    <Switch>
      <Route exact path="/" render={() => <MainRoute />} />
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
            <TearOutRouteWrapper>
              <TornOutTile symbol={symbol} view={view} />
            </TearOutRouteWrapper>
          )
        }}
      />
      <TearOutContext.Provider value={{ isTornOut: true }}>
        <Route
          path="/liverates"
          render={() => {
            return <LiveRates />
          }}
        />
        <Route
          path="/trades"
          render={() => {
            return <Trades />
          }}
        />
        <Route
          path="/analytics"
          render={() => {
            return <Analytics hideIfMatches={""} />
          }}
        />
      </TearOutContext.Provider>
    </Switch>
  </BrowserRouter>
)
