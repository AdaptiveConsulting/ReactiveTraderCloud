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
      <div>
        <Analytics
          canPopout={false}
          {...analyticsProps}
        />
      </div>
    );
  }
}

function mapStateToProps({ analyticsService, compositeStatusService, displayAnalytics }) {
  const isConnected = compositeStatusService && compositeStatusService.services && compositeStatusService.services.analytics.isConnected
  return { analyticsService, isConnected, displayAnalytics }
}

export default connect(mapStateToProps)(AnalyticsContainer)
