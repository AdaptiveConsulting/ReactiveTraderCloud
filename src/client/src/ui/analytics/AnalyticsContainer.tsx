import * as React from 'react'
import { connect } from 'react-redux'

import { getPnlChartModel } from './model/pnlChartModel';
import { getPositionsChartModel } from './model/positionsChartModel';
import Analytics from './Analytics';
import './analytics.scss'
import { onComponentMount, onPopoutClick } from '../../redux/blotter/blotterOperations';
import { analyticsRegionSettings } from '../../redux/analytics/analyticsOperations';

interface AnalyticsContainerOwnProps {

}

interface AnalyticsContainerStateProps {
  isConnected: boolean
  canPopout: boolean
  analyticsService: any
}

interface AnalyticsContainerDispatchProps {
  onPopoutClick: () => void
  onComponentMount: () => void
}

type AnalyticsContainerProps = AnalyticsContainerOwnProps & AnalyticsContainerStateProps & AnalyticsContainerDispatchProps

class AnalyticsContainer extends React.Component<AnalyticsContainerProps, any> {

  public componentDidMount() {
    this.props.onComponentMount()
  }

  render() {

    const { analyticsService, isConnected } = this.props
    const positionsChartModel = getPositionsChartModel(analyticsService.currentPositions)
    const pnlChartModel = getPnlChartModel(analyticsService.history)

    const analyticsProps = {
      isConnected: isConnected,
      pnlChartModel: pnlChartModel,
      positionsChartModel: positionsChartModel,
      onPopoutClick: this.props.onPopoutClick,
      canPopout: true,
    }

    return (
      <Analytics
        {...analyticsProps}
      />
    );
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onPopoutClick: () => {
      dispatch(onPopoutClick(analyticsRegion))
    },
    onComponentMount: () => {
      dispatch(onComponentMount(analyticsRegion))
    }
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
  settings: analyticsRegionSettings
}

export default ConnectedAnalyticsContainer
