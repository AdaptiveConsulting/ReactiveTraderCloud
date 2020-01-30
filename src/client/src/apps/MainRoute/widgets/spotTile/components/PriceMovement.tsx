import React from 'react'
import { styled } from 'rt-theme'
import { PriceMovementTypes } from '../model/priceMovementTypes'

interface Props {
  priceMovementType?: string
  spread: string
  show: boolean
  isAnalyticsView: boolean
  isRequestRFQ: boolean
}

const MovementIcon = styled('i')<{ show: boolean; color: string }>`
  text-align: center;
  color: ${({ theme, color }) =>
    color === 'none' ? theme.colors.light.secondary[4] : theme.template[color].normal};
  visibility: ${({ show }) => (show ? 'visible' : 'hidden')};
`

const MovementValue = styled.div`
  font-size: 11px;
  opacity: 0.59;
`

const PriceMovementStyle = styled.div<{
  isAnalyticsView: boolean
}>`
  display: flex;
  padding-right: ${({ isAnalyticsView }) => (isAnalyticsView ? '12px' : '0')};
  padding-left: ${({ isAnalyticsView }) => (isAnalyticsView ? '8px' : '0')};
  align-items: center;
  justify-content: center;
  flex-direction: column;
  width: 100%;
  z-index: 1;
`

const PriceMovement: React.FC<Props> = ({
  priceMovementType,
  spread,
  show,
  isAnalyticsView,
  isRequestRFQ: isInitiateRFQ,
}) => (
  <PriceMovementStyle isAnalyticsView={isAnalyticsView}>
    <MovementIcon
      data-qa="price-movement__movement-icon--up"
      show={show && priceMovementType === PriceMovementTypes.Up}
      color={isInitiateRFQ ? 'none' : 'green'}
      className="fas fa-caret-up"
      aria-hidden="true"
    />
    <MovementValue data-qa="price-movement__movement-value">{spread}</MovementValue>
    <MovementIcon
      data-qa="price-movement__movement-icon--down"
      show={show && priceMovementType === PriceMovementTypes.Down}
      color={isInitiateRFQ ? 'none' : 'red'}
      className="fas fa-caret-down"
      aria-hidden="true"
    />
  </PriceMovementStyle>
)

export default PriceMovement
