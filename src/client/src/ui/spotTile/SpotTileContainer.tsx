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
} from './actions'
import { CurrencyPair, Direction } from '../../types/'
import { createDeepEqualSelector } from '../utils/mapToPropsSelectorFactory'
import { SpotPriceTick } from '../../types/spotPriceTick'
import { createTradeRequest, DEFAULT_NOTIONAL, TradeRequest } from './spotTileUtils'
import { SpotTileData } from '../../types/spotTileData'
import * as _ from 'lodash'

const buildSpotTileDataObject = (tileData, spotTick:SpotPriceTick, currencyPair:CurrencyPair) => {
  const tileDataObject:any = { ...tileData, ...spotTick, ...currencyPair }
  return tileDataObject
}

const makeGetSpotTileData = () =>
  createDeepEqualSelector(
    (state: any, props) => state.spotTilesData[props.id],
    (state: any, props) => state.pricingService[props.id],
    (state: any, props) => state.currencyPairs[props.id],
    (spotTilesData = {}, pricingService, currencyPairs) =>
      buildSpotTileDataObject(spotTilesData, pricingService, currencyPairs)
  )

const makeGetCurrencyPair = () =>
  createDeepEqualSelector(
    (state: any, props) => state.currencyPairs[props.id],
    currencyPairs => currencyPairs
  )

interface SpotTileContainerOwnProps {
  id: string
}

interface SpotTileContainerStateProps {
  isConnected: boolean
  executionConnected: boolean
  canPopout: boolean
  currencyPair: CurrencyPair
  spotTilesData: SpotTileData
  notionals: any
}

interface SpotTileContainerDispatchProps {
  executeTrade: (request:any) => void
  onComponentMount: (id: string) => void
  onPopoutClick: (region: any, openFin: any) => any
  undockTile: (openFin: any, title: string) => any
  displayCurrencyChart: (openFin: any, symbol: string) => any
  onNotificationDismissedClick: (symbol: string) => any
}

type SpotTileContainerProps = SpotTileContainerOwnProps & SpotTileContainerStateProps & SpotTileContainerDispatchProps

class SpotTileContainer extends React.Component<SpotTileContainerProps, any> {

  static contextTypes = {
    openFin: PropTypes.object
  }

  componentDidMount() {
    this.props.onComponentMount(this.props.id)
  }

  shouldComponentUpdate(nextProps: SpotTileContainerProps, nextState: any) {
    const shouldUpdate = !_.isEqual(this.props.spotTilesData, nextProps.spotTilesData)
    return shouldUpdate
  }
  render() {
    const openFin = this.context.openFin
    const key = this.props.id
    const spotTitle = spotRegionSettings(key)['title']
    const tileProps = {
      id: key,
      currencyPair: this.props.currencyPair,
      spotTileData: this.props.spotTilesData,
      executionConnected: this.props.executionConnected,
      isRunningInOpenFin: !!openFin,
      executeTrade: this.executeTrade,
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

  private executeTrade = (direction:Direction) => {
    const { executionConnected, spotTilesData } = this.props
    if (!executionConnected || spotTilesData.isTradeExecutionInFlight) return

    const rate = direction === Direction.Buy ? spotTilesData.ask : spotTilesData.bid
    const tradeRequestObj:TradeRequest = {
      direction,
      currencyBase: this.props.currencyPair.base,
      symbol: this.props.currencyPair.symbol,
      notional: this.props.notionals[this.props.currencyPair.symbol] || DEFAULT_NOTIONAL,
      rawSpotRate: rate
    }

    this.props.executeTrade(createTradeRequest(tradeRequestObj))
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    executeTrade: (tradeRequestObj:TradeRequest) => {
      dispatch(executeTrade(tradeRequestObj))
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

const makeMapStateToProps = () => {
  const getCurrencyPair = makeGetCurrencyPair();
  const getSpotTileData = makeGetSpotTileData();
  const mapStateToProps = (state, props) => {
    const { compositeStatusService, displayAnalytics, notionals } = state;
    const executionConnected = compositeStatusService && compositeStatusService.execution && compositeStatusService.execution.isConnected
    const isConnected = compositeStatusService && compositeStatusService.analytics && compositeStatusService.analytics.isConnected
    return {
      isConnected,
      executionConnected,
      displayAnalytics,
      currencyPair: getCurrencyPair(state, props),
      spotTilesData: getSpotTileData(state, props),
      notionals
    };
  };

  return mapStateToProps;
};

const ConnectedSpotTileContainer = connect(makeMapStateToProps, mapDispatchToProps)(SpotTileContainer)
const spotTileRegion = (id) => ({
  id,
  isTearedOff: false,
  container: connect((state) => ({ id }))(ConnectedSpotTileContainer),
  settings: spotRegionSettings(id),
})

export default ConnectedSpotTileContainer