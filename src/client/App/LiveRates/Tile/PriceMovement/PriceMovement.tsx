import { equals } from "client/utils/equals"
import { FaSortDown, FaSortUp } from "react-icons/fa"
import { distinctUntilChanged, map } from "rxjs/operators"
import { getPrice$, PriceMovementType } from "services/prices"
import type { RfqResponse } from "services/rfqs"
import styled from "styled-components"

import { useRfqPayload } from "../Rfq/Rfq.state"
import { symbolBind } from "../Tile.context"

const MovementIconUP = styled(FaSortUp)<{ $show: boolean }>`
  text-align: center;
  color: ${({ theme }) => theme.accents.positive.base};
  visibility: ${({ $show: show }) => (show ? "visible" : "hidden")};
`
const MovementIconDown = styled(FaSortDown)<{ $show: boolean }>`
  text-align: center;
  color: ${({ theme }) => theme.accents.negative.base};
  visibility: ${({ $show: show }) => (show ? "visible" : "hidden")};
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
  grid-area: movement;
`

const [usePriceMovementData, priceMovement$] = symbolBind((symbol: string) =>
  getPrice$(symbol).pipe(
    map(({ spread, movementType, symbol }) => {
      return { spread, movementType, symbol }
    }),
    distinctUntilChanged(equals),
  ),
)
export { priceMovement$ }

export const PriceMovementInner = ({
  spread,
  movementType,
  isAnalyticsView,
}: {
  spread: string
  movementType?: PriceMovementType
  isAnalyticsView: boolean
}) => (
  <PriceMovementStyle isAnalyticsView={isAnalyticsView}>
    <MovementIconUP
      $show={movementType === PriceMovementType.UP}
      aria-hidden="true"
    />
    <MovementValue>{spread}</MovementValue>
    <MovementIconDown
      $show={movementType === PriceMovementType.DOWN}
      aria-hidden="true"
    />
  </PriceMovementStyle>
)

const PriceMovementFromStream = ({
  isAnalyticsView,
}: {
  isAnalyticsView: boolean
}) => {
  const { spread, movementType } = usePriceMovementData()

  return (
    <PriceMovementInner
      spread={spread}
      movementType={movementType}
      isAnalyticsView={isAnalyticsView}
    />
  )
}

export const PriceFromQuoteInner = ({
  isAnalytics,
  spread,
}: {
  isAnalytics: boolean
  spread: string
}) => (
  <PriceMovementStyle isAnalyticsView={isAnalytics}>
    <MovementValue>{spread}</MovementValue>
  </PriceMovementStyle>
)

const PriceFromQuote = ({
  isAnalyticsView: isAnalytics,
  rfqResponse,
}: {
  isAnalyticsView: boolean
  rfqResponse: RfqResponse
}) => (
  <PriceMovementStyle isAnalyticsView={isAnalytics}>
    <MovementValue>{rfqResponse.price.spread}</MovementValue>
  </PriceMovementStyle>
)

export const PriceMovement = ({
  isAnalyticsView,
}: {
  isAnalyticsView: boolean
}) => {
  const payload = useRfqPayload()

  return payload ? (
    <PriceFromQuote
      isAnalyticsView={isAnalyticsView}
      rfqResponse={payload.rfqResponse}
    />
  ) : (
    <PriceMovementFromStream isAnalyticsView={isAnalyticsView} />
  )
}
