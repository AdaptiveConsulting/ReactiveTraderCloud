import React, { useEffect } from 'react'
import { PositionsChartModel } from '../model/positionsChartModel'
import { ProfitAndLoss } from './ProfitAndLoss'
import { CurrencyPair } from 'rt-types'
import { useForceUpdate, useWindowSize } from 'rt-util'
import AnalyticsWindowHeader from './AnalyticsHeader'
import { AnalyticsLineChartModel } from '../model/AnalyticsLineChartModel'
import { AnalyticsStyle } from './styled'

import { Positions } from './Positions'
import { PnL } from './PnL'

export interface CurrencyPairs {
  [id: string]: CurrencyPair
}

export interface Props {
  currencyPairs: CurrencyPairs
  inExternalWindow?: boolean
  canPopout: boolean
  analyticsLineChartModel: AnalyticsLineChartModel
  onPopoutClick?: (x: number, y: number) => void
  positionsChartModel?: PositionsChartModel
}

const Analytics: React.FC<Props> = ({
  canPopout,
  currencyPairs,
  analyticsLineChartModel,
  positionsChartModel,
  onPopoutClick,
  inExternalWindow,
}) => {
  const windowSize = useWindowSize()
  const forceUpdate = useForceUpdate()

  // Resizing the window is causing the nvd3 chart to resize incorrectly. This forces a render when the window resizes
  useEffect(() => {
    forceUpdate()
  }, [windowSize, forceUpdate])
  return (
    <AnalyticsStyle inExternalWindow={inExternalWindow} data-qa="analytics__analytics-content">
      <ProfitAndLoss
        analyticsLineChartModel={analyticsLineChartModel}
        popoutButton={<AnalyticsWindowHeader canPopout={canPopout} onPopoutClick={onPopoutClick} />}
      />

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
