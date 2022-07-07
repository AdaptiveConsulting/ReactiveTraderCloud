import { Direction } from "@/generated/TradingGateway"
import { creditInstruments$, creditRfqCreations$ } from "@/services/credit"
import { bind } from "@react-rxjs/core"
import { createSignal } from "@react-rxjs/utils"
import { FaTimes } from "react-icons/fa"
import { concat, of, race, timer } from "rxjs"
import {
  filter,
  map,
  mapTo,
  switchMap,
  take,
  withLatestFrom,
} from "rxjs/operators"
import styled from "styled-components"

const ConfirmationPill = styled.div<{ direction: Direction }>`
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  background-color: ${({ theme, direction }) =>
    theme.colors.spectrum.uniqueCollections[direction].base};
  display: flex;
  align-items: center;
  padding: 0.5rem 1rem;
  border-radius: 2rem;
  font-size: 0.8rem;
  color: ${({ theme }) => theme.white};
`

const IconWrapper = styled.div<{ direction: Direction }>`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-left: 5px;
  width: 1.5em;
  height: 1.5em;
  border-radius: 1.5em;
  &:hover {
    cursor: pointer;
    background-color: ${({ theme, direction }) =>
      theme.colors.spectrum.uniqueCollections[direction].lighter};
  }
`

// Dismiss Message
const DISMISS_TIMEOUT = 5_000
const [dismiss$, onDismissMessage] = createSignal()
export { onDismissMessage }

const [useConfirmations] = bind(
  creditRfqCreations$.pipe(
    filter((response) => response !== null),
    withLatestFrom(creditInstruments$),
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
      concat(
        of(response),
        race([dismiss$.pipe(take(1)), timer(DISMISS_TIMEOUT)]).pipe(
          mapTo(null),
        ),
      ),
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
      <IconWrapper direction={direction} onClick={onDismissMessage}>
        <FaTimes />
      </IconWrapper>
    </ConfirmationPill>
  ) : null
}
