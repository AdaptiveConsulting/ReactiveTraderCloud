import { select, layout, Selection, event as d3Event } from 'd3'
import React, { Component, createRef } from 'react'
import { colors } from 'rt-theme'

import { filter, find, findIndex, isEqual, map, reduce } from 'lodash'
import reactSizeme from 'react-sizeme'

import { CurrencyPairPosition } from '../../model'
import { CurrencyPairs } from '../Analytics'
import {
  createScales,
  drawCircles,
  drawLabels,
  getPositionsDataFromSeries,
  getPositionValue,
  getRadius,
  updateNodes,
  addShadow,
  Scales,
  CCYPosition,
  BubbleChartNode,
} from './chartUtil'

export interface PositionsBubbleChartProps {
  data: CurrencyPairPosition[]
  currencyPairs: CurrencyPairs
  size: {
    width: number
    height: number
  }
}

interface PositionsBubbleChartState {
  nodes: BubbleChartNode[]
  prevPositionsData: CCYPosition[]
  updateRequired: boolean
}

export class PositionsBubbleChart extends Component<
  PositionsBubbleChartProps,
  PositionsBubbleChartState
> {
  chartDivRef = createRef<HTMLDivElement>()
  force: layout.Force<layout.force.Link<layout.force.Node>, layout.force.Node> | undefined
  scales: Scales
  tooltip: any

  state: PositionsBubbleChartState = {
    nodes: [],
    prevPositionsData: [],
    updateRequired: false,
  }

  constructor(props: PositionsBubbleChartProps) {
    super(props)
    this.scales = createScales(props)
  }

  componentDidMount() {
    this.redrawChart()
    this.updateNodesFromPropsData(this.props)
  }

  componentWillReceiveProps(nextProps: PositionsBubbleChartProps) {
    this.updateNodesFromPropsData(nextProps)

    if (this.shouldRedrawChart(nextProps)) {
      this.setState({ updateRequired: true })
      this.redrawChart(nextProps)
    }
  }

  componentDidUpdate() {
    this.update(this.state.nodes)
  }

  private shouldRedrawChart(props: PositionsBubbleChartProps) {
    const positionsData: CCYPosition[] = getPositionsDataFromSeries(props.data, props.currencyPairs)
    const existingPositionsData: CCYPosition[] = this.state.prevPositionsData
    return positionsData.length !== existingPositionsData.length
  }

  private updateNodesFromPropsData(props: PositionsBubbleChartProps): boolean {
    const { nodes } = this.state
    if (nodes.length === 0 && props.data.length > 0) {
      this.updateNodes(props.data)
    }
    const positionsData: CCYPosition[] = getPositionsDataFromSeries(props.data, props.currencyPairs)
    const existingPositionsData: CCYPosition[] = this.state.prevPositionsData

    // positions data has changed on the existing nodes
    const modifiedData: ReadonlyArray<number> = reduce(
      positionsData,
      (acc, value, key: number) =>
        isEqual(value, existingPositionsData[key]) ? acc : acc.concat(key),
      [] as ReadonlyArray<number>,
    )

    function filterStale(existingPos: CCYPosition) {
      return (
        findIndex(positionsData, (pos: CCYPosition) => pos.symbol === existingPos.symbol) === -1
      )
    }
    const stalePositions = filter(existingPositionsData, filterStale)

    if (modifiedData.length > 0 || stalePositions.length > 0) {
      this.setState({ prevPositionsData: positionsData, updateRequired: true })
      this.scales = createScales(props)

      if (this.state.nodes.length === 0 && this.props.data.length > 0) {
        this.updateNodes(this.props.data)
      } else {
        this.updateNodes(props.data)
      }
    }

    return modifiedData.length > 0 || stalePositions.length > 0
  }

  private updateNodes(data: CurrencyPairPosition[]): void {
    let nodes: BubbleChartNode[] = this.state.nodes
    const positionsData: CCYPosition[] = getPositionsDataFromSeries(data, this.props.currencyPairs)
    nodes = map(positionsData, (dataObj: CCYPosition, index: number) => {
      const color =
        dataObj.baseTradedAmount > 0 ? colors.accents.good.base : colors.accents.bad.base
      // update an existing node:
      const existingNode = find(nodes, (node: BubbleChartNode) => node.id === dataObj.symbol)
      if (existingNode) {
        existingNode.r = getRadius(dataObj, this.scales)
        existingNode.cx = this.scales.x(index)
        existingNode.color = color
        return existingNode
      } else {
        const newNode = {
          color,
          id: dataObj.symbol,
          r: getRadius(dataObj, this.scales),
          cx: this.scales.x(index),
        }
        return newNode
      }
    })

    function filterUpdated(node: BubbleChartNode) {
      return findIndex(positionsData, (pos: CCYPosition) => pos.symbol === node.id) !== -1
    }
    const updatedNodes: BubbleChartNode[] = filter(nodes, filterUpdated)
    this.setState({
      nodes: updatedNodes,
      prevPositionsData: positionsData,
      updateRequired: true,
    })
  }

  private redrawChart(nextProps = this.props): void {
    const chartDiv = this.chartDivRef.current
    if (!chartDiv) {
      return
    }
    const svg: Selection<SVGElement> = select(chartDiv).select('svg')
    svg.remove() // clear all child nodes
    this.setState({ updateRequired: true })
    this.createTooltip()
    this.createChartForce(nextProps)
  }

  private createTooltip(): void {
    if (this.tooltip) {
      return
    }
    const chartDiv = this.chartDivRef.current
    if (!chartDiv) {
      return
    }
    this.tooltip = select(chartDiv)
      .append('div')
      .style('visibility', 'hidden')
      .attr('class', 'analytics__positions-tooltip')
  }

  private createChartForce(nextProps: PositionsBubbleChartProps): void {
    this.scales = createScales(nextProps)

    const chartDiv = this.chartDivRef.current
    if (!chartDiv) {
      return
    }

    const tick = () => {
      const nodeGroup = svg
        .selectAll('g.node')
        .on('mouseover', (dataObj: BubbleChartNode) => {
          this.tooltip.style('visibility', 'visible')
          this.positionTooltip(dataObj, d3Event as MouseEvent)
        })
        .on('mousemove', (dataObj: BubbleChartNode) =>
          this.positionTooltip(dataObj, d3Event as MouseEvent),
        )
        .on('mouseout', () => this.tooltip.style('visibility', 'hidden'))
      updateNodes(nodeGroup, this.state.nodes)
    }

    const svg = select(chartDiv)
      .append('svg')
      .attr('width', this.props.size.width)
      .attr('height', this.props.size.height)

    addShadow(svg)

    this.force = layout
      .force()
      .nodes(this.state.nodes)
      .links([])
      .size([this.props.size.width, this.props.size.height])
      .charge(_ => -1)
      .gravity(0.1)
      .on('tick', tick)

    this.update(this.state.nodes)
  }

  positionTooltip(node: BubbleChartNode, event: MouseEvent): void {
    if (typeof node.x === 'undefined' || typeof node.y === 'undefined') {
      return
    }
    const posX: number = (event ? event.offsetX : node.x) - this.tooltip[0][0].clientWidth / 2
    const posY: number = event ? event.offsetY : node.y
    const id: string = node.id
    this.tooltip.style('top', posY + 15 + 'px').style('left', posX + 'px')
    this.tooltip.text(`${id} ${getPositionValue(id, this.state.prevPositionsData)}`)
  }

  update(nodes: BubbleChartNode[]) {
    if (!nodes || !this.force || !this.state.updateRequired) {
      return
    }

    const chartDiv = this.chartDivRef.current
    if (!chartDiv) {
      return
    }

    this.setState({ updateRequired: false })

    const svg = select(chartDiv).select('svg')

    const nodeGroup = svg.selectAll('g.node').data(nodes, (d: BubbleChartNode) => d.id)

    nodeGroup
      .enter()
      .append('g')
      .attr('class', 'node')
      .call(this.force.drag)

    if (nodeGroup.selectAll('circle').empty()) {
      const circleNodeGroup = nodeGroup.append('circle')
      const labelGroup = nodeGroup.append('text')
      drawCircles(circleNodeGroup, 0)
      drawLabels(labelGroup)
      this.force.nodes(nodes).start()
    } else {
      const circle = nodeGroup.selectAll('circle')
      drawCircles(circle)

      setTimeout(() => {
        updateNodes(nodeGroup, this.state.nodes)
        if (this.force) {
          this.force.start()
        }
      }, 200)
    }
    nodeGroup.exit().remove()
  }

  render() {
    return <div ref={this.chartDivRef} />
  }
}

export default reactSizeme({ monitorHeight: true })(PositionsBubbleChart)
