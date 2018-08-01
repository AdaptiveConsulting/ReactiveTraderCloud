import React from 'react'
import { Flex } from 'rt-components'
import { PriceMovementTypes } from 'rt-types'
import { styled } from 'rt-util'

interface Props {
  priceMovementType: string
  spread: {
    formattedValue: string
  }
}

const MovementIcon = styled('i')<{ show: boolean; color: string }>`
  text-align: center;
  color: ${({ theme: { background, palette }, show, color }) =>
    show ? palette[color].normal : background.backgroundSecondary};
`

const MovementValue = styled('div')`
  font-size: 11px;
  color: ${({ theme: { text } }) => text.textMeta};
`

const PriceMovement = ({ priceMovementType, spread }: Props) => (
  <Flex alignItems="center" justifyContent="center" direction="column" width="100%">
    <MovementIcon
      show={priceMovementType === PriceMovementTypes.Up}
      color="accentGood"
      className="fas fa-caret-up"
      aria-hidden="true"
    />
    <MovementValue>{spread.formattedValue}</MovementValue>
    <MovementIcon
      show={priceMovementType === PriceMovementTypes.Down}
      color="accentBad"
      className="fas fa-caret-down"
      aria-hidden="true"
    />
  </Flex>
)

export default PriceMovement
