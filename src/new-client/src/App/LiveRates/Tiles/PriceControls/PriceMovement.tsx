import React from "react"
import styled from "styled-components/macro"
import { PriceMovementType } from "services/tiles"

interface Props {
  priceMovementType?: PriceMovementType
  spread: string
  show: boolean
  isAnalyticsView: boolean
  isRequestRFQ: boolean
}

const MovementIcon = styled("i")<{ show: boolean; color: string }>`
  text-align: center;
  color: ${({ theme }) => theme.colors.light.secondary[4]};
  visibility: ${({ show }) => (show ? "visible" : "hidden")};
`

const MovementValue = styled.div`
  font-size: 11px;
  opacity: 0.59;
`

const PriceMovementStyle = styled.div<{
  isAnalyticsView: boolean
}>`
  display: flex;
  padding-right: ${({ isAnalyticsView }) => (isAnalyticsView ? "9px" : "0")};
  padding-left: ${({ isAnalyticsView }) => (isAnalyticsView ? "9px" : "0")};
  align-items: center;
  justify-content: center;
  flex-direction: column;
  width: 100%;
  z-index: 1;
`

export const PriceMovement: React.FC<Props> = ({
  priceMovementType,
  spread,
  show,
  isAnalyticsView,
  isRequestRFQ: isInitiateRFQ,
}) => (
  <PriceMovementStyle isAnalyticsView={isAnalyticsView}>
    <MovementIcon
      data-qa="price-movement__movement-icon--up"
      show={show && priceMovementType === PriceMovementType.UP}
      color={isInitiateRFQ ? "none" : "positive"}
      className="fas fa-caret-up"
      aria-hidden="true"
    />
    <MovementValue data-qa="price-movement__movement-value">
      {spread}
    </MovementValue>
    <MovementIcon
      data-qa="price-movement__movement-icon--down"
      show={show && priceMovementType === PriceMovementType.DOWN}
      color={isInitiateRFQ ? "none" : "negative"}
      className="fas fa-caret-down"
      aria-hidden="true"
    />
  </PriceMovementStyle>
)
