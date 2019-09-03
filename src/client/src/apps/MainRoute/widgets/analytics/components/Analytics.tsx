import React, { useEffect } from 'react'
import { PositionsChartModel } from '../model/positionsChartModel'
import { AnalyticsBarChart } from './analyticsBarChart'
import PositionsBubbleChart from './positions-chart/PositionsBubbleChart'
import { ProfitAndLoss, ProfitAndLossProps } from './ProfitAndLoss'
import { CurrencyPair } from 'rt-types'
import { useForceUpdate, useWindowSize } from 'rt-util'

import { AnalyticsStyle, BubbleChart, Title } from './styled'

export interface CurrencyPairs {
  [id: string]: CurrencyPair
}

export interface Props extends ProfitAndLossProps {
  currencyPairs: CurrencyPairs
  positionsChartModel?: PositionsChartModel
}

const Analytics: React.FC<Props> = ({
  canPopout,
  currencyPairs,
  analyticsLineChartModel,
  positionsChartModel,
  onPopoutClick,
}) => {
  const windowSize = useWindowSize()
  const forceUpdate = useForceUpdate()

  // Resizing the window is causing the nvd3 chart to resize incorrectly. This forces a render when the window resizes
  useEffect(() => {
    forceUpdate()
  }, [windowSize])
  return (
    <AnalyticsStyle>
      <ProfitAndLoss
        canPopout={canPopout}
        onPopoutClick={onPopoutClick}
        analyticsLineChartModel={analyticsLineChartModel}
      />

      {positionsChartModel && positionsChartModel.seriesData.length !== 0 && (
        <React.Fragment>
          <Title>Positions</Title>
          <BubbleChart>
            <PositionsBubbleChart
              data={positionsChartModel.seriesData}
              currencyPairs={currencyPairs}
            />
          </BubbleChart>
          <Title>PnL</Title>
          <AnalyticsBarChart chartData={positionsChartModel.seriesData} />
        </React.Fragment>
      )}
    </AnalyticsStyle>
  )
}

export default Analytics
