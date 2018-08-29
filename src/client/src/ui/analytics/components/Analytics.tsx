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
import { AnalyticsStyle, BubbleChart, Chart, Controls, Disconnected, Header, PopoutButton, Root, Title } from './styled'

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
        <Disconnected>
          <div>Disconnected</div>
        </Disconnected>
      )
    }

    return (
      <ThemeProvider theme={theme => theme.analytics}>
        <AnalyticsStyle>
          <Root>
            <Header>
              {canPopout && (
                <Controls>
                  <PopoutButton onClick={onPopoutClick}>
                    <PopoutIcon width={0.8125} height={0.75} />
                  </PopoutButton>
                </Controls>
              )}
              <Title>Analytics</Title>
            </Header>
            <Chart>{pnlChartModel && <PNLChart {...pnlChartModel} />}</Chart>
            <Title>Positions</Title>
            <BubbleChart>
              {positionsChartModel &&
                !_.isEmpty(positionsChartModel.seriesData) && (
                  <PositionsBubbleChart data={positionsChartModel.seriesData} currencyPairs={currencyPairs} />
                )}
            </BubbleChart>
            <Title>Profit and Loss</Title>
            <Chart>
              {positionsChartModel &&
                !_.isEmpty(positionsChartModel.seriesData) && (
                  <AnalyticsBarChart
                    chartData={positionsChartModel.seriesData}
                    currencyPairs={currencyPairs}
                    isPnL={true}
                  />
                )}
            </Chart>
          </Root>
        </AnalyticsStyle>
      </ThemeProvider>
    )
  }
}
