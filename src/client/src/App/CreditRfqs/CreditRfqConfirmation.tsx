import { Direction } from "@/generated/TradingGateway"
import { creditInstruments$ } from "@/services/creditInstruments"
import { bind } from "@react-rxjs/core"
import { concat, of, timer } from "rxjs"
import { filter, map, mapTo, switchMap, withLatestFrom } from "rxjs/operators"
import styled from "styled-components"
import { rfqResponse$ } from "../CreditRfqForm/RfqButtonPanel"

const ConfirmationPill = styled.div<{ direction: Direction }>`
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  background-color: ${({ theme, direction }) =>
    theme.colors.spectrum.uniqueCollections[direction].base};
  display: inline-block;
  padding: 0.5rem 1rem;
  border-radius: 2rem;
  font-size: 0.8rem;
  color: ${({ theme }) => theme.white};
`

const [useConfirmations, confirmations$] = bind(
  rfqResponse$.pipe(
    withLatestFrom(creditInstruments$),
    filter(([response]) => response !== null),
    map(([response, creditInstruments]) => ({
      ...response,
      request: {
        ...response!.request,
        instrument:
          creditInstruments.find(
            (instrument) => instrument.id === response!.request.instrumentId,
          ) ?? null,
      },
    })),
    switchMap((response) =>
      concat(of(response), timer(5_000).pipe(mapTo(null))),
    ),
  ),
  null,
)

export const CreditRfqConfirmation = () => {
  const confirmation = useConfirmations()

  if (!confirmation) {
    return null
  }

  const { direction, dealerIds, quantity, instrument } = confirmation.request

  return confirmation ? (
    <ConfirmationPill direction={direction}>
      You have sent an RFQ to {dealerIds.length} dealers to {direction}{" "}
      {quantity} {instrument?.name}
    </ConfirmationPill>
  ) : null
}
