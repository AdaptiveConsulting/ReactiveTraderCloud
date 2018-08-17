import React from 'react'
import { Flex } from 'rt-components'
import { styled } from 'rt-theme'
import { PriceMovementTypes } from '../model/priceMovementTypes'

interface Props {
  priceMovementType?: string
  spread: string
}

const MovementIcon = styled('i')<{ show: boolean; color: string }>`
  text-align: center;
  color: ${({ theme, color }) => theme[color].base}}};
  visibility: ${({ show }) => (show ? 'visible' : 'hidden')};
`

const MovementValue = styled('div')`
  font-size: 11px;
  opacity: 0.59;
`

const PriceMovement: React.SFC<Props> = ({ priceMovementType, spread }) => (
  <Flex alignItems="center" justifyContent="center" direction="column" width="100%">
    <MovementIcon
      show={priceMovementType === PriceMovementTypes.Up}
      color="green"
      className="fas fa-caret-up"
      aria-hidden="true"
    />
    <MovementValue>{spread}</MovementValue>
    <MovementIcon
      show={priceMovementType === PriceMovementTypes.Down}
      color="red"
      className="fas fa-caret-down"
      aria-hidden="true"
    />
  </Flex>
)

export default PriceMovement
