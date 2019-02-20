import React from 'react'
import { AnalyticsLineChartModel } from '../model/AnalyticsLineChartModel'
import { PositionsChartModel } from '../model/positionsChartModel'
import { AnalyticsBarChart } from './analyticsBarChart'
import PositionsBubbleChart from './positions-chart/PositionsBubbleChart'

import { CurrencyPair } from 'rt-types'

import { AnalyticsStyle, BubbleChart, Title, AnalyticsLineChartWrapper, Header } from './styled'
import AnalyticsWindowHeader from './AnalyticsHeader'
import { AnalyticsLineChart } from './analyticsLineChart'
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
  private handleResize = () => this.forceUpdate()

  // Resizing the window is causing the nvd3 chart to resize incorrectly. This forces a render when the window resizes
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
        <Header>
          <Title>Profit &amp; Loss</Title>
          <AnalyticsWindowHeader canPopout={canPopout} onPopoutClick={onPopoutClick} />
        </Header>
        <LastPosition lastPos={analyticsLineChartModel.lastPos} />
        <AnalyticsLineChartWrapper>
          <AnalyticsLineChart model={analyticsLineChartModel} />
        </AnalyticsLineChartWrapper>
        {positionsChartModel && positionsChartModel.seriesData.length !== 0 && (
          <React.Fragment>
            <Title>Positions</Title>
            <BubbleChart>
              <PositionsBubbleChart data={positionsChartModel.seriesData} currencyPairs={currencyPairs} />
            </BubbleChart>
            <Title>PnL</Title>
            <AnalyticsBarChart chartData={positionsChartModel.seriesData} />
          </React.Fragment>
        )}
      </AnalyticsStyle>
    )
  }
}
