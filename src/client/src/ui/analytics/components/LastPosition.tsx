import React from 'react'
import numeral from 'numeral'
import { styled } from 'rt-theme'

const USDspan = styled.span`
  opacity: 0.6;
  font-size: 14px;
  margin-right: 10px;
`
const LastPositionStyle = styled.span<{ color: string }>`
  font-size: 14px;
  color: ${({ theme, color }) => theme.analytics[color].normal};
`
interface LastPositionProps {
  lastPos?: number | undefined
}

interface FormattedLastPosition {
  lastPosition: string
  color: Colors
}

type Colors = 'green' | 'red'

const formatLastPosition: (lastPos: number) => FormattedLastPosition = (lastPos: number) => {
  let lastPosition = numeral(lastPos).format()

  let color: Colors = 'green'

  if (lastPos >= 0) {
    color = 'green'
    lastPosition = `+  ${lastPosition}`
  }
  if (lastPos < 0) {
    color = 'red'
  }
  return { color, lastPosition }
}

const LastPosition: React.SFC<LastPositionProps> = ({ lastPos = 0 }) => {
  const { color, lastPosition } = formatLastPosition(lastPos)
  return (
    <div>
      <USDspan>USD</USDspan>
      <LastPositionStyle color={color}>{lastPosition}</LastPositionStyle>
    </div>
  )
}

export default LastPosition
