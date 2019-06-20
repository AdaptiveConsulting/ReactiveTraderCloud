import React, { useEffect, useMemo } from 'react'
import { AnalyticsLineChartModel } from '../model/AnalyticsLineChartModel'
import { PositionsChartModel } from '../model/positionsChartModel'
import { AnalyticsBarChart } from './analyticsBarChart'
import PositionsBubbleChart from './positions-chart/PositionsBubbleChart'

import { CurrencyPair } from 'rt-types'
import { useForceUpdate, useWindowSize } from 'rt-util'

import { AnalyticsStyle, BubbleChart, Title, AnalyticsLineChartWrapper, Header } from './styled'
import AnalyticsWindowHeader from './AnalyticsHeader'
import { AnalyticsLineChart } from './analyticsLineChart'
import LastPosition from './LastPosition'
import { withDrag, tilesAreDraggabe } from '../../drag/drag'

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

const Analytics: React.FC<Props> = ({
  canPopout,
  currencyPairs,
  analyticsLineChartModel,
  positionsChartModel,
  onPopoutClick,
}) => {
  const windowSize = useWindowSize()
  const forceUpdate = useForceUpdate()
  const drag = useMemo(withDrag, [])

  // Resizing the window is causing the nvd3 chart to resize incorrectly. This forces a render when the window resizes
  useEffect(() => {
    forceUpdate()
  }, [windowSize])
  return (
    <AnalyticsStyle
      draggable={tilesAreDraggabe}
      onDragEnd={(event: React.DragEvent<HTMLDivElement>) => {
        drag.onDragEnd(event, onPopoutClick)
      }}
      onDragStart={drag.onDragStart}
      onDrag={drag.onDrag}
    >
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
