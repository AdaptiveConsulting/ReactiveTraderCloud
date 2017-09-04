import * as React from 'react'
import { connect } from 'react-redux'

import { getPnlChartModel } from './model/pnlChartModel'
import { getPositionsChartModel } from './model/positionsChartModel'
import Analytics from './Analytics'
import './analytics.scss'
import { addRegion, openWindow } from '../../regions/regionsOperations'
import { analyticsRegionSettings } from './analyticsOperations'

interface AnalyticsContainerOwnProps {

}

interface AnalyticsContainerStateProps {
  isConnected: boolean
  canPopout: boolean
  analyticsService: any
}

interface AnalyticsContainerDispatchProps {
  onPopoutClick: (any) => any
  onComponentMount: () => void
}

type AnalyticsContainerProps = AnalyticsContainerOwnProps & AnalyticsContainerStateProps & AnalyticsContainerDispatchProps

class AnalyticsContainer extends React.Component<AnalyticsContainerProps, any> {

  static contextTypes = {
    openFin: React.PropTypes.object,
  }

  public componentDidMount() {
    this.props.onComponentMount()
  }

  render() {

    const { analyticsService, isConnected } = this.props
    const openFin = this.context.openFin
    const positionsChartModel = getPositionsChartModel(analyticsService.currentPositions)
    const pnlChartModel = getPnlChartModel(analyticsService.history)

    const analyticsProps = {
      isConnected,
      pnlChartModel,
      positionsChartModel,
      onPopoutClick: this.props.onPopoutClick(openFin),
      canPopout: true,
    }

    return (
      <Analytics
        {...analyticsProps}
      />
    )
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onPopoutClick: (openFin) => {
     return () => { dispatch(openWindow(analyticsRegion, openFin))}
    },
    onComponentMount: () => {
      dispatch(addRegion(analyticsRegion))
    },
  }
}

function mapStateToProps({ analyticsService, compositeStatusService, displayAnalytics }) {
  const isConnected =  compositeStatusService && compositeStatusService.analytics && compositeStatusService.analytics.isConnected || false
  return { analyticsService, isConnected, displayAnalytics }
}

const ConnectedAnalyticsContainer = connect(mapStateToProps, mapDispatchToProps)(AnalyticsContainer)

const analyticsRegion = {
  id: 'analytics',
  isTearedOff: false,
  container: ConnectedAnalyticsContainer,
  settings: analyticsRegionSettings,
}

export default ConnectedAnalyticsContainer
