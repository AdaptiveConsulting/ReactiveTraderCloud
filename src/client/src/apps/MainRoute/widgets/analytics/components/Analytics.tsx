import React, { useEffect } from 'react'
import { PositionsChartModel } from '../model/positionsChartModel'
import { ProfitAndLoss, ProfitAndLossProps } from './ProfitAndLoss'
import { CurrencyPair } from 'rt-types'
import { useForceUpdate, useWindowSize } from 'rt-util'
import AnalyticsWindowHeader from './AnalyticsHeader'
import { Title, AnalyticsStyle, Header } from './styled'
import { Positions } from './Positions'
import { PnL } from './PnL'

export interface CurrencyPairs {
  [id: string]: CurrencyPair
}

export interface Props extends ProfitAndLossProps {
  currencyPairs: CurrencyPairs
  onPopoutClick?: (x: number, y: number) => void
  canPopout: boolean
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
      <Header>
        <Title>Profit &amp; Loss</Title>
        <AnalyticsWindowHeader canPopout={canPopout} onPopoutClick={onPopoutClick} />
      </Header>
      <ProfitAndLoss analyticsLineChartModel={analyticsLineChartModel} />

      {positionsChartModel && positionsChartModel.seriesData.length !== 0 && (
        <React.Fragment>
          <Positions data={positionsChartModel.seriesData} currencyPairs={currencyPairs} />

          <PnL chartData={positionsChartModel.seriesData} />
        </React.Fragment>
      )}
    </AnalyticsStyle>
  )
}

export default Analytics
