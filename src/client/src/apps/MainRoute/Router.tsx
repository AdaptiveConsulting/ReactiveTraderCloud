import React, { FC } from 'react'
import { Route, Switch } from 'react-router-dom'
import { RouteWrapper } from 'rt-components'
import { OpenFinWindowFrame, OpenFinSubWindowFrame } from 'rt-platforms/openfin-platform/components'
import { StatusDisplayContainer } from 'rt-platforms/openfin-platform/components/OpenFinStatusConnection/StatusContainers'
import { currencyFormatter } from 'rt-util'
import { AnalyticsRoute, BlotterRoute, SpotRoute, ShellRoute, TileRoute } from './routes'
import { useDispatch, useSelector } from 'react-redux'
import { Trade } from 'rt-types'
import { GlobalState } from 'StoreTypes'
import { OpenFinContactDisplay } from 'rt-platforms/openfin-platform/components/OpenFinContactButton'

export const Router: FC = () => {
  const dispatch = useDispatch()
  const switchHighlight = (trade: Trade, on: boolean) => ({
    ...trade,
    highlight: on,
  })

  const trades = useSelector((state: GlobalState) => state.blotterService.trades)

  navigator.serviceWorker.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'highlight-trade') {
      const tradeNotification = event.data.payload
      const trade = trades[parseInt(tradeNotification.tradeId)]
      trade && dispatch({ type: '@ReactiveTraderCloud/BLOTTER_SERVICE_HIGHLIGHT_TRADE', payload: { trades: [switchHighlight(trade as Trade, true)] } })
    }
  });

  return (
    <Switch>
      <Route
        path="/analytics"
        render={() => (
          <RouteWrapper windowType="sub" title="Analytics">
            <AnalyticsRoute />
          </RouteWrapper>
        )}
      />
      <Route
        path="/blotter"
        render={routeProps => (
          <RouteWrapper windowType="sub" title="Trades">
            <BlotterRoute {...routeProps} />
          </RouteWrapper>
        )}
      />

      <Route
        path="/tiles"
        render={() => (
          <RouteWrapper windowType="sub" title="Live Rates">
            <TileRoute />
          </RouteWrapper>
        )}
      />
      <Route
        path="/spot/:symbol"
        render={routeProps => (
          <RouteWrapper windowType="sub" title={currencyFormatter(routeProps.match.params.symbol)}>
            <SpotRoute {...routeProps} />
          </RouteWrapper>
        )}
      />
      <Route
        exact
        path="/"
        render={() => (
          <RouteWrapper>
            <ShellRoute />
          </RouteWrapper>
        )}
      />

      <Route path="/openfin-window-frame" render={() => <OpenFinWindowFrame />} />
      <Route path="/openfin-sub-window-frame" render={() => <OpenFinSubWindowFrame />} />
    </Switch>
  )
}
    <Route path="/openfin-window-frame" render={() => <OpenFinWindowFrame />} />
    <Route path="/openfin-sub-window-frame" render={() => <OpenFinSubWindowFrame />} />
    <Route path="/status" render={() => <StatusDisplayContainer />}/>
    <Route path="/contact" render={() => <OpenFinContactDisplay />}/>
  </Switch>
)
