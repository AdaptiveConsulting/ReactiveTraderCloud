import React from 'react'
import { connect } from 'react-redux'
import { Dispatch } from 'redux'
import { Environment, withEnvironment } from 'rt-components'
import { Direction, ExecuteTradeRequest } from 'rt-types'
import { GlobalState } from '../../combineReducers'
import { spotRegionSettings, SpotTileActions } from './actions'
import SpotTile from './components/SpotTile'
import { createTradeRequest, DEFAULT_NOTIONAL, TradeRequest } from './model/spotTileUtils'

interface SpotTileContainerOwnProps {
  id: string
  onPopoutClick: () => void
  tornOff: boolean
  environment: Environment
}

type SpotTileContainerDispatchProps = ReturnType<typeof mapDispatchToProps>

type SpotTileContainerStateProps = ReturnType<ReturnType<typeof makeMapStateToProps>>

type SpotTileContainerProps = SpotTileContainerOwnProps & SpotTileContainerStateProps & SpotTileContainerDispatchProps

class SpotTileContainer extends React.PureComponent<SpotTileContainerProps> {
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
      tornOff,
      environment
    } = this.props
    const spotTitle = spotRegionSettings(id).title
    return (
      <SpotTile
        key={id}
        pricingConnected={pricingConnected}
        executionConnected={executionConnected}
        currencyPair={currencyPair}
        isRunningOnDesktop={environment.isRunningDesktop}
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
    const rate = direction === Direction.Buy ? spotTilesData.price.ask : spotTilesData.price.bid
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
  const { compositeStatusService, notionals } = state
  const executionConnected =
    compositeStatusService && compositeStatusService.execution && compositeStatusService.execution.isConnected
  const pricingConnected =
    compositeStatusService && compositeStatusService.pricing && compositeStatusService.pricing.isConnected
  return {
    executionConnected,
    pricingConnected,
    currencyPair: state.currencyPairs[props.id],
    spotTilesData: state.spotTilesData[props.id],
    notionals
  }
}

const ConnectedSpotTileContainer = connect(
  makeMapStateToProps,
  mapDispatchToProps
)(SpotTileContainer)

export default withEnvironment(ConnectedSpotTileContainer)
