import React from 'react'
import { connect } from 'react-redux'
import { Dispatch } from 'redux'
import { Environment } from 'rt-system'
import { GlobalState } from 'StoreTypes'
import { AnalyticsActions } from './actions'
import Analytics from './components'
import { getPnlChartModel } from './model/pnlChartModel'
import { getPositionsChartModel } from './model/positionsChartModel'

interface AnalyticsContainerOwnProps {
  onPopoutClick: () => void
  tornOff: boolean
  subscribeToAnalytics: () => void
}

type AnalyticsContainerStateProps = ReturnType<typeof mapStateToProps>
type AnalyticsContainerProps = AnalyticsContainerStateProps & AnalyticsContainerOwnProps

class AnalyticsContainer extends React.Component<AnalyticsContainerProps> {
  componentDidMount() {
    this.props.subscribeToAnalytics()
  }

  render() {
    const { analyticsService, isConnected, currencyPairs, onPopoutClick, tornOff } = this.props

    return (
      <Analytics
        currencyPairs={currencyPairs}
        canPopout={Environment.isRunningInIE() || tornOff}
        isConnected={isConnected}
        onPopoutClick={onPopoutClick}
        pnlChartModel={getPnlChartModel(analyticsService.history)}
        positionsChartModel={getPositionsChartModel(analyticsService.currentPositions)}
      />
    )
  }
}

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
  subscribeToAnalytics: () => dispatch(AnalyticsActions.subcribeToAnalytics())
})

const ConnectedAnalyticsContainer = connect(
  mapStateToProps,
  mapToDispatch
)(AnalyticsContainer)

export default ConnectedAnalyticsContainer
