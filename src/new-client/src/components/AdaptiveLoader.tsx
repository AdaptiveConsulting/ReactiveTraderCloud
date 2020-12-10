import { memo } from "react"
import { keyframes } from "styled-components/macro"
import styled from "styled-components/macro"

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
  color?: string
}

const Bar = styled("rect")<BarProps>`
  animation: ${({ moveDistance }: BarProps) => getBounce(moveDistance)}
    ${({ speed }) => speed}s infinite;
  animation-delay: ${({ order, speed }) =>
    order * (speed / 1.3 / BAR_NUMBER) - speed * 0.6}s;
  fill: ${({ theme, color }) => color ?? theme.core.textColor};
  will-change: transform;
`

type LoaderType = "primary" | "secondary"

export const AdaptiveLoader: React.FC<{
  size: number | string
  type?: LoaderType
  seperation?: number
  speed?: number
  color?: string
}> = memo(({ size, type, seperation, speed, children, color }) => {
  const sizeNum = Number(size)
  const barHeight = sizeNum * 0.75
  const barWidth = barHeight / 4
  const seperationDistance =
    (seperation !== undefined ? seperation : sizeNum / 25) - 0.5
  const moveDistance = barHeight / 3
  const totalBarWidth =
    barWidth * BAR_NUMBER + seperationDistance * (BAR_NUMBER - 1)
  const extraWidth = sizeNum - totalBarWidth

  return (
    <svg width={sizeNum} height={sizeNum} data-qa="adaptive-loader__svg">
      {bars.map((idx) => (
        <Bar
          type={type || "primary"}
          key={idx}
          height={barHeight}
          width={barWidth}
          x={extraWidth / 2 + idx * (barWidth + seperationDistance)}
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
