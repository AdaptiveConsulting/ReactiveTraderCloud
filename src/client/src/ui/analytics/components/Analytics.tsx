import _ from 'lodash'
import React from 'react'
import { PNLChartModel } from '../model/pnlChartModel'
import { PositionsChartModel } from '../model/positionsChartModel'
import AnalyticsBarChart from './AnalyticsBarChart'
import PositionsBubbleChart from './positions-chart/PositionsBubbleChart'

import { CurrencyPairMap } from 'rt-types'
import PNLChart from './pnlChart/PNLChart'

import { PopoutIcon } from 'rt-components'
import { ThemeProvider } from 'rt-theme'
import { AnalyticsStyle, BubbleChart, CloseButton, Controls, Header, Root, Title } from './styled'

export interface Props {
  canPopout: boolean
  isConnected: boolean
  pnlChartModel?: PNLChartModel
  positionsChartModel?: PositionsChartModel
  currencyPairs: CurrencyPairMap
  onPopoutClick: () => void
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
    const { canPopout, isConnected, currencyPairs, pnlChartModel, positionsChartModel, onPopoutClick } = this.props

    if (!isConnected) {
      return (
        <Root className="analytics__container--disconnected">
          <div>Disconnected</div>
        </Root>
      )
    }

    return (
      <ThemeProvider theme={theme => theme.analytics}>
        <AnalyticsStyle>
          <Root>
            <Header>
              {canPopout && (
                <Controls>
                  <CloseButton onClick={onPopoutClick}>
                    <PopoutIcon width={0.8125} height={0.75} />
                  </CloseButton>
                </Controls>
              )}
              <Title>Analytics</Title>
            </Header>
            {pnlChartModel && <PNLChart {...pnlChartModel} />}
            <BubbleChart>
              <Title>Positions</Title>
              {positionsChartModel &&
                !_.isEmpty(positionsChartModel.seriesData) && (
                  <PositionsBubbleChart data={positionsChartModel.seriesData} currencyPairs={currencyPairs} />
                )}
            </BubbleChart>
            <div className="analytics__chart-container">
              <Title>Profit and Loss</Title>
              {positionsChartModel &&
                !_.isEmpty(positionsChartModel.seriesData) && (
                  <AnalyticsBarChart
                    chartData={positionsChartModel.seriesData}
                    currencyPairs={currencyPairs}
                    isPnL={true}
                  />
                )}
            </div>
          </Root>
        </AnalyticsStyle>
      </ThemeProvider>
    )
  }
}
