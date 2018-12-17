import React from 'react'
import { testStyled } from 'test-theme'
import { PriceMovementTypes } from '../model/priceMovementTypes'

interface Props {
  priceMovementType?: string
  spread: string
}

const MovementIcon = testStyled('i')<{ show: boolean; color: string }>`
  text-align: center;
  color: ${({ theme, color }) => theme.tile[color].base};
  visibility: ${({ show }) => (show ? 'visible' : 'hidden')};
`

const MovementValue = testStyled.div`
  font-size: 11px;
  opacity: 0.59;
`

const PriceMovementStyle = testStyled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  width: 100%;
`

const PriceMovement: React.SFC<Props> = ({ priceMovementType, spread }) => (
  <PriceMovementStyle>
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
  </PriceMovementStyle>
)

export default PriceMovement
