import { bind } from "@react-rxjs/core"
import { createListener } from "@react-rxjs/utils"
import { LINE_CHART_HEIGHT } from "App/Analytics/ProfitAndLoss/LineChart/constants"
import { dataPoints$ } from "App/Analytics/ProfitAndLoss/LineChart/dataPoints$"
import { format } from "date-fns"
import { RefObject, useEffect, useLayoutEffect, useRef } from "react"
import { createPortal } from "react-dom"
import {
  debounceTime,
  distinctUntilChanged,
  map,
  withLatestFrom,
} from "rxjs/operators"
import styled from "styled-components/macro"
import { formatWithScale, precisionNumberFormatter } from "utils/formatNumber"

const ToolTipStyle = styled.div`
  pointer-events: none;
  background-color: #14161c;
  width: 120px;
  border-radius: 3px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  transition: -webkit-transform 400ms ease 0s;
  top: 0px;
`

const ToolTipChildLeft = styled.div`
  width: 70px;
  opacity: 0.6;
  font-size: 10px;
  color: ${({ theme }) => theme.white};
`
const ToolTipChildRight = styled.div`
  width: 30px;
  font-size: 10px;
  color: ${({ theme }) => theme.white};
`

const formatToPrecision1 = precisionNumberFormatter(1)

const [hoverX$, onHover] = createListener<number | null>()

const [useHoverPoint] = bind(
  hoverX$.pipe(
    debounceTime(10),
    withLatestFrom(
      dataPoints$.pipe(
        map(({ points, xScale, yScale }) =>
          points.map((point) => ({
            date: point[0],
            value: point[1],
            y: yScale(point[1]),
            x: xScale(point[0]),
          })),
        ),
      ),
    ),
    map(([hoverX, points]) => {
      // A binary search to find the point in the graph that's closest to the mouse
      if (hoverX === null) return null
      let from = { idx: 0, x: points[0].x }
      let to = { idx: points.length - 1, x: points[points.length - 1].x }

      do {
        const idx = from.idx + Math.floor((to.idx - from.idx) / 2)
        const x = points[idx].x

        const diff = hoverX - x
        if (diff === 0) return points[idx]
        if (diff > 0) {
          from = { idx, x }
        } else {
          to = { idx, x }
        }
      } while (to.idx - from.idx > 1)
      return points[hoverX - from.x < to.x - hoverX ? from.idx : to.idx]
    }),
    map(
      (point) =>
        point && {
          ...point,
          date: format(point.date, "HH:mm:ss aaaa"),
          value: formatWithScale(point.value, formatToPrecision1),
        },
    ),
  ),
  null,
)

type Event = React.BaseSyntheticEvent<
  MouseEvent,
  EventTarget & SVGSVGElement,
  EventTarget
>["nativeEvent"]

const CURSOR_MARGIN = 12
export const Tooltip: React.FC<{ svgRef: RefObject<SVGSVGElement> }> = ({
  svgRef,
}) => {
  const tooltipDivRef = useRef<HTMLDivElement>(null)
  if (tooltipDivRef.current === null) {
    ;(tooltipDivRef as any).current = document.createElement("div")
  }

  const tooltipPositionRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 })
  useEffect(() => {
    if (!svgRef.current) return
    const svg = svgRef.current!
    const pt = svg.createSVGPoint()

    function onLeave() {
      onHover(null)
    }
    function onMove(e: Event) {
      pt.x = e.clientX
      pt.y = e.clientY
      onHover(pt.matrixTransform(svg!.getScreenCTM()!.inverse()!).x)

      tooltipPositionRef.current.x = e.offsetX + CURSOR_MARGIN
      tooltipPositionRef.current.y = e.offsetY + CURSOR_MARGIN
    }
    svg.addEventListener("pointermove", onMove)
    svg.addEventListener("pointerleave", onLeave)
    svg.parentNode!.append(tooltipDivRef.current!)
    return () => {
      svg.removeEventListener("pointermove", onMove)
      svg.removeEventListener("pointerleave", onLeave)
    }
  }, [svgRef])

  useLayoutEffect(() => {
    // We have to correct the position of the tooltip when it overflows
    const inner = tooltipDivRef.current!.children[0]?.getBoundingClientRect()
    const outter = (svgRef.current?.parentNode as any)?.getBoundingClientRect()
    if (!inner || !outter) return
    if (
      outter.left + tooltipPositionRef.current.x + inner.width >
      outter.right
    ) {
      tooltipPositionRef.current.x = outter.width - inner.width
    }
    if (
      outter.top + tooltipPositionRef.current.y + inner.height >
      outter.bottom
    ) {
      tooltipPositionRef.current.y = outter.height - inner.height
    }
    ;(tooltipDivRef.current!.children[0]! as any).style.transform = `
      translate(${tooltipPositionRef.current.x}px, ${tooltipPositionRef.current.y}px)
    `
  })

  const point = useHoverPoint()
  return (
    point && (
      <>
        <line
          stroke="#14161c"
          strokeWidth="2"
          fill="none"
          fillOpacity="1"
          x1={point.x}
          x2={point.x}
          y1="0"
          y2={LINE_CHART_HEIGHT}
        ></line>
        <circle
          r="4"
          fill="url(#colorValue)"
          strokeWidth="2"
          stroke="#fff"
          cx={point.x}
          cy={point.y}
        ></circle>
        {createPortal(
          <ToolTipStyle
            style={{
              transform: `translate(${tooltipPositionRef.current.x}px, ${tooltipPositionRef.current.y}px)`,
            }}
          >
            <ToolTipChildLeft>{point.date}</ToolTipChildLeft>
            <ToolTipChildRight>{point.value}</ToolTipChildRight>
          </ToolTipStyle>,
          tooltipDivRef.current!,
        )}
      </>
    )
  )
}
