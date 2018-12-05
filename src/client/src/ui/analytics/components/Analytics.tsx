import numeral from 'numeral'
import React from 'react'
import { PNLChartModel } from '../model/pnlChartModel'
import { PositionsChartModel } from '../model/positionsChartModel'
import AnalyticsBarChart from './AnalyticsBarChart'
import PositionsBubbleChart from './positions-chart/PositionsBubbleChart'

import { CurrencyPair } from 'rt-types'

import {
  HrBar,
  AnalyticsStyle,
  BubbleChart,
  LinearChartStyle,
  LastPosition,
  Title,
  LastPositionWrapper,
  USDspan,
} from './styled'
import AnalyticsHeader from './AnalyticsHeader'
import ProfitLossLineChart from './AnalyticsLineChart'
export interface CurrencyPairs {
  [id: string]: CurrencyPair
}

export interface Props {
  canPopout: boolean
  currencyPairs: CurrencyPairs
  pnlChartModel?: PNLChartModel
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
    const { canPopout, currencyPairs, pnlChartModel, positionsChartModel, onPopoutClick } = this.props
    const lastPos = (pnlChartModel && pnlChartModel.lastPos) || 0
    const lastPosition = lastPositionWithDirection(lastPos)
    return (
      <AnalyticsStyle>
        <AnalyticsHeader canPopout={canPopout} onPopoutClick={onPopoutClick} />
        <LastPositionWrapper>
          <USDspan>USD</USDspan>
          <LastPosition color={lastPosition.color}>{lastPosition.formattedLastPos}</LastPosition>
        </LastPositionWrapper>
        <LinearChartStyle>
          {pnlChartModel && <ProfitLossLineChart seriesData={pnlChartModel.seriesData} />}
          <HrBar />
        </LinearChartStyle>
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

function lastPositionWithDirection(lastPos: number) {
  let formattedLastPos = numeral(lastPos).format()
  let color = ''
  if (lastPos > 0) {
    color = 'green'
    formattedLastPos = '+' + formattedLastPos
  }
  if (lastPos < 0) {
    color = 'red'
  }
  return { color, formattedLastPos }
}
