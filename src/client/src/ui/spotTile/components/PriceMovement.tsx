import React from 'react'
import styled from 'react-emotion'
import { Flex } from 'rt-components'
import { PriceMovementTypes } from '../model/priceMovementTypes'

interface Props {
  priceMovementType?: string
  spread: string
}

const MovementIcon = styled('i')<{ show: boolean; color: string; theme?: any }>`
  text-align: center;
  color: ${({ theme, color }) => theme[color].base}}};
  visibility: ${({ show }) => (show ? 'visible' : 'hidden')};
`

const MovementValue = styled('div')`
  font-size: 11px;
  opacity: 0.59;
`

//TODO: SVG icons
const PriceMovement: React.SFC<Props> = ({ priceMovementType, spread }) => (
  <Flex alignItems="center" justifyContent="center" direction="column" width="100%">
    <MovementIcon
      show={priceMovementType === PriceMovementTypes.Up}
      color="good"
      className="fas fa-caret-up"
      aria-hidden="true"
    />
    <MovementValue>{spread}</MovementValue>
    <MovementIcon
      show={priceMovementType === PriceMovementTypes.Down}
      color="bad"
      className="fas fa-caret-down"
      aria-hidden="true"
    />
  </Flex>
)

export default PriceMovement
