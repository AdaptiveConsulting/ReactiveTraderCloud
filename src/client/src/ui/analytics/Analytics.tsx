import * as React from 'react'
import * as classnames from 'classnames'
// import { PositionsChartModel, PnlChartModel } from '../model'
import { AnalyticsBarChart, PNLChart, PositionsBubbleChart } from './'
import { PNLChartProps } from './PNLChart'
import './analytics.scss'

// TODO: Move these to types and actions
function replaceWithAction(a: any, b: any): void {
  return
}

export interface PositionsChartModel {
  _seriesData: any[]
  options: {
    showYAxis: boolean
    showXAxis: boolean
    showLegend: boolean
    useInteractiveGuideline: boolean
    duration: number
    showValues: boolean
    showControls: boolean
    tooltip: {
      enabled: boolean,
    },
    margin: {
      top: number
      right: number
      bottom: number,
    },
  },
  yAxisValuePropertyName: any
}

export interface AnalyticsProps {
  canPopout: boolean
  isConnected: boolean
  pnlChartModel?: PNLChartProps
  positionsChartModel?: PositionsChartModel
}

export default class Analytics extends React.Component<AnalyticsProps, {}> {
  render() {
    const { canPopout, isConnected } = this.props

    if (!isConnected)
      return (
        <div className="analytics__container">
          <div ref="analyticsInnerContainer"></div>
        </div>)
    const newWindowBtnClassName = classnames(
      'glyphicon glyphicon-new-window',
      {
        'analytics__icon--tearoff' : !canPopout,
        'analytics__icon--tearoff--hidden' : canPopout,
      },
    )

    return (
      <div className="analytics analytics__container animated fadeIn">
        <div className="analytics__controls popout__controls">
          <i className={newWindowBtnClassName}
             onClick={() => replaceWithAction('popOutAnalytics', {})}/>
        </div>
        <PNLChart {...this.props.pnlChartModel} />
        <div className="analytics__bubblechart-container">
          <span className="analytics__chart-title analytics__bubblechart-title">Positions</span>
          <PositionsBubbleChart data={this.props.positionsChartModel._seriesData}/>
        </div>
        <div>
        <div className="analytics__chart-container">
            <span className="analytics__chart-title">PnL</span>
            <AnalyticsBarChart chartData={this.props.positionsChartModel._seriesData} isPnL={true}/>
          </div>
        </div>
      </div>)
  }
}
