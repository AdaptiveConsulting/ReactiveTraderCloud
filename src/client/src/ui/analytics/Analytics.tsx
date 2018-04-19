import * as classnames from 'classnames'
import * as _ from 'lodash'
import * as React from 'react'
import { CurrencyPair } from '../../types/currencyPair'
import { AnalyticsBarChart, PNLChart, PositionsBubbleChart } from './'
import { PNLChartModel } from './model/pnlChartModel'
import { PositionsChartModel } from './model/positionsChartModel'

export interface AnalyticsProps {
  canPopout: boolean
  isConnected: boolean
  pnlChartModel?: PNLChartModel
  positionsChartModel?: PositionsChartModel,
  currencyPairs: CurrencyPair[]
  onPopoutClick?: () => void
}

const RESIZE_EVENT = 'resize'

export default class Analytics extends React.Component<AnalyticsProps, {}> {

  private handleResize = () => this.forceUpdate();

  componentWillMount() {
    // Resizing the window is causing the nvd3 chart to resize incorrectly. This forces a render when the window resizes
    window.addEventListener(RESIZE_EVENT, this.handleResize)
  }

  componentWillUnmount() {
    window.removeEventListener(RESIZE_EVENT, this.handleResize)
  }

  render() {
    const { canPopout, isConnected, currencyPairs } = this.props

    if (!isConnected) {
      return (
        <div className="analytics__container">
          <div ref="analyticsInnerContainer"></div>
        </div>
      )
    }

    const newWindowBtnClassName = classnames('glyphicon glyphicon-new-window', canPopout && 'analytics__icon--tearoff--hidden' || 'analytics__icon--tearoff')

    return (
      <div className="analytics analytics__container animated fadeIn">
        <div className="analytics__controls popout__controls">
          <i className={newWindowBtnClassName}
             onClick={() => this.props.onPopoutClick()}/>
        </div>
        {this.props.pnlChartModel && <PNLChart {...this.props.pnlChartModel} />}
        <div className="analytics__bubblechart-container">
          <span className="analytics__chart-title analytics__bubblechart-title">Positions</span>
          {!_.isEmpty(this.props.positionsChartModel.seriesData) &&
          <PositionsBubbleChart data={this.props.positionsChartModel.seriesData} currencyPairs={currencyPairs}/>}
        </div>
        <div>
          <div className="analytics__chart-container">
            <span className="analytics__chart-title">PnL</span>
            {!_.isEmpty(this.props.positionsChartModel.seriesData) &&
            <AnalyticsBarChart chartData={this.props.positionsChartModel.seriesData} currencyPairs={currencyPairs} isPnL={true}/>}
          </div>
        </div>
      </div>
    )
  }
}
