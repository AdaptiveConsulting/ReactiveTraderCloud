import * as React from 'react'
import { connect } from  'react-redux'

import './analytics.scss'
import { PositionsChartModel, PnlChartModel } from './model'
import Analytics from './Analytics';

class AnalyticsContainer extends React.Component<any, {}> {
  public render() {
    const analyticsData = this.props.analyticsService
    const positionsChartModel = new PositionsChartModel(analyticsData.currentPositions)
    const pnlChartModel = new PnlChartModel(analyticsData.history)

    const analyticsProps = {
      isConnected: this.props.isConnected,
      pnlChartModel: pnlChartModel,
      positionsChartModel: positionsChartModel
    }

    return <div className="analytics__container">
            <div ref="analyticsInnerContainer">
              <Analytics canPopout={false} {...analyticsProps}  />
            </div>
          </div>
  }
}

function mapStateToProps({analyticsService, compositeStatusService}) {
  const isConnected = compositeStatusService && compositeStatusService.services && compositeStatusService.services.analytics.isConnected
  return { analyticsService, isConnected }
}

export default connect(mapStateToProps)(AnalyticsContainer)
