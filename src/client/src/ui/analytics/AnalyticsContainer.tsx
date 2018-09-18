import React from 'react'
import { connect } from 'react-redux'
import { Dispatch } from 'redux'
import { Loadable } from 'rt-components'
import { Environment } from 'rt-system'
import { GlobalState } from 'StoreTypes'
import { AnalyticsActions } from './actions'
import Analytics from './components'
import { selectAnalyticsStatus, selectCurrencyPairs, selectPnlChartModel, selectPositionsChartModel } from './selectors'
interface AnalyticsContainerOwnProps {
  onPopoutClick?: () => void
  tornOff?: boolean
  tearable?: boolean
}

type AnalyticsContainerStateProps = ReturnType<typeof mapStateToProps>
type AnalyticsContainerDispatchProps = ReturnType<typeof mapDispatchToProps>
type AnalyticsContainerProps = AnalyticsContainerStateProps &
  AnalyticsContainerDispatchProps &
  AnalyticsContainerOwnProps

const AnalyticsContainer: React.SFC<AnalyticsContainerProps> = ({
  status,
  onMount,
  tearable = false,
  tornOff,
  ...props
}) => (
  <Loadable
    minWidth={22}
    onMount={onMount}
    status={status}
    render={() => <Analytics {...props} canPopout={tearable && !Environment.isRunningInIE() && !tornOff} />}
    message="Analytics Disconnected"
  />
)

const mapStateToProps = (state: GlobalState) => ({
  pnlChartModel: selectPnlChartModel(state),
  positionsChartModel: selectPositionsChartModel(state),
  status: selectAnalyticsStatus(state),
  currencyPairs: selectCurrencyPairs(state),
})

const mapDispatchToProps = (dispatch: Dispatch) => ({
  onMount: () => dispatch(AnalyticsActions.subcribeToAnalytics()),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(AnalyticsContainer)
