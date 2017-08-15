import * as React from 'react'
import { connect } from 'react-redux'

import { getPnlChartModel } from './model/pnlChartModel';
import { getPositionsChartModel } from './model/positionsChartModel';
import Analytics from './Analytics';
import './analytics.scss'

class AnalyticsContainer extends React.Component<any, any> {

  render() {

    const { analyticsService, isConnected } = this.props
    const positionsChartModel = getPositionsChartModel(analyticsService.currentPositions)
    const pnlChartModel = getPnlChartModel(analyticsService.history)

    const analyticsProps = {
      isConnected: isConnected,
      pnlChartModel: pnlChartModel,
      positionsChartModel: positionsChartModel
    }

    return (
      <Analytics
        canPopout={false}
        {...analyticsProps}
      />
    );
  }
}

function mapStateToProps({ analyticsService, compositeStatusService, displayAnalytics }) {
  const isConnected =  compositeStatusService && compositeStatusService.analytics && compositeStatusService.analytics.isConnected || false
  return { analyticsService, isConnected, displayAnalytics }
}

export default connect(mapStateToProps)(AnalyticsContainer)
