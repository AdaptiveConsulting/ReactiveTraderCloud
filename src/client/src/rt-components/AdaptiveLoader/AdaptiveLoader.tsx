import React from 'react'
import { keyframes } from 'react-emotion'

import { styled } from 'rt-util'

const ANIMATION_SPEED = 2
const BAR_NUMBER = 4
const bars = []
for (let i = 0; i < BAR_NUMBER; i++) {
  bars.push(i)
}

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
  type: LOADER_TYPE
}
const Bar = styled('rect')<BarProps>`
  animation: ${({ moveDistance }) => getBounce(moveDistance)} ${({ speed }) => speed}s infinite;
  animation-delay: ${({ order, speed }) => order * (speed / 1.3 / BAR_NUMBER)}s;
  fill: ${({ theme, type }) => theme.palette[type][0]};
  will-change: transform;
`

export enum LOADER_TYPE {
  PRIMARY = 'primary',
  SECONDARY = 'secondary'
}

interface Props {
  size: number
  type?: LOADER_TYPE
  seperation?: number
  speed?: number
}

const AdaptiveLoader: React.SFC<Props> = ({ size, type, seperation, speed }) => {
  const barHeight = size * 0.75
  const barWidth = barHeight / 4
  const seperationDistance = (seperation !== undefined ? seperation : size / 25) - 0.5
  const moveDistance = barHeight / 3
  const totalBarWidth = barWidth * BAR_NUMBER + seperationDistance * (BAR_NUMBER - 1)
  const extraWidth = size - totalBarWidth
  return (
    <svg width={size} height={size}>
      {bars.map((item, i) => (
        <Bar
          type={type || LOADER_TYPE.PRIMARY}
          key={i}
          height={barHeight}
          width={barWidth}
          x={extraWidth / 2 + i * (barWidth + seperationDistance)}
          order={i}
          moveDistance={moveDistance}
          speed={speed || ANIMATION_SPEED}
        />
      ))}
    </svg>
  )
}

export default AdaptiveLoader
