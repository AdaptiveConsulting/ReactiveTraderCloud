import * as React from 'react'
import { connect } from 'react-redux'

import { addRegion, openWindow } from '../../regions/regionsOperations'
import SpotTile from './SpotTile';
import {
  dismissNotification,
  displayCurrencyChart,
  executeTrade,
  spotRegionSettings,
  undockTile
} from './spotTileOperations';
import { CurrencyPair } from '../../types/currencyPair';
import Environment from '../../system/environment';
import { Direction } from '../../types/direction';

interface SpotTileContainerOwnProps {
  id: string
}

interface SpotTileContainerStateProps {
  isConnected: boolean
  canPopout: boolean
  referenceService: any
  spotTiles: any
  notionals: any
}

interface SpotTileContainerDispatchProps {
  executeTrade: (direction: Direction) => void
  onComponentMount: (id: string) => void
  onPopoutClick: (region: any, openFin: any) => any
  undockTile: (openFin: any, title: string) => any
  displayCurrencyChart: (openFin: any, symbol: string) => any
  onNotificationDismissedClick: (symbol: string) => any
}

type SpotTileContainerProps = SpotTileContainerOwnProps & SpotTileContainerStateProps & SpotTileContainerDispatchProps

const NOTIONAL = 1000000

class SpotTileContainer extends React.Component<SpotTileContainerProps, any> {

  static contextTypes = {
    openFin: React.PropTypes.object
  }

  render() {
    const openFin = this.context.openFin
    const key = this.props.id
    const currencyPair: CurrencyPair = this.props.referenceService[key] ? this.props.referenceService[key].currencyPair : 'AUDUSD'
    const title = `${currencyPair.base} / ${currencyPair.terms}`
    const spotData = this.props.spotTiles[key]
    const tileProps = {
      id: key,
      title,
      currencyPair,
      canPopout: Environment.isRunningInIE(),
      currencyChartIsOpening: spotData.currencyChartIsOpening,
      currentSpotPrice: spotData,
      executionConnected: true,
      hasNotification: !!spotData.notification,
      isTradable: true, // or false if prace is stale
      isRunningInOpenFin: !!openFin,
      isTradeExecutionInFlight: spotData.isTradeExecutionInFlight,
      notification: spotData.notification,
      notional: this.props.notionals[currencyPair.symbol] || NOTIONAL,
      priceStale: spotData.priceStale,
      pricingConnected: spotData.pricingConnected,
      executeTrade: this.props.executeTrade,
      onComponentMount: () => this.props.onComponentMount(this.props.id),
      undockTile: this.props.undockTile(openFin, title),
      onPopoutClick: this.props.onPopoutClick(this.props.id, openFin),
      onNotificationDismissedClick: this.props.onNotificationDismissedClick(this.props.id),
      displayCurrencyChart: this.props.displayCurrencyChart(openFin, this.props.id)
    }

    return (
      <SpotTile
        {...tileProps}
      />
    )
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    executeTrade: (payload) => {
      dispatch(executeTrade(payload))
    },
    onComponentMount: (id) => {
      dispatch(addRegion(spotTileRegion(id)))
    },
    onPopoutClick: (id, openFin) => {
      return () => {
        dispatch(openWindow(spotTileRegion(id), openFin))
      }
    },
    undockTile: (openFin, tileName) => {
      return () => {
        dispatch(undockTile({ openFin, tileName }))
      }
    },
    displayCurrencyChart: (openFin, symbol) => {
      return () => {
        dispatch(displayCurrencyChart({ openFin, symbol }))
      }
    },
    onNotificationDismissedClick: (symbol) => {
      return () => {
        dispatch(dismissNotification({ symbol }))
      }
    }
  }
}

function mapStateToProps({ referenceService, compositeStatusService, displayAnalytics, spotTiles, notionals }) {
  const isConnected = compositeStatusService && compositeStatusService.analytics && compositeStatusService.analytics.isConnected || false
  return { referenceService, isConnected, displayAnalytics, spotTiles, notionals }
}

const ConnectedSpotTileContainer = connect(mapStateToProps, mapDispatchToProps)(SpotTileContainer)
const spotTileRegion = (id) => ({
  id,
  isTearedOff: false,
  container: connect((state) => ({ id }))(ConnectedSpotTileContainer),
  settings: spotRegionSettings(id)
})

export default ConnectedSpotTileContainer
