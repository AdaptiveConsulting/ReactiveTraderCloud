import React from 'react'
import { connect } from 'react-redux'
import { Dispatch } from 'redux'
import { Environment, withEnvironment } from 'rt-components'
import { Direction } from 'rt-types'
import { GlobalState } from 'StoreTypes'
import { SpotTileActions } from './actions'
import { TileSwitch } from './components'
import { ExecuteTradeRequest } from './model/executeTradeRequest'
import { createTradeRequest, DEFAULT_NOTIONAL, TradeRequest } from './model/spotTileUtils'
import { selectCurrencyPair, selectExecutionStatus, selectPricingStatus, selectSpotTileData } from './selectors'

export interface SpotTileContainerOwnProps {
  id: string
  onPopoutClick?: () => void
  tornOff?: boolean
  environment: Environment
}

type SpotTileContainerDispatchProps = ReturnType<typeof mapDispatchToProps>

type SpotTileContainerStateProps = ReturnType<ReturnType<typeof makeMapStateToProps>>

type SpotTileContainerProps = SpotTileContainerOwnProps & SpotTileContainerStateProps & SpotTileContainerDispatchProps

class SpotTileContainer extends React.PureComponent<SpotTileContainerProps> {
  componentDidMount() {
    this.props.onMount()
  }

  render() {
    const { id, currencyPair, spotTileData, onPopoutClick, onNotificationDismissed, tornOff } = this.props
    if (!spotTileData || !spotTileData.price || !currencyPair) {
      return null
    }
    return (
      <TileSwitch
        key={id}
        currencyPair={currencyPair}
        spotTileData={spotTileData}
        onPopoutClick={onPopoutClick}
        onNotificationDismissed={onNotificationDismissed}
        executeTrade={this.executeTrade}
        tornOff={tornOff}
      />
    )
  }

  private executeTrade = (direction: Direction, notional: number) => {
    const { executionConnected, spotTileData, currencyPair, executeTrade } = this.props
    if (!executionConnected || spotTileData.isTradeExecutionInFlight || !spotTileData.price) {
      return
    }
    const rate = direction === Direction.Buy ? spotTileData.price.ask : spotTileData.price.bid
    const tradeRequestObj: TradeRequest = {
      direction,
      currencyBase: currencyPair.base,
      symbol: currencyPair.symbol,
      notional: notional || DEFAULT_NOTIONAL,
      rawSpotRate: rate
    }
    executeTrade(createTradeRequest(tradeRequestObj))
  }
}

const mapDispatchToProps = (dispatch: Dispatch, ownProps: SpotTileContainerOwnProps) => ({
  onMount: () => dispatch(SpotTileActions.showSpotTile(ownProps.id)),
  executeTrade: (tradeRequestObj: ExecuteTradeRequest) => dispatch(SpotTileActions.executeTrade(tradeRequestObj, null)),
  displayCurrencyChart: () => dispatch(SpotTileActions.displayCurrencyChart(ownProps.id)),
  onNotificationDismissed: () => dispatch(SpotTileActions.dismissNotification(ownProps.id))
})

const makeMapStateToProps = () => (state: GlobalState, ownProps: SpotTileContainerOwnProps) => ({
  executionConnected: selectExecutionStatus(state),
  pricingConnected: selectPricingStatus(state),
  currencyPair: selectCurrencyPair(state, ownProps),
  spotTileData: selectSpotTileData(state, ownProps)
})

const ConnectedSpotTileContainer = connect(
  makeMapStateToProps,
  mapDispatchToProps
)(SpotTileContainer)

export default withEnvironment(ConnectedSpotTileContainer)
