import { Direction } from "@/generated/TradingGateway"
import {
  creditInstruments$,
  createdCreditRfq$,
  acceptedCreditRfq$,
  creditQuotes$,
  creditRfqsById$,
} from "@/services/credit"
import { customNumberFormatter } from "@/utils"
import { bind } from "@react-rxjs/core"
import { createSignal } from "@react-rxjs/utils"
import { FaCheckCircle, FaTimes } from "react-icons/fa"
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
  & > svg {
    margin-right: 5px;
  }
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

const [useRfqCreatedConfirmation] = bind(
  createdCreditRfq$.pipe(
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

const formatter = customNumberFormatter()

export const CreditRfqCreatedConfirmation = () => {
  const confirmation = useRfqCreatedConfirmation()

  if (!confirmation) {
    return null
  }

  const { direction, dealerIds, quantity, instrument } = confirmation.request

  return confirmation ? (
    <ConfirmationPill direction={direction}>
      You have sent an {direction} RFQ for {formatter(quantity)}{" "}
      {instrument?.name} to {dealerIds.length} dealers
      <IconWrapper direction={direction} onClick={onDismissMessage}>
        <FaTimes />
      </IconWrapper>
    </ConfirmationPill>
  ) : null
}

const [useRfqAcceptedConfirmation] = bind(
  acceptedCreditRfq$.pipe(
    withLatestFrom(creditQuotes$, creditRfqsById$),
    map(([response, quotes, rfqsById]) => {
      const quote = quotes.find((quote) => quote.id === response.quoteId)
      const rfq = quote && rfqsById[quote.rfqId]
      return {
        ...response,
        quote,
        rfq,
        dealer: rfq?.dealers.find((dealer) => dealer.id === quote?.dealerId),
        instrument: rfq?.instrument,
      }
    }),
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

export const CreditRfqAcceptedConfirmation = () => {
  const confirmation = useRfqAcceptedConfirmation()

  if (!confirmation) {
    return null
  }

  const { rfq, quote, dealer, instrument } = confirmation

  if (!rfq || !quote || !dealer || !instrument) {
    return null
  }

  return confirmation ? (
    <ConfirmationPill direction={rfq.direction}>
      <FaCheckCircle size={16} />
      You have accepted a quote for {formatter(rfq.quantity)} {instrument.name}{" "}
      @ ${quote.price} from {dealer.name}
      <IconWrapper direction={rfq.direction} onClick={onDismissMessage}>
        <FaTimes />
      </IconWrapper>
    </ConfirmationPill>
  ) : null
}
