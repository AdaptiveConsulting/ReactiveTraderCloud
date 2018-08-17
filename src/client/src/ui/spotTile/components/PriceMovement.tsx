import React from 'react'
import { Flex } from 'rt-components'
import { styled } from 'rt-util'
import { PriceMovementTypes } from '../model/priceMovementTypes'

interface Props {
  priceMovementType?: string
  spread: string
}

const MovementIcon = styled('i')<{ show: boolean; color: string }>`
  text-align: center;
  color: ${({ theme: { palette }, color }) => palette[color].normal}}};
  visibility: ${({ show }) => (show ? 'visible' : 'hidden')};
`

const MovementValue = styled('div')`
  font-size: 11px;
  color: ${({ theme: { text } }) => text.textMeta};
`

//TODO: SVG icons
const PriceMovement: React.SFC<Props> = ({ priceMovementType, spread }) => (
  <Flex alignItems="center" justifyContent="center" direction="column" width="100%">
    <MovementIcon
      show={priceMovementType === PriceMovementTypes.Up}
      color="accentGood"
      className="fas fa-caret-up"
      aria-hidden="true"
    />
    <MovementValue>{spread}</MovementValue>
    <MovementIcon
      show={priceMovementType === PriceMovementTypes.Down}
      color="accentBad"
      className="fas fa-caret-down"
      aria-hidden="true"
    />
  </Flex>
)

export default PriceMovement
