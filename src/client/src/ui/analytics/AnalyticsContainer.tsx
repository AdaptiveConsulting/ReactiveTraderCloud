import * as React from 'react'
import { connect, Dispatch } from 'react-redux'
import { GlobalState } from '../../combineReducers'
import { Environment } from '../../system'
import { AnalyticsActions } from './actions'
import Analytics from './components'
import { getPnlChartModel } from './model/pnlChartModel'
import { getPositionsChartModel } from './model/positionsChartModel'

interface AnalyticsContainerOwnProps {
  onPopoutClick: () => void
  tornOff: boolean
}

type AnalyticsContainerStateProps = ReturnType<typeof mapStateToProps>
type AnalyticsContainerProps = AnalyticsContainerStateProps & AnalyticsContainerOwnProps

const AnalyticsContainer: React.SFC<AnalyticsContainerProps> = ({
  analyticsService,
  isConnected,
  currencyPairs,
  onPopoutClick,
  tornOff
}) => (
  <Analytics
    currencyPairs={currencyPairs}
    canPopout={Environment.isRunningInIE() || tornOff}
    isConnected={isConnected}
    onPopoutClick={onPopoutClick}
    pnlChartModel={getPnlChartModel(analyticsService.history)}
    positionsChartModel={getPositionsChartModel(analyticsService.currentPositions)}
  />
)

const mapStateToProps = ({
  analyticsService,
  compositeStatusService,
  displayAnalytics,
  currencyPairs
}: GlobalState) => ({
  analyticsService,
  isConnected:
    compositeStatusService && compositeStatusService.analytics && compositeStatusService.analytics.isConnected,
  displayAnalytics,
  currencyPairs
})

const mapToDispatch = (dispatch: Dispatch) => ({
  subscribeToAnalytics: dispatch(AnalyticsActions.subcribeToAnalytics())
})

const ConnectedAnalyticsContainer = connect(
  mapStateToProps,
  mapToDispatch
)(AnalyticsContainer)

export default ConnectedAnalyticsContainer
