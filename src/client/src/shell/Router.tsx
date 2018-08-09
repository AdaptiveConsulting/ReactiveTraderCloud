import React, { SFC } from 'react'
import { BrowserRouter, Route, RouteComponentProps, Switch } from 'react-router-dom'
import { AnalyticsContainer } from 'ui/analytics'
import ConnectedBlotterContainer from 'ui/blotter/BlotterContainer'
import SpotTileContainer from 'ui/spotTile/SpotTileContainer'
import ShellContainer from './ShellContainer'

const SpotRoute = ({ match }: RouteComponentProps<{ symbol: string }>) => <SpotTileContainer id={match.params.symbol} />

export const Router: SFC = () => (
  <BrowserRouter>
    <Switch>
      <Route exact path="/" component={ShellContainer} />
      <Route path="/analytics" component={AnalyticsContainer} />
      <Route path="/blotter" component={ConnectedBlotterContainer} />
      <Route path="/spot/:symbol" component={SpotRoute} />
    </Switch>
  </BrowserRouter>
)
