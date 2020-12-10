import { Observable } from "rxjs"
import { useLayoutEffect, useRef } from "react"
import { select, layout, Selection, event as d3Event } from "d3"
import { distinctUntilChanged, skip } from "rxjs/operators"
import { ResizeObserver } from "resize-observer"
import {
  BubbleChartNode,
  drawCircles,
  getNodes$,
  updateNodes,
  useData,
  data$,
} from "./data"
import { BubbleChart, Title } from "../styled"

const getSize$ = (element: HTMLElement) =>
  new Observable<{ width: number; height: number }>((subscriber) => {
    subscriber.next(element.getBoundingClientRect())
    const resizeObserver = new ResizeObserver(() => {
      subscriber.next(element.getBoundingClientRect())
    })
    resizeObserver.observe(element)
    return () => resizeObserver.unobserve(element)
  })

const d3Effect = (chartDiv: HTMLDivElement) => {
  const tooltip = select(chartDiv)
    .append("div")
    .style("visibility", "hidden")
    .attr("class", "analytics__positions-tooltip")

  // const svg: Selection<SVGElement> = select(chartDiv).select("svg")
  const { width, height } = chartDiv.getBoundingClientRect()
  const svg = select(chartDiv)
    .append("svg")
    .attr("width", width)
    .attr("height", height)

  // Add shadow
  const definitions = svg.append("defs")
  const filter = definitions
    .append("filter")
    .attr("id", "drop-shadow")
    .attr("height", "130%")

  filter
    .append("feGaussianBlur")
    .attr("in", "SourceAlpha")
    .attr("stdDeviation", 1.5)
    .attr("result", "blur")

  filter
    .append("feOffset")
    .attr("in", "blur")
    .attr("dx", 1)
    .attr("dy", 1)
    .attr("result", "offsetBlur")

  const feMerge = filter.append("feMerge")
  feMerge.append("feMergeNode").attr("in", "offsetBlur")
  feMerge.append("feMergeNode").attr("in", "SourceGraphic")

  let force: layout.Force<
    layout.force.Link<layout.force.Node>,
    layout.force.Node
  >
  let nodeGroup: Selection<any>
  let nodes: BubbleChartNode[]

  const tick = () => updateNodes(nodeGroup, nodes)
  const positionTooltip = (node: BubbleChartNode, event: MouseEvent): void => {
    if (typeof node.x === "undefined" || typeof node.y === "undefined") {
      return
    }
    const posX: number =
      (event ? event.offsetX : node.x) - (tooltip[0][0] as any).clientWidth / 2
    const posY: number = event ? event.offsetY : node.y
    const id: string = node.id
    tooltip.style("top", posY + 15 + "px").style("left", posX + "px")
    tooltip.text(`${id} ${node.text}`)
  }

  const nodes$ = getNodes$(getSize$(chartDiv))

  const differentNodes$ = nodes$.pipe(
    distinctUntilChanged((a, b) => a.length === b.length),
  )

  const subscription = differentNodes$.subscribe((_nodes) => {
    console.log("nodes", _nodes)
    nodes = _nodes
    // svg.remove() // clear all child nodes

    const { width, height } = chartDiv.getBoundingClientRect()
    force = layout
      .force()
      .nodes(nodes)
      .links([])
      .size([width, height])
      .charge((_) => -1)
      .gravity(0.1)
      .on("tick", tick)

    const svg = select(chartDiv).select("svg")

    // update/create g tags for each data point in nodes
    const dataNode = svg
      .selectAll("g.node")
      .data(nodes, (d: BubbleChartNode) => d.id)
    dataNode.enter().append("g").attr("class", "node").call(force.drag)

    // once g tags are up to date and associated with the data,
    // assign the result to the global nodeGroup
    nodeGroup = dataNode

    const circleNodeGroup = nodeGroup.append("circle")
    const labelGroup = nodeGroup.append("text")
    labelGroup
      .attr({ x: 0, y: 3, class: "analytics__positions-label" })
      .text((d: BubbleChartNode) => d.id)
    drawCircles(circleNodeGroup, 0)
    force.nodes(nodes).start()
    dataNode.exit().remove()

    nodeGroup
      .on("mouseover", (dataObj: BubbleChartNode) => {
        tooltip.style("visibility", "visible")
        positionTooltip(dataObj, d3Event as MouseEvent)
      })
      .on("mousemove", (dataObj: BubbleChartNode) =>
        positionTooltip(dataObj, d3Event as MouseEvent),
      )
      .on("mouseout", () => tooltip.style("visibility", "hidden"))
  })

  const nodesUpdates$ = nodes$.pipe(
    distinctUntilChanged((a, b) => a.length !== b.length),
    skip(1),
  )
  subscription.add(
    nodesUpdates$.subscribe((_nodes) => {
      console.log("updated nodes", _nodes)
      nodes = _nodes
      const dataNode = nodeGroup.data(nodes, (d: BubbleChartNode) => d.id)

      dataNode.enter().append("g").attr("class", "node").call(force.drag)
      const circle = nodeGroup.selectAll("circle")
      drawCircles(circle)
      setTimeout(() => {
        force.start()
      }, 200)
      dataNode.exit().remove()
    }),
  )

  return () => subscription.unsubscribe()
}

export const Positions: React.FC = () => {
  useData()
  const wrapperRef = useRef<HTMLDivElement>(null)
  useLayoutEffect(() => {
    return d3Effect(wrapperRef.current!)
  }, [])

  return (
    <div>
      <Title>Positions</Title>
      <BubbleChart ref={wrapperRef} />
    </div>
  )
}

export const positions$ = data$
