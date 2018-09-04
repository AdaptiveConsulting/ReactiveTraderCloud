import { time } from 'd3'
import _ from 'lodash'
import numeral from 'numeral'

import { PnlChartModelOptions } from '../components/pnlChart/PNLChart'
import { HistoricPosition } from './index'

export interface PricePoint {
  x: any
  y: any
}

export interface PNLChartModel {
  lastPos: number
  maxPnl: number
  minPnl: number
  options: PnlChartModelOptions
  seriesData: PricePoint[]
}

const DEFAULT_PNL = {
  lastPos: 0,
  minPnl: 0,
  maxPnl: 0,
  seriesData: [] as any[]
}

export const getPnlChartModel = (history: HistoricPosition[]) => {
  return {
    ...getPnlPositions(history),
    options: {
      xAxis: {
        tickFormat: (d: string) => time.format('%X')(new Date(d))
      },
      yAxis: {
        tickFormat: (d: string) => numeral(d).format('0.0a')
      },
      showYAxis: true,
      showXAxis: true,
      showLegend: false,
      useInteractiveGuideline: true,
      duration: 0,
      margin: {
        left: 30,
        top: 10,
        right: 0,
        bottom: 24
      }
    }
  } as any
}

const getLimit = (values: number[], callback: Function) => {
  return callback(...values, 0)
}

export const getPnlPositions = (positions: HistoricPosition[] = []) => {
  if (positions.length === 0) {
    return DEFAULT_PNL
  }
  const allPricePoints = positions.filter(item => item.usdPnl).map(item => +item.usdPnl.toFixed(2))

  const seriesData: PricePoint[] = positions
    .filter(item => !_.isNull(item.usdPnl))
    .map(item => ({ x: new Date(item.timestamp), y: item.usdPnl.toFixed(2) }))

  const lastPosition = _.last(positions)
  if (lastPosition) {
    return {
      seriesData,
      lastPos: lastPosition.usdPnl.toFixed(2),
      minPnl: getLimit(allPricePoints, Math.min),
      maxPnl: getLimit(allPricePoints, Math.max)
    }
  }
  return DEFAULT_PNL
}
