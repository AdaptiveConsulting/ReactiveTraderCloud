import React from 'react'
import numeral from 'numeral'
import { styled } from 'rt-theme'

type Colors = 'green' | 'red'

const USDspan = styled.span`
  opacity: 0.6;
  font-size: 14px;
  margin-right: 10px;
`
const LastPositionStyle = styled.span<{ color: Colors }>`
  font-size: 14px;
  color: ${({ theme, color }) => theme.template[color].normal};
`
interface LastPositionProps {
  lastPos?: number | undefined
}

interface FormattedLastPosition {
  lastPosition: string
  color: Colors
}

const lastPositionColor: (lastPos: number) => FormattedLastPosition = (lastPos: number) => {
  const lastPosition = lastPos >= 0 ? '+' + numeral(lastPos).format() : numeral(lastPos).format()
  const color: Colors = lastPos >= 0 ? 'green' : 'red'
  return { color, lastPosition }
}

const LastPosition: React.FC<LastPositionProps> = ({ lastPos = 0 }) => {
  const { color, lastPosition } = lastPositionColor(lastPos)
  return (
    <div>
      <USDspan>USD</USDspan>
      <LastPositionStyle color={color}>{lastPosition}</LastPositionStyle>
    </div>
  )
}

export default LastPosition
