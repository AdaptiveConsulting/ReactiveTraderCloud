import React from 'react'
import numeral from 'numeral'
import { LastPositionWrapper, LastPositionStyle, USDspan } from './styled'

interface LastPositionProps {
  lastPos?: number | undefined
}

interface FormattedLastPosition {
  lastPosition: string | undefined
  color: string
}

const formatLastPosition: (lastPos: number) => FormattedLastPosition = (lastPos: number) => {
  let lastPosition = numeral(lastPos).format()
  let color = ''
  if (lastPos > 0) {
    color = 'green'
    lastPosition = '+' + lastPosition
  }
  if (lastPos < 0) {
    color = 'red'
  }
  return { color, lastPosition }
}

const LastPosition: React.SFC<LastPositionProps> = ({ lastPos = 0 }) => {
  const { color, lastPosition } = formatLastPosition(lastPos)
  return (
    <LastPositionWrapper>
      <USDspan>USD</USDspan>
      <LastPositionStyle color={color}>{lastPosition}</LastPositionStyle>
    </LastPositionWrapper>
  )
}

export default LastPosition
