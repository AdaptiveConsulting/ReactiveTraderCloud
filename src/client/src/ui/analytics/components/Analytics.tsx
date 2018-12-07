import React from 'react'
import { AnalyticsLineChartModel } from '../model/AnalyticsLineChartModel'
import { PositionsChartModel } from '../model/positionsChartModel'
import AnalyticsBarChart from './AnalyticsBarChart'
import PositionsBubbleChart from './positions-chart/PositionsBubbleChart'

import { CurrencyPair } from 'rt-types'

import { AnalyticsStyle, BubbleChart, Title, AnalyticsLineChartWrapper } from './styled'
import AnalyticsHeader from './AnalyticsHeader'
import AnalyticsLineChart from './AnalyticsLineChart'
import LastPosition from './LastPosition'
export interface CurrencyPairs {
  [id: string]: CurrencyPair
}

export interface Props {
  canPopout: boolean
  currencyPairs: CurrencyPairs
  analyticsLineChartModel: AnalyticsLineChartModel
  positionsChartModel?: PositionsChartModel
  onPopoutClick?: () => void
}

const RESIZE_EVENT = 'resize'

export default class Analytics extends React.Component<Props> {
  private handleResize = () => this.forceUpdate() // NVD3 chart redraw

  componentWillMount() {
    window.addEventListener(RESIZE_EVENT, this.handleResize)
  }

  componentWillUnmount() {
    window.removeEventListener(RESIZE_EVENT, this.handleResize)
  }

  render() {
    const { canPopout, currencyPairs, analyticsLineChartModel, positionsChartModel, onPopoutClick } = this.props

    return (
      <AnalyticsStyle>
        <AnalyticsHeader canPopout={canPopout} onPopoutClick={onPopoutClick} />
        <LastPosition lastPos={analyticsLineChartModel.lastPos} />
        <AnalyticsLineChartWrapper>
          <AnalyticsLineChart model={analyticsLineChartModel} />
        </AnalyticsLineChartWrapper>
        {positionsChartModel &&
          positionsChartModel.seriesData.length !== 0 && (
            <React.Fragment>
              <Title>Positions</Title>
              <BubbleChart>
                <PositionsBubbleChart data={positionsChartModel.seriesData} currencyPairs={currencyPairs} />
              </BubbleChart>
              <Title>PnL</Title>
              <AnalyticsBarChart
                chartData={positionsChartModel.seriesData}
                currencyPairs={currencyPairs}
                isPnL={true}
              />
            </React.Fragment>
          )}
      </AnalyticsStyle>
    )
  }
}
