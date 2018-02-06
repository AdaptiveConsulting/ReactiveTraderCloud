import * as React from 'react'
import { connect } from 'react-redux'
import * as PropTypes from 'prop-types'
import { addRegion, openWindow } from '../../regions/regionsOperations'
import SpotTile from './SpotTile'
import {
  dismissNotification,
  displayCurrencyChart,
  executeTrade,
  spotRegionSettings,
  undockTile,
} from '../../redux/actions/spotTileActions'
import { CurrencyPair, Direction } from '../../types/'
import Environment from '../../system/environment'
import { createDeepEqualSelector } from '../utils/mapToPropsSelectorFactory'
import { SpotPriceTick } from '../../types/spotPriceTick'

const buildSpotTileDataObject = (tileData, spotTick:SpotPriceTick, currencyPair:CurrencyPair) => {
  const tileDataObject:any = {...tileData, ...spotTick, ...currencyPair}
  return tileDataObject
}

const getSpotTileData = (id:string ) => createDeepEqualSelector(
  (state:any) => state.pricingService,
  (state:any) => state.currencyPairs,
  (state:any) => state.spotTilesData,
  (pricingService, currencyPairs, spotTilesData = {}) => {
    return buildSpotTileDataObject(spotTilesData[id], pricingService[id], currencyPairs[id])
  }
)

const getCurrencyPair = (id:string) => createDeepEqualSelector (
  (state:any) => state.currencyPairs,
  (currencyPairs) => currencyPairs[id]
)

const getSpotPriceTick = (id:string) => createDeepEqualSelector (
  (state:any) => state.pricingService,
  (spotTicks) => spotTicks[id]
)

interface SpotTileContainerOwnProps {
  id: string
}

interface SpotTileContainerStateProps {
  isConnected: boolean
  executionConnected: boolean
  canPopout: boolean
  currencyPair: CurrencyPair
  spotTilesData
  spotPriceTick: SpotPriceTick
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
    openFin: PropTypes.object
  }

  render() {
    const openFin = this.context.openFin
    const key = this.props.id
    const currencyPair: CurrencyPair = this.props.currencyPair
    const title = `${currencyPair.base} / ${currencyPair.terms}`
    const spotTitle = spotRegionSettings(key)['title']
    const spotData = this.props.spotTilesData
    const tileProps = {
      id: key,
      title,
      currencyPair,
      canPopout: Environment.isRunningInIE(),
      currencyChartIsOpening: spotData.currencyChartIsOpening,
      currentSpotPrice: spotData,
      executionConnected: this.props.executionConnected,
      hasNotification: !!spotData.notification,
      isRunningInOpenFin: !!openFin,
      isTradeExecutionInFlight: spotData.isTradeExecutionInFlight,
      notification: spotData.notification,
      notional: this.props.notionals[currencyPair.symbol] || NOTIONAL,
      priceStale: spotData.priceStale,
      executeTrade: this.props.executeTrade,
      onComponentMount: () => this.props.onComponentMount(this.props.id),
      undockTile: this.props.undockTile(openFin, spotTitle),
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
    },
  }
}

function mapStateToProps(state: any, ownProps: SpotTileContainerProps) {
  const { compositeStatusService, displayAnalytics, notionals } = state;
  const executionConnected = compositeStatusService && compositeStatusService.execution && compositeStatusService.execution.isConnected || false

  const isConnected = compositeStatusService && compositeStatusService.analytics && compositeStatusService.analytics.isConnected || false
  return {
    isConnected,
    executionConnected,
    displayAnalytics,
    currencyPair: getCurrencyPair(ownProps.id)(state),
    spotTilesData: getSpotTileData(ownProps.id)(state),
    spotPriceTick: getSpotPriceTick(ownProps.id)(state),
    notionals
  }
}

const ConnectedSpotTileContainer = connect(mapStateToProps, mapDispatchToProps)(SpotTileContainer)
const spotTileRegion = (id) => ({
  id,
  isTearedOff: false,
  container: connect((state) => ({ id }))(ConnectedSpotTileContainer),
  settings: spotRegionSettings(id),
})

export default ConnectedSpotTileContainer
