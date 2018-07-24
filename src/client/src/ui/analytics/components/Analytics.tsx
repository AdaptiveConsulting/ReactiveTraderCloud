import classnames from 'classnames'
import _ from 'lodash'
import React from 'react'
import { PNLChartModel } from '../model/pnlChartModel'
import { PositionsChartModel } from '../model/positionsChartModel'
import AnalyticsBarChart from './AnalyticsBarChart'
import PositionsBubbleChart from './positions-chart/PositionsBubbleChart'

import { CurrencyPairMap } from 'rt-types'
import PNLChart from './pnlChart/PNLChart'

export interface AnalyticsProps {
  canPopout: boolean
  isConnected: boolean
  pnlChartModel?: PNLChartModel
  positionsChartModel?: PositionsChartModel
  currencyPairs: CurrencyPairMap
  onPopoutClick: () => void
}

const RESIZE_EVENT = 'resize'

export default class Analytics extends React.Component<AnalyticsProps, {}> {
  private handleResize = () => this.forceUpdate()

  // Resizing the window is causing the nvd3 chart to resize incorrectly. This forces a render when the window resizes
  componentWillMount() {
    window.addEventListener(RESIZE_EVENT, this.handleResize)
  }

  componentWillUnmount() {
    window.removeEventListener(RESIZE_EVENT, this.handleResize)
  }

  render() {
    const { canPopout, isConnected, currencyPairs, pnlChartModel, positionsChartModel, onPopoutClick } = this.props

    if (!isConnected) {
      return (
        <div className="analytics__container analytics__container--disconnected">
          <div ref="analyticsInnerContainer">Analytics disconnected</div>
        </div>
      )
    }

    return (
      <div className="analytics analytics__container animated fadeIn">
        <div className="analytics__controls popout__controls">
          <i className={getWindowButtonClassName(canPopout)} onClick={onPopoutClick} />
        </div>
        {pnlChartModel && <PNLChart {...pnlChartModel} />}
        <div className="analytics__bubblechart-container">
          <span className="analytics__chart-title analytics__bubblechart-title">Positions</span>
          {!_.isEmpty(positionsChartModel.seriesData) && (
            <PositionsBubbleChart data={positionsChartModel.seriesData} currencyPairs={currencyPairs} />
          )}
        </div>
        <div>
          <div className="analytics__chart-container">
            <span className="analytics__chart-title">PnL</span>
            {!_.isEmpty(positionsChartModel.seriesData) && (
              <AnalyticsBarChart
                chartData={positionsChartModel.seriesData}
                currencyPairs={currencyPairs}
                isPnL={true}
              />
            )}
          </div>
        </div>
      </div>
    )
  }
}

const getWindowButtonClassName = (canPopout: boolean) =>
  classnames(
    'glyphicon glyphicon-new-window',
    (canPopout && 'analytics__icon--tearoff--hidden') || 'analytics__icon--tearoff'
  )
