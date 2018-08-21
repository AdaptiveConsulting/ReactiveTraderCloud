import React, { SFC } from 'react'
import { BrowserRouter, Route, RouteComponentProps, Switch } from 'react-router-dom'
import { AnalyticsContainer } from '.././ui/analytics'
import { BlotterContainer } from '../ui/blotter'
import { SpotTileContainer } from '../ui/spotTile'
import { DefaultLayout } from './layouts'

const SpotRoute = ({ match }: RouteComponentProps<{ symbol: string }>) => <SpotTileContainer id={match.params.symbol} />

export const Router: SFC = () => (
  <BrowserRouter>
    <Switch>
      <Route exact path="/" component={DefaultLayout} />
      <Route path="/analytics" component={AnalyticsContainer} />
      <Route path="/blotter" component={BlotterContainer} />
      <Route path="/spot/:symbol" component={SpotRoute} />
    </Switch>
  </BrowserRouter>
)
