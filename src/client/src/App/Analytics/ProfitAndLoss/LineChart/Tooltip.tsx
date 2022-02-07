import { bind } from "@react-rxjs/core"
import { createSignal } from "@react-rxjs/utils"
import { LINE_CHART_HEIGHT } from "./constants"
import { dataPoints$ } from "./dataPoints$"
import { format } from "date-fns"
import { RefObject, useEffect, useLayoutEffect, useRef } from "react"
import { createPortal } from "react-dom"
import { map, switchMap } from "rxjs/operators"
import styled from "styled-components"
import { formatWithScale, precisionNumberFormatter } from "@/utils/formatNumber"

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

const [hoverX$, onHover] = createSignal<number | null>()

const getScaledPoint$ = (mouseX: number) =>
  dataPoints$.pipe(
    map(({ points, xScale, yScale }) => {
      const scaledPoints = points.map((point) => ({
        date: point[0],
        value: point[1],
        y: yScale(point[1]),
        x: xScale(point[0]),
      }))

      // A binary search to find the point in the graph that's closest to the mouse
      if (mouseX === null) return null
      let from = { idx: 0, x: scaledPoints[0].x }
      let to = {
        idx: scaledPoints.length - 1,
        x: scaledPoints[scaledPoints.length - 1].x,
      }

      do {
        const idx = from.idx + Math.floor((to.idx - from.idx) / 2)
        const x = scaledPoints[idx].x

        const diff = mouseX - x
        if (diff === 0) return scaledPoints[idx]
        if (diff > 0) {
          from = { idx, x }
        } else {
          to = { idx, x }
        }
      } while (to.idx - from.idx > 1)
      return scaledPoints[mouseX - from.x < to.x - mouseX ? from.idx : to.idx]
    }),
  )

const [useHoverPoint] = bind(
  hoverX$.pipe(
    switchMap((mouseX) => (mouseX === null ? [null] : getScaledPoint$(mouseX))),
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
    const tooltipEl = tooltipDivRef.current!.children[0] as HTMLDivElement
    const wrapperEl = svgRef.current?.parentNode as HTMLDivElement | null

    const tooltipRect = tooltipEl?.getBoundingClientRect()
    const wrapperRect = wrapperEl?.getBoundingClientRect()
    if (!tooltipRect || !wrapperRect) return
    if (
      wrapperRect.left + tooltipPositionRef.current.x + tooltipRect.width >
      wrapperRect.right
    ) {
      tooltipPositionRef.current.x = wrapperRect.width - tooltipRect.width
    }
    if (
      wrapperRect.top + tooltipPositionRef.current.y + tooltipRect.height >
      wrapperRect.bottom
    ) {
      tooltipPositionRef.current.y = wrapperRect.height - tooltipRect.height
    }
    tooltipEl.style.transform = `
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
        />
        <circle
          r="4"
          fill={point.value >= 0 ? "#28c988" : "#f94c4c"}
          strokeWidth="2"
          stroke="#fff"
          cx={point.x}
          cy={point.y}
        />
        {createPortal(
          <ToolTipStyle
            style={{
              transform: `translate(${tooltipPositionRef.current.x}px, ${tooltipPositionRef.current.y}px)`,
            }}
          >
            <ToolTipChildLeft>
              {format(point.date, "HH:mm:ss aaaa")}
            </ToolTipChildLeft>
            <ToolTipChildRight>
              {formatWithScale(point.value, formatToPrecision1)}
            </ToolTipChildRight>
          </ToolTipStyle>,
          tooltipDivRef.current!,
        )}
      </>
    )
  )
}
