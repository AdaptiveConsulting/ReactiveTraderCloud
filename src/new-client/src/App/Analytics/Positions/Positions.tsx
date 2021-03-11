import { useLayoutEffect, useRef } from "react"
import {
  D3DragEvent,
  drag,
  forceCollide,
  forceSimulation,
  forceX,
  forceY,
  select,
} from "d3"
import { BubbleChartNode, nodes$, useData, data$ } from "./data"
import { BubbleChart, Title } from "../styled"

// extra pixel amount that nodes in the chart repel each other within
// for collision detection purposes, a nodes radius is r + COLLIDE_BORDER_WIDTH pixels
const COLLIDE_BORDER_WIDTH = 2
const getId = (x: any) => x.id

const d3Effect = (chartDiv: HTMLDivElement) => {
  const tooltip = select(chartDiv)
    .append("div")
    .style("visibility", "hidden")
    .attr("class", "analytics__positions-tooltip")
    .attr("data-testid", "tooltip")

  // const svg: Selection<SVGElement> = select(chartDiv).select("svg")
  const { width, height } = chartDiv
    ? chartDiv.getBoundingClientRect()
    : { width: 0, height: 0 }
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

  const positionTooltip = (event: MouseEvent, node: BubbleChartNode): void => {
    if (typeof node.x === "undefined" || typeof node.y === "undefined") {
      return
    }
    const posX: number =
      (event ? event.offsetX : node.x) - tooltip.nodes()[0].clientWidth / 2
    const posY: number = event ? event.offsetY : node.y
    const id: string = node.id
    tooltip.style("top", posY + 15 + "px").style("left", posX + "px")
    tooltip.text(`${id} ${node.text}`)
  }

  // setup that happens on mount and when nodes are added/removed
  const subscription = nodes$.subscribe(({ nodes, isAddRemove }) => {
    const { width, height } = chartDiv.getBoundingClientRect()

    const svg = select(chartDiv).select("svg")
    const children = () => svg.selectAll("g").data(nodes, getId)

    if (isAddRemove) {
      children().exit().remove()

      children()
        .enter()
        .append("g")
        .attr("class", "node")
        .append("circle")
        .attr("r", (d) => d.r)
        .attr("cx", width / 2)
        .attr("cy", height / 2)
        .style("fill", (d: BubbleChartNode) => d.color)
        .style("filter", "url(#drop-shadow)")

      children()
        .append("text")
        .attr("text-anchor", "middle")
        .attr("class", "analytics__positions-label")
        .attr("data-testid", (d: BubbleChartNode) => `positions-label-${d.id}`)
        .text(getId)

      children()
        .on("mouseover", (e, d) => {
          tooltip.style("visibility", "visible")
          positionTooltip(e, d)
        })
        .on("mousemove", positionTooltip)
        .on("mouseout", () => {
          tooltip.style("visibility", "hidden")
        })
    } else {
      children()
        .selectAll("circle")
        .data(nodes, getId)
        .transition()
        .duration(800)
        .attr("r", (d: BubbleChartNode) => d.r)
        .style("filter", "url(#drop-shadow)")
        .style("fill", (d: BubbleChartNode) => d.color)
    }

    const force = forceSimulation(nodes)
      // forces that pull all nodes toward the center of the simulation
      .force(
        "forceX",
        forceX<BubbleChartNode>()
          .strength(0.1)
          .x(width * 0.5),
      )
      .force(
        "forceY",
        forceY<BubbleChartNode>()
          .strength(0.1)
          .y(height * 0.5),
      )
      // force that pushes nodes away from each other when they are
      // within each other's collision radius
      .force(
        "collide",
        forceCollide<BubbleChartNode>()
          .strength(0.5)
          .radius(function (d) {
            return d.r + COLLIDE_BORDER_WIDTH
          }),
      )
      // on each tick, take the x and y values calculated by d3
      // and set the circle and circle text coordinates to those values
      .on("tick", () => {
        svg
          .selectAll("circle")
          .attr("cx", function (d: any) {
            return d.x
          })
          .attr("cy", function (d: any) {
            return d.y
          })
        svg
          .selectAll("text")
          .attr("x", function (d: any) {
            return d.x
          })
          .attr("y", function (d: any) {
            // add a few pixels for better center alignment
            return d.y + 4
          })
      })

    const onMove = (
      event: D3DragEvent<any, BubbleChartNode, any>,
      d: BubbleChartNode,
    ) => {
      force.alpha(0.5).restart()
      positionTooltip(event.sourceEvent, d)
      d.fx = event.x
      d.fy = event.y
    }

    // on drag, restart the simulation with a moderate amount of entropy
    // to start the system ticking again, which allows for visual updates
    children().call(
      drag<any, BubbleChartNode>()
        .on("start", onMove)
        .on("drag", onMove)
        .on("end", (event, d) => {
          force.alphaTarget(0)
          positionTooltip(event.sourceEvent, d)
          d.fx = null
          d.fy = null
        }),
    )
  })

  return () => subscription.unsubscribe()
}

export const Positions: React.FC = () => {
  useData()
  const wrapperRef = useRef<HTMLDivElement>(null)
  useLayoutEffect(() => d3Effect(wrapperRef.current!), [])

  return (
    <div>
      <Title>Positions</Title>
      <BubbleChart ref={wrapperRef} />
    </div>
  )
}

export const positions$ = data$
