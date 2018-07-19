import * as React from 'react'
import { connect } from 'react-redux'
import { GlobalState } from '../../combineReducers'
import { Environment } from '../../system'
import Analytics from './components/Analytics'
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

const ConnectedAnalyticsContainer = connect(mapStateToProps)(AnalyticsContainer)

export default ConnectedAnalyticsContainer
