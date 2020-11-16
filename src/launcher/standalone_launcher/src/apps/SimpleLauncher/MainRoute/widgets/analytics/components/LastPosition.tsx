import React from 'react'
import numeral from 'numeral'
import styled from 'styled-components/macro'

type Accents = 'positive' | 'negative'

const USDspan = styled.span`
  opacity: 0.6;
  font-size: 14px;
  margin-right: 10px;
`
const LastPositionStyle = styled.span<{ color: Accents }>`
  font-size: 14px;
  color: ${({ theme, color }) => theme.accents[color].base};
`
interface LastPositionProps {
  lastPos?: number | undefined
}

interface FormattedLastPosition {
  lastPosition: string
  color: Accents
}

const lastPositionColor: (lastPos: number) => FormattedLastPosition = (lastPos: number) => {
  const lastPosition = lastPos >= 0 ? '+' + numeral(lastPos).format() : numeral(lastPos).format()
  const color: Accents = lastPos >= 0 ? 'positive' : 'negative'
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
