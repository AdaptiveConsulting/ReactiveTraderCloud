import * as React from 'react'
import * as ReactDOM from 'react-dom'
import * as d3 from 'd3'

import { filter, find, findIndex, isEqual, map, reduce } from 'lodash'
import reactSizeme from 'react-sizeme'
import {  createScales,
          getPositionsDataFromSeries,
          updateNodes,
          drawCircles,
          drawLabels,
          getRadius,
          getPositionValue } from './chartUtil'

export interface PositionsBubbleChartProps {
  data: any[],
  // passed by reactSizeme :
  size: {
    width: number
    height: number,
  }
}

export class PositionsBubbleChart extends React.Component<PositionsBubbleChartProps, any> {
  force: any
  scales: any
  tooltip: any
  constructor(props: PositionsBubbleChartProps) {
    super(props)
    this.state = {
      nodes: [],
      prevPositionsData: {},
    }
  }

  componentDidMount() {
    this.redrawChart()
  }

  componentWillReceiveProps(nextProps: any) {
    this.updateNodesFromPropsData(nextProps)

    if (this.shouldRedrawChart(nextProps)) {
      this.setState({ updateRequired: true })
      this.redrawChart(nextProps)
    }
  }

  componentDidUpdate() {
    this.update(this.state.nodes)
  }

  shouldRedrawChart(nextProps = this.props) {
    const positionsData = getPositionsDataFromSeries(nextProps.data)
    const existingPositionsData = this.state.prevPositionsData
    const nodesChanged = positionsData.length !== existingPositionsData.length
    return nodesChanged
  }

  updateNodesFromPropsData(nextProps = this.props) {
    if (this.state.nodes.length === 0 && nextProps.data.length > 0) {
      this.updateNodes(nextProps.data)
    }
    const positionsData = getPositionsDataFromSeries(nextProps.data)
    const existingPositionsData = this.state.prevPositionsData

    // positions data has changed on the existing nodes
    const modifiedData = reduce(
      positionsData, (result, value, key) => {
        return isEqual(value, existingPositionsData[key]) ?
          result : result.concat(key)
      },
      [])

    function filterStale(existingPos: any) {
      return findIndex(positionsData, (pos: any) => pos.symbol === existingPos.symbol) === -1
    }
    const stalePositions = filter(existingPositionsData, filterStale)

    if (modifiedData.length > 0 || stalePositions.length > 0) {
      this.setState({ prevPositionsData: positionsData, updateRequired: true })
      this.scales = createScales(nextProps)

      if (this.state.nodes.length === 0 && this.props.data.length > 0) {
        this.updateNodes(this.props.data)
      } else {
        this.updateNodes(nextProps.data)
      }
    }

    return modifiedData.length > 0 || stalePositions.length > 0
  }

  updateNodes(data: any) {
    let nodes = this.state.nodes
    const colours = ['#6db910', '#d90a0a']
    const positionsData = getPositionsDataFromSeries(data)

    nodes = map(positionsData, (dataObj: any, index: number) => {
      const color =  dataObj.baseTradedAmount > 0 ? colours[0] : colours[1]

      // update an existing node:
      const existingNode = find(nodes, (node: any) => node.id === dataObj.symbol) as any
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

    function filterUpdated(node: any) {
      return findIndex(positionsData, (pos: any) => pos.symbol === node.id) !== -1
    }
    const updatedNodes = filter(nodes, filterUpdated)
    this.setState({ nodes: updatedNodes, prevPositionsData: positionsData, updateRequired: true })
  }

  redrawChart(nextProps = this.props) {
    const dom = ReactDOM.findDOMNode(this)

    const svg = d3.select(dom).select('svg')
    svg.remove() // clear all child nodes
    this.setState({ updateRequired: true })

    this.createTooltip()
    this.createChartForce(nextProps)
  }

  createTooltip() {
    if (this.tooltip) return
    const dom = ReactDOM.findDOMNode(this)
    this.tooltip = d3.select(dom)
      .append('div')
      .style('visibility', 'hidden')
      .attr('class', 'analytics__positions-tooltip')
  }

  createChartForce(nextProps = this.props) {
    const dom = ReactDOM.findDOMNode(this)
    this.scales = createScales(nextProps)

    const tick = () => {
      const nodeGroup = svg.selectAll('g.node')
        .on('mouseover', (dataObj: any, index: number, event: MouseEvent) => {
          this.tooltip.style('visibility', 'visible')
          this.positionTooltip(dataObj, event)
        })
        .on('mousemove', (dataObj: any, index: number, event: MouseEvent) => this.positionTooltip(dataObj, event))
        .on('mouseout', () => this.tooltip.style('visibility', 'hidden'))

      updateNodes(nodeGroup, this.state.nodes, this.scales)
    }

    const svg = d3.select(dom)
      .append('svg')
      .attr('width', this.props.size.width)
      .attr('height', this.props.size.height)

    this.force = d3.layout.force()
      .nodes(this.state.nodes)
      .links([])
      .size([this.props.size.width, this.props.size.height])
      .charge((d: number) => {
        return -1
      })
      .gravity(0.1)
      .on('tick', tick)

    this.update(this.state.nodes)
  }

  positionTooltip(dataObj: any, event: MouseEvent) {
    const posX = (event ? event.layerX : dataObj.x) - this.tooltip[0][0].clientWidth / 2
    const posY = event ? event.layerY : dataObj.y
    this.tooltip.style('top', (posY + 15) + 'px').style('left', posX + 'px')
    this.tooltip.text(`${dataObj.id} ${getPositionValue(dataObj.id, this.state.prevPositionsData)}`)
  }

  update(nodes: any) {
    if (!nodes || !this.force) return
    if (!this.state.updateRequired) return
    this.setState({ updateRequired: false })

    const dom = ReactDOM.findDOMNode(this)
    const svg = d3.select(dom).select('svg')

    const nodeGroup = svg.selectAll('g.node')
      .data(nodes, (d: any, i: number) => {
        return d.id
      })

    nodeGroup.enter().append('g')
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

      setTimeout(
        () => {
          updateNodes(nodeGroup, this.state.nodes, this.scales)
          this.force.start()
        },
        200)
    }
    nodeGroup.exit().remove()
  }

  render() {
    return <div className="analytics__bubblechart-container"></div>
  }
}

export default reactSizeme({ monitorHeight: true })(PositionsBubbleChart)
