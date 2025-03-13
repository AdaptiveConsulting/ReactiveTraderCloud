import { memo, ReactNode } from "react"
import styled, { keyframes } from "styled-components"

import { Color } from "../theme/types"

const ANIMATION_SPEED = 2
const BAR_NUMBER = 4
const bars: number[] = Array(BAR_NUMBER)
  .fill(null)
  .map((_, idx) => idx)

const getBounce = (moveDistance: number) => keyframes`
  0% {
    transform: translate(0px,0px);
  }

  50% {
    transform: translate(0px,${moveDistance}px);
  }

  100% {
    transform: translate(0px,0px);
  }
`

interface BarProps {
  order: number
  moveDistance: number
  speed: number
  type: LoaderType
  color?: Color
}

const Bar = styled("rect")<BarProps>`
  animation: ${({ moveDistance }: BarProps) => getBounce(moveDistance)}
    ${({ speed }) => speed}s infinite;
  animation-delay: ${({ order, speed }) =>
    order * (speed / 1.3 / BAR_NUMBER) - speed * 0.6}s;
  fill: ${({ theme, color }) =>
    color ? theme.color[color] : theme.color["Colors/Text/text-primary (900)"]};
  will-change: transform;
`

type LoaderType = "primary" | "secondary"

export const AdaptiveLoader = memo(function AdaptiveLoader({
  size,
  type,
  separation,
  speed,
  children,
  color,
  ariaLabel,
}: {
  ariaLabel?: string
  size: number | string
  type?: LoaderType
  separation?: number
  speed?: number
  color?: Color
  children?: ReactNode
}) {
  const sizeNum = Number(size)
  const barHeight = sizeNum * 0.7
  const barWidth = barHeight / 4
  const separationDistance =
    separation !== undefined ? separation : sizeNum / 12
  const moveDistance = barHeight / 3
  const totalBarWidth =
    barWidth * BAR_NUMBER + separationDistance * (BAR_NUMBER - 1)
  const extraWidth = sizeNum - totalBarWidth

  return (
    <svg
      width={sizeNum}
      height={sizeNum}
      role="progressbar"
      aria-label={ariaLabel}
    >
      {bars.map((idx) => (
        <Bar
          type={type || "primary"}
          key={idx}
          height={barHeight}
          width={barWidth}
          x={extraWidth / 2 + idx * (barWidth + separationDistance)}
          order={idx}
          moveDistance={moveDistance}
          speed={speed || ANIMATION_SPEED}
          color={color}
        />
      ))}
      {children}
    </svg>
  )
})
