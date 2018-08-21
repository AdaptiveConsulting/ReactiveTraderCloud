import { time } from 'd3'
import _ from 'lodash'
import numeral from 'numeral'

import { PnlChartModelOptions } from '../components/pnlChart/PNLChart'

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

export const getPnlChartModel = (history: any) => {
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
        left: 0,
        top: 0,
        right: 0,
        bottom: 0
      }
    }
  } as any
}

const getLimit = (values: number[], callback: Function) => {
  return callback(...values, 0)
}

export const getPnlPositions = (positions: any[] = []) => {
  const allPricePoints: number[] = positions.filter(item => !_.isNull(item.usdPnl)).map(item => item.usdPnl.toFixed(2))

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
