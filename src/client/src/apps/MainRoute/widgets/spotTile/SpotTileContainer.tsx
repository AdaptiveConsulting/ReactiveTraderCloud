import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { Dispatch } from 'redux'
import memoize from 'lodash/memoize'
import { Loadable } from 'rt-components'
import { usePlatform } from 'rt-platforms'
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
import { TileView } from '../workspace/workspaceHeader'
import { RfqCancel, RfqExpired, RfqReject, RfqRequest, RfqRequote } from './model/rfqRequest'
import { TradingMode } from './components/types'
import { CurrencyPairNotional } from './model/spotTileData'

export interface SpotTileContainerOwnProps {
  id: string
  tileView: TileView
  onPopoutClick?: (x: number, y: number) => void
  tornOff?: boolean
  tearable?: boolean
}

const mapDispatchToProps = memoize(
  (dispatch: Dispatch, ownProps: SpotTileContainerOwnProps) => ({
    onCurrencyPairChanged: (currencyPair: string) =>
      dispatch(SpotTileActions.subscribeToSpotTile(currencyPair)),
    executeTrade: (tradeRequestObj: ExecuteTradeRequest) =>
      dispatch(SpotTileActions.executeTrade(tradeRequestObj, null)),
    onNotificationDismissed: () => dispatch(SpotTileActions.dismissNotification(ownProps.id)),
    setTradingMode: (tradingMode: TradingMode) =>
      dispatch(SpotTileActions.setTradingMode(tradingMode)),
    rfq: {
      request: (rfqActionObj: RfqRequest) => dispatch(SpotTileActions.rfqRequest(rfqActionObj)),
      cancel: (rfqActionObj: RfqCancel) => dispatch(SpotTileActions.rfqCancel(rfqActionObj)),
      reject: (rfqActionObj: RfqReject) => dispatch(SpotTileActions.rfqReject(rfqActionObj)),
      requote: (rfqActionObj: RfqRequote) => dispatch(SpotTileActions.rfqRequote(rfqActionObj)),
      expired: (rfqActionObj: RfqExpired) => dispatch(SpotTileActions.rfqExpired(rfqActionObj)),
      reset: (rfqActionObj: RfqExpired) => dispatch(SpotTileActions.rfqReset(rfqActionObj)),
    },
    updateNotional: (currencyPairNotional: CurrencyPairNotional) =>
      dispatch(SpotTileActions.setNotional(currencyPairNotional)),
  }),
  (_, { id }) => id,
)

const makeMapStateToProps = memoize(
  () => (state: GlobalState, ownProps: SpotTileContainerOwnProps) => ({
    pricingStatus: selectPricingStatus(state),
    executionStatus: selectExecutionStatus(state),

    // here 'ownProps.id' is an ID of the tile, but it's ID of the currency pair too (same thing for now)
    currencyPair: selectCurrencyPair(state, ownProps.id),
    spotTileData: selectSpotTileData(state, ownProps.id),
  }),
  (_, { id }) => id,
)

type SpotTileContainerDispatchProps = ReturnType<typeof mapDispatchToProps>

type SpotTileContainerStateProps = ReturnType<ReturnType<typeof makeMapStateToProps>>

type SpotTileContainerProps = SpotTileContainerOwnProps &
  SpotTileContainerStateProps &
  SpotTileContainerDispatchProps

const SpotTileContainer: React.FC<SpotTileContainerProps> = ({
  pricingStatus,
  tearable = false,
  id,
  tornOff,
  onCurrencyPairChanged,
  ...props
}) => {
  const { allowTearOff } = usePlatform()

  // watch currency pair changes when component is mounted
  useEffect(() => {
    onCurrencyPairChanged(id)
  }, [id, onCurrencyPairChanged])

  return (
    <Loadable
      minHeight={11}
      status={pricingStatus}
      render={() => (
        <TileSwitch key={id} canPopout={tearable && allowTearOff && !tornOff} {...props} />
      )}
      message={`${id} Disconnected`}
    />
  )
}

const ConnectedSpotTileContainer = connect(
  makeMapStateToProps,
  mapDispatchToProps,
)(SpotTileContainer)

export default ConnectedSpotTileContainer
