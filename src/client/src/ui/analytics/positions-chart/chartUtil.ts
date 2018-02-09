/* tslint:disable */
import * as _ from 'lodash'
import * as d3 from 'd3'
import * as numeral from 'numeral'
import { CurrencyPair } from '../../../types/currencyPair'
import { CurrencyPairPosition } from '../../../types/currencyPairPosition';
import { PositionsBubbleChartProps } from './PositionsBubbleChart'

const baseTradedAmountName = 'baseTradedAmount'

export function getPositionsDataFromSeries(series = [], currencyPairs: CurrencyPair[]) {
  const baseAmountPropertyName = baseTradedAmountName
  const positionsPerCcyObj = series.reduce(
    (aggregatedPositionsObj, ccyPairPosition: CurrencyPairPosition) => {
      const { symbol } = ccyPairPosition
      const ccyPair:CurrencyPair = currencyPairs[symbol]
      const baseCurrency = ccyPair ? ccyPair.base : ''
      aggregatedPositionsObj[baseCurrency] = aggregatedPositionsObj[baseCurrency]
        ? aggregatedPositionsObj[baseCurrency] + ccyPairPosition[baseAmountPropertyName]
        : ccyPairPosition[baseAmountPropertyName]

      return aggregatedPositionsObj
    },
    {})

  return _.map(positionsPerCcyObj, (val, key) => {
    return {
      symbol: key,
      [baseAmountPropertyName]: val,
    }
  }).filter((positionPerCcy, index) => positionPerCcy[baseAmountPropertyName] !== 0)
}

export function createScales(props: PositionsBubbleChartProps) {
  const ratio = 12.5
  const { width, height } = props.size
  const minR = 15
  const maxR = 60
  const offset = maxR / 2
  const positionData = getPositionsDataFromSeries(props.data, props.currencyPairs)

  const baseValues = _.map(positionData, (val: any) => {
    return Math.abs(val[baseTradedAmountName])
  })

  const maxValue = _.max(baseValues) || 0
  let minValue = _.min(baseValues) || 0

  if (minValue === maxValue) minValue = 0

  const scales = {
    x: d3.scale.linear()
      .domain([0, props.data.length])
      .range([(-(width / ratio)), (width / ratio) - offset]),
    y: d3.scale.linear()
      .domain([0, props.data.length])
      .range([-(height / (ratio)), height / ratio]),
    r: d3.scale.sqrt()
      .domain([minValue, maxValue])
      .range([minR, maxR])}

  return scales
}


export function updateNodes(nodeGroup: any, nodes: any[], scales: any) {
  const nodeMap = {}

  nodeGroup.each(collide(.1, nodes, scales.r))
    .attr({
      transform: (d: any, i: any) => {
        if (d.x !== undefined && d.y !== undefined && !isNaN(d.x) && !isNaN(d.y)) {
          nodeMap[d.id] = { x: d.x, y: d.y }
          return 'translate(' + d.x + ',' + d.y + ')'
        } else {
          nodeMap[d.id] = { x: 0, y: 0 }
          return 'translate(0, 0)'
        }

      },
      id: (d: any, i: any) => {
        return d.id
      },
    })

  nodes.forEach((node: any) => {
    const newSettings = nodeMap[node.id]
    if (newSettings) {
      node.x = newSettings.x
      node.y = newSettings.y
    }
  })
}


export function drawCircles(nodeGroup: any, duration: number = 800) {
  nodeGroup
    .on('mouseover', (d: any) => {
      d3.select(d.target).style('fill', '#00A8CC')
    })
    .on('mouseout', (d: any) => {
      d3.select(d.target).style('fill', d.color)
    })
    .transition()
    .duration(duration)
    .attr({
      r: (d: any) => {
        return d.r
      },
    })
    .style({
      fill: (d: any) => {
        return d.color
      },
    })
}

export function drawLabels(nodeGroup: any) {
  nodeGroup.attr({
    x: 0,
    y: 3,
    class: 'analytics__positions-label',
  })
  .text((d: any) => {
    return d.id
  })
}

export function getRadius(dataObj: any, scales: any) {
  return scales.r(Math.abs(dataObj.baseTradedAmount))
}

export function getPositionValue(id: string, positionsData: any[]) {
  const index = _.findIndex(positionsData, (pos: any) => pos.symbol === id)
  if (index >= 0) {
    return numeral(positionsData[index].baseTradedAmount).format('0,0')
  }
  return ''
}

export function collide(alpha: number, nodes: any[], scale?: number) {
  const qt = d3.geom.quadtree(nodes)
  const padding = 10

  return (d: any) => {
    let r = d.r + 10 + padding

    const nx1 = d.x - r
    const nx2 = d.x + r
    const ny1 = d.y - r
    const ny2 = d.y + r

    return qt.visit((quad: any, x1: number, y1: number, x2: number, y2: number) => {
      if (quad.point && quad.point !== d) {
        let x = d.x - quad.point.x
        let y = d.y - quad.point.y
        let l = Math.sqrt(x * x + y * y)
        r = d.r + quad.point.r + padding
        if (l < r) {
          l = (l - r) / l * alpha
          d.x -= x *= l
          d.y -= y *= l
          quad.point.x += x
          quad.point.y += y
        }
      }
      return x1 > nx2 || x2 < nx1 || y1 > ny2 || y2 < ny1
    })
  }
}
