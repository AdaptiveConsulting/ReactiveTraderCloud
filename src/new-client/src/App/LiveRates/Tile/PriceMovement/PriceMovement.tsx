import styled from "styled-components"
import { FaSortUp, FaSortDown } from "react-icons/fa"
import { distinctUntilChanged, map, withLatestFrom } from "rxjs/operators"
import { getPrice$, PriceMovementType } from "@/services/prices"
import { getCurrencyPair$ } from "@/services/currencyPairs"
import type { RfqResponse } from "@/services/rfqs"
import { equals } from "@/utils/equals"
import { symbolBind } from "../Tile.context"
import { useRfqPayload } from "../Rfq/Rfq.state"

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

const calculateSpread = (
  ask: number,
  bid: number,
  ratePrecision: number,
  pipsPosition: number,
) =>
  ((ask - bid) * Math.pow(10, pipsPosition)).toFixed(
    ratePrecision - pipsPosition,
  )

const [usePriceMovementData, priceMovement$] = symbolBind((symbol: string) =>
  getPrice$(symbol).pipe(
    withLatestFrom(getCurrencyPair$(symbol)),
    map(
      ([
        { bid, ask, movementType, symbol },
        { pipsPosition, ratePrecision },
      ]) => {
        const spread = calculateSpread(ask, bid, ratePrecision, pipsPosition)
        return { spread, movementType, symbol }
      },
    ),
    distinctUntilChanged(equals),
  ),
)
export { priceMovement$ }

export const PriceMovementInner: React.FC<{
  spread: string
  movementType?: PriceMovementType
  isAnalyticsView: boolean
}> = ({ spread, movementType, isAnalyticsView }) => (
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

const PriceMovementFromStream: React.FC<{
  isAnalyticsView: boolean
}> = ({ isAnalyticsView }) => {
  const { spread, movementType } = usePriceMovementData()

  return (
    <PriceMovementInner
      spread={spread}
      movementType={movementType}
      isAnalyticsView={isAnalyticsView}
    />
  )
}

export const PriceFromQuoteInner: React.FC<{
  isAnalytics: boolean
  spread: string
}> = ({ isAnalytics, spread }) => (
  <PriceMovementStyle isAnalyticsView={isAnalytics}>
    <MovementValue>{spread}</MovementValue>
  </PriceMovementStyle>
)

const PriceFromQuote: React.FC<{
  isAnalyticsView: boolean
  rfqResponse: RfqResponse
}> = ({ isAnalyticsView: isAnalytics, rfqResponse }) => {
  const {
    price: { bid, ask },
    currencyPair: { ratePrecision, pipsPosition },
  } = rfqResponse
  const spread = calculateSpread(ask, bid, ratePrecision, pipsPosition)
  return (
    <PriceMovementStyle isAnalyticsView={isAnalytics}>
      <MovementValue>{spread}</MovementValue>
    </PriceMovementStyle>
  )
}

export const PriceMovement: React.FC<{
  isAnalyticsView: boolean
}> = ({ isAnalyticsView }) => {
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
