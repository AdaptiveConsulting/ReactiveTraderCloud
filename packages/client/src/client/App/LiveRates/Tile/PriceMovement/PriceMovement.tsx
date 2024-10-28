import { FaSortDown, FaSortUp } from "react-icons/fa"
import { distinctUntilChanged, map } from "rxjs/operators"
import styled from "styled-components"

import { equals } from "@/client/utils/equals"
import { getPrice$, PriceMovementType } from "@/services/prices"
import type { RfqResponse } from "@/services/rfqs"

import { useRfqPayload } from "../Rfq/Rfq.state"
import { symbolBind } from "../Tile.context"

const MovementIconUP = styled(FaSortUp)<{ $show: boolean }>`
  position: absolute;
  visibility: ${({ $show: show }) => (show ? "visible" : "hidden")};
  color: ${({ theme }) =>
    theme.newTheme.color["Colors/Text/text-success-primary (600)"]};
  top: 50%;
  margin-top: -16px;
`
const MovementIconDown = styled(FaSortDown)<{ $show: boolean }>`
  position: absolute;
  visibility: ${({ $show: show }) => (show ? "visible" : "hidden")};
  color: ${({ theme }) =>
    theme.newTheme.color["Colors/Text/text-error-primary (600)"]};
  bottom: 50%;
  margin-bottom: -16px;
`

const MovementValue = styled.div`
  font-size: 10px;
  color: ${({ theme }) =>
    theme.newTheme.color["Colors/Text/text-tertiary (600)"]};
  padding: ${({ theme }) => theme.newTheme.spacing.lg} 0;
`

const PriceMovementStyle = styled.div<{
  isAnalyticsView: boolean
}>`
  position: relative;
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

const Line = styled.div<{ isAnalyticsView: boolean }>`
  height: ${({ theme, isAnalyticsView }) =>
    isAnalyticsView
      ? theme.newTheme.spacing["3xl"]
      : theme.newTheme.spacing.lg};
  width: 1px;
  background-color: ${({ theme }) =>
    theme.newTheme.color["Colors/Background/bg-quaternary"]};
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
    <Line isAnalyticsView={isAnalyticsView} />
    <MovementIconUP
      $show={movementType === PriceMovementType.UP}
      // $show={true}
      aria-hidden="true"
    />
    <MovementValue>{spread}</MovementValue>
    <MovementIconDown
      $show={movementType === PriceMovementType.DOWN}
      // $show={true}
      aria-hidden="true"
    />
    <Line isAnalyticsView={isAnalyticsView} />
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
