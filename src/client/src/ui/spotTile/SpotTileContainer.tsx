import React from 'react'
import { connect } from 'react-redux'
import { Dispatch } from 'redux'
import { Loadable } from 'rt-components'
import { Environment } from 'rt-system'
import { GlobalState } from 'StoreTypes'
import { SpotTileActions } from './actions'
import { TileSwitch } from './components'
import { ExecuteTradeRequest } from './model/executeTradeRequest'
import {
  selectCurrencyPair,
  selectExecutionStatus,
  selectPricingStatus,
  selectSpotTileData,
} from './selectors'
import { TileViews } from '../workspace/workspaceHeader'
import { RfqRequest, RfqCancel, RfqRequote, RfqExpired, RfqReject } from './model/rfqRequest'
import { TradingMode } from './components/types'

export interface SpotTileContainerOwnProps {
  id: string
  tileView: TileViews
  onPopoutClick?: () => void
  tornOff?: boolean
  tearable?: boolean
}

type SpotTileContainerDispatchProps = ReturnType<typeof mapDispatchToProps>

type SpotTileContainerStateProps = ReturnType<ReturnType<typeof makeMapStateToProps>>

type SpotTileContainerProps = SpotTileContainerOwnProps &
  SpotTileContainerStateProps &
  SpotTileContainerDispatchProps

const SpotTileContainer: React.FC<SpotTileContainerProps> = ({
  onMount,
  pricingStatus,
  tearable = false,
  id,
  tornOff,
  ...props
}) => (
  <Loadable
    onMount={onMount}
    status={pricingStatus}
    render={() => (
      <TileSwitch
        key={id}
        canPopout={tearable && !Environment.isRunningInIE() && !tornOff}
        {...props}
      />
    )}
    message={`${id} Disconnected`}
  />
)

const mapDispatchToProps = (dispatch: Dispatch, ownProps: SpotTileContainerOwnProps) => ({
  onMount: () => dispatch(SpotTileActions.subscribeToSpotTile(ownProps.id)),
  executeTrade: (tradeRequestObj: ExecuteTradeRequest) =>
    dispatch(SpotTileActions.executeTrade(tradeRequestObj, null)),
  displayCurrencyChart: () => dispatch(SpotTileActions.displayCurrencyChart(ownProps.id)),
  onNotificationDismissed: () => dispatch(SpotTileActions.dismissNotification(ownProps.id)),
  setTradingMode: (tradingMode: TradingMode) =>
    dispatch(SpotTileActions.setTradingMode(tradingMode)),
  rfq: {
    request: (obj: RfqRequest) => dispatch(SpotTileActions.rfqRequest(obj)),
    cancel: (obj: RfqCancel) => dispatch(SpotTileActions.rfqCancel(obj)),
    reject: (obj: RfqReject) => dispatch(SpotTileActions.rfqReject(obj)),
    requote: (obj: RfqRequote) => dispatch(SpotTileActions.rfqRequote(obj)),
    expired: (obj: RfqExpired) => dispatch(SpotTileActions.rfqExpired(obj)),
    reset: (obj: RfqExpired) => dispatch(SpotTileActions.rfqReset(obj)),
  },
})

const makeMapStateToProps = () => (state: GlobalState, ownProps: SpotTileContainerOwnProps) => ({
  pricingStatus: selectPricingStatus(state),
  executionStatus: selectExecutionStatus(state),
  currencyPair: selectCurrencyPair(state, ownProps),
  spotTileData: selectSpotTileData(state, ownProps),
})

const ConnectedSpotTileContainer = connect(
  makeMapStateToProps,
  mapDispatchToProps,
)(SpotTileContainer)

export default ConnectedSpotTileContainer
