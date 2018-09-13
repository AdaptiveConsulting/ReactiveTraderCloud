import React from 'react'
import { connect } from 'react-redux'
import { Dispatch } from 'redux'
import { EnvironmentValue, Loadable, withEnvironment } from 'rt-components'

import { GlobalState } from 'StoreTypes'
import { SpotTileActions } from './actions'
import { TileSwitch } from './components'
import { ExecuteTradeRequest } from './model/executeTradeRequest'
import { selectCurrencyPair, selectExecutionStatus, selectPricingStatus, selectSpotTileData } from './selectors'

export interface SpotTileContainerOwnProps {
  id: string
  onPopoutClick?: () => void
  tornOff?: boolean
  environment: EnvironmentValue
}

type SpotTileContainerDispatchProps = ReturnType<typeof mapDispatchToProps>

type SpotTileContainerStateProps = ReturnType<ReturnType<typeof makeMapStateToProps>>

type SpotTileContainerProps = SpotTileContainerOwnProps & SpotTileContainerStateProps & SpotTileContainerDispatchProps

const SpotTileContainer: React.SFC<SpotTileContainerProps> = ({ onMount, executionStatus, id, ...props }) => (
  <Loadable
    onMount={onMount}
    status={executionStatus}
    render={() => <TileSwitch key={id} {...props} />}
    message="Tile Disconnected"
  />
)

const mapDispatchToProps = (dispatch: Dispatch, ownProps: SpotTileContainerOwnProps) => ({
  onMount: () => {
    dispatch(SpotTileActions.subscribeToSpotTile(ownProps.id))
  },
  executeTrade: (tradeRequestObj: ExecuteTradeRequest) => dispatch(SpotTileActions.executeTrade(tradeRequestObj, null)),
  displayCurrencyChart: () => dispatch(SpotTileActions.displayCurrencyChart(ownProps.id)),
  onNotificationDismissed: () => dispatch(SpotTileActions.dismissNotification(ownProps.id))
})

const makeMapStateToProps = () => (state: GlobalState, ownProps: SpotTileContainerOwnProps) => ({
  pricingStatus: selectPricingStatus(state),
  executionStatus: selectExecutionStatus(state),
  currencyPair: selectCurrencyPair(state, ownProps),
  spotTileData: selectSpotTileData(state, ownProps)
})

const ConnectedSpotTileContainer = connect(
  makeMapStateToProps,
  mapDispatchToProps
)(SpotTileContainer)

export default withEnvironment(ConnectedSpotTileContainer)
