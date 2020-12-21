import styled from "styled-components/macro"
import { distinctUntilChanged, map, withLatestFrom } from "rxjs/operators"
import { bind } from "@react-rxjs/core"
import { getPrice$, PriceMovementType } from "services/prices"
import { getCurrencyPair$ } from "services/currencyPairs"
import { equals } from "utils/equals"

const MovementIcon = styled("i")<{ show: boolean; color: string }>`
  text-align: center;
  color: ${({ theme, color }) =>
    color === "none"
      ? theme.colors.light.secondary[4]
      : color === "positive"
      ? theme.accents.positive.base
      : theme.accents.negative.base};
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
  grid-area: movement;
`

const [usePriceMovementData, priceMovement$] = bind((symbol: string) =>
  getPrice$(symbol).pipe(
    withLatestFrom(getCurrencyPair$(symbol)),
    map(([{ bid, ask, movementType }, { pipsPosition, ratePrecision }]) => {
      const spread = ((ask - bid) * Math.pow(10, pipsPosition)).toFixed(
        ratePrecision - pipsPosition,
      )
      return { spread, movementType }
    }),
    distinctUntilChanged(equals),
  ),
)

export { priceMovement$ }
export const PriceMovement: React.FC<{
  symbol: string
  isAnalyticsView: boolean
}> = ({ symbol, isAnalyticsView }) => {
  const { spread, movementType } = usePriceMovementData(symbol)
  return (
    <PriceMovementStyle isAnalyticsView={isAnalyticsView}>
      <MovementIcon
        data-qa="price-movement__movement-icon--up"
        show={movementType === PriceMovementType.UP}
        color="positive"
        className="fas fa-caret-up"
        aria-hidden="true"
      />
      <MovementValue data-qa="price-movement__movement-value">
        {spread}
      </MovementValue>
      <MovementIcon
        data-qa="price-movement__movement-icon--down"
        show={movementType === PriceMovementType.DOWN}
        color="negative"
        className="fas fa-caret-down"
        aria-hidden="true"
      />
    </PriceMovementStyle>
  )
}
