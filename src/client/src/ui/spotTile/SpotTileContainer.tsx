import * as _ from 'lodash'
import * as React from 'react'
import { connect } from 'react-redux'
import { Dispatch } from 'redux'
import { GlobalState } from '../../combineReducers'
import { CurrencyPair, Direction, ExecuteTradeRequest } from '../../types/'
import { SpotPriceTick } from '../../types/spotPriceTick'
import { SpotTileData } from '../../types/spotTileData'
import { createDeepEqualSelector } from '../utils/mapToPropsSelectorFactory'
import { spotRegionSettings, SpotTileActions } from './actions'
import SpotTile from './SpotTile'
import { createTradeRequest, DEFAULT_NOTIONAL, TradeRequest } from './spotTileUtils'

const buildSpotTileDataObject = (tileData: SpotTileData, spotTick: SpotPriceTick, currencyPair: CurrencyPair) => ({
  ...tileData,
  ...spotTick,
  ...currencyPair
})

//type props
const makeGetSpotTileData = () =>
  createDeepEqualSelector(
    ({ spotTilesData }: GlobalState, { id }: SpotTileContainerOwnProps) => spotTilesData[id],
    ({ pricingService }: GlobalState, { id }: SpotTileContainerOwnProps) => pricingService[id],
    ({ currencyPairs }: GlobalState, { id }: SpotTileContainerOwnProps) => currencyPairs[id],
    (spotTilesData, pricingService, currencyPairs) =>
      buildSpotTileDataObject(spotTilesData, pricingService, currencyPairs)
  )

const makeGetCurrencyPair = () =>
  createDeepEqualSelector(
    ({ currencyPairs }: GlobalState, { id }: SpotTileContainerOwnProps) => currencyPairs[id],
    currencyPairs => currencyPairs
  )

interface SpotTileContainerOwnProps {
  id: string
  onPopoutClick: () => void
  tornOff: boolean
}

type SpotTileContainerDispatchProps = ReturnType<typeof mapDispatchToProps>

type SpotTileContainerStateProps = ReturnType<ReturnType<typeof makeMapStateToProps>>

type SpotTileContainerProps = SpotTileContainerOwnProps & SpotTileContainerStateProps & SpotTileContainerDispatchProps

class SpotTileContainer extends React.Component<SpotTileContainerProps> {
  shouldComponentUpdate(nextProps: SpotTileContainerProps) {
    return !_.isEqual(this.props.spotTilesData, nextProps.spotTilesData)
  }

  render() {
    const {
      id,
      currencyPair,
      spotTilesData,
      executionConnected,
      pricingConnected,
      onPopoutClick,
      undockTile,
      onNotificationDismissedClick,
      displayCurrencyChart,
      tornOff
    } = this.props
    const spotTitle = spotRegionSettings(id).title
    return (
      <SpotTile
        key={id}
        pricingConnected={pricingConnected}
        executionConnected={executionConnected}
        currencyPair={currencyPair}
        isRunningOnDesktop={this.props.isRunningOnDesktop}
        spotTileData={spotTilesData}
        onPopoutClick={onPopoutClick}
        displayCurrencyChart={displayCurrencyChart(id)}
        onNotificationDismissedClick={onNotificationDismissedClick(id)}
        undockTile={undockTile(spotTitle)}
        executeTrade={this.executeTrade}
        tornOff={tornOff}
      />
    )
  }

  private executeTrade = (direction: Direction) => {
    const { executionConnected, spotTilesData, currencyPair, notionals, executeTrade } = this.props
    if (!executionConnected || spotTilesData.isTradeExecutionInFlight) {
      return
    }
    const rate = direction === Direction.Buy ? spotTilesData.ask : spotTilesData.bid
    const tradeRequestObj: TradeRequest = {
      direction,
      currencyBase: currencyPair.base,
      symbol: currencyPair.symbol,
      notional: notionals[currencyPair.symbol] || DEFAULT_NOTIONAL,
      rawSpotRate: rate
    }
    executeTrade(createTradeRequest(tradeRequestObj))
  }
}

const mapDispatchToProps = (dispatch: Dispatch) => ({
  executeTrade: (tradeRequestObj: ExecuteTradeRequest) => dispatch(SpotTileActions.executeTrade(tradeRequestObj, null)),
  undockTile: (tileName: string) => () => dispatch(SpotTileActions.undockTile(tileName)),
  displayCurrencyChart: (symbol: string) => () => dispatch(SpotTileActions.displayCurrencyChart(symbol)),
  onNotificationDismissedClick: (symbol: string) => () => dispatch(SpotTileActions.dismissNotification(symbol))
})

const makeMapStateToProps = () => (state: GlobalState, props: SpotTileContainerOwnProps) => {
  const { compositeStatusService, notionals, environment } = state
  const executionConnected =
    compositeStatusService && compositeStatusService.execution && compositeStatusService.execution.isConnected
  const pricingConnected =
    compositeStatusService && compositeStatusService.pricing && compositeStatusService.pricing.isConnected
  return {
    isRunningOnDesktop: environment.isRunningOnDesktop,
    executionConnected,
    pricingConnected,
    currencyPair: makeGetCurrencyPair()(state, props),
    spotTilesData: makeGetSpotTileData()(state, props),
    notionals
  }
}

const ConnectedSpotTileContainer = connect(
  makeMapStateToProps,
  mapDispatchToProps
)(SpotTileContainer)

export default ConnectedSpotTileContainer
