import { createSignal } from "@react-rxjs/utils"
import { FaCheckCircle, FaThumbsDown } from "react-icons/fa"
import { exhaustMap, filter, map, withLatestFrom } from "rxjs/operators"

import {
  customNumberFormatter,
  invertDirection,
  useClickElementOnEnter,
} from "@/client/utils"
import {
  ACCEPTED_QUOTE_STATE,
  Direction,
  PASSED_QUOTE_STATE,
  PENDING_WITHOUT_PRICE_QUOTE_STATE,
  QuoteBody,
  RfqState,
} from "@/generated/TradingGateway"
import {
  passCreditQuote$,
  quoteCreditQuote$,
  useCreditRfqDetails,
} from "@/services/credit"

import { CreditRfqTimer, isRfqTerminated } from "../../common"
import { price$, usePrice } from "../sellSideState"
import { useIsFocused } from "../utils/useIsFocused"
import {
  Accepted,
  FooterWrapper,
  Missed,
  PassButton,
  SendQuoteButton,
  Terminated,
  TimerWrapper,
  TradeDetails,
} from "./SellSideTradeTicketFooter.styles"

const [sendQuoteId$, sendQuote] = createSignal<number>()

sendQuoteId$
  .pipe(
    withLatestFrom(price$),
    filter(([, price]) => price.value > 0),
    map(([quoteId, price]) => ({
      quoteId,
      price: price.value,
    })),
    exhaustMap((quoteRequest) => quoteCreditQuote$(quoteRequest)),
  )
  .subscribe()

const [passQuoteId$, passQuote] = createSignal<number>()

passQuoteId$
  .pipe(exhaustMap((quoteId) => passCreditQuote$({ quoteId })))
  .subscribe()

const formatter = customNumberFormatter()

interface SellSideTradeTicketTicketFooterProps {
  rfqId: number
  quote: QuoteBody | undefined
}

export const SellSideTradeTicketFooter = ({
  rfqId,
  quote,
}: SellSideTradeTicketTicketFooterProps) => {
  const rfq = useCreditRfqDetails(rfqId)
  const price = usePrice()
  const isPriceFieldFocused = useIsFocused()

  const clickElementRef =
    useClickElementOnEnter<HTMLButtonElement>(isPriceFieldFocused)

  if (!rfq) {
    return <FooterWrapper accepted={false} missed={false} />
  }

  const {
    state,
    direction: clientDirection,
    quantity,
    instrument,
    creationTimestamp,
    expirySecs,
  } = rfq

  const direction = invertDirection(clientDirection)

  const disablePass = quote?.state.type !== PENDING_WITHOUT_PRICE_QUOTE_STATE
  const disableSend =
    price.value <= 0 ||
    state !== RfqState.Open ||
    quote?.state.type !== PENDING_WITHOUT_PRICE_QUOTE_STATE

  const passed = quote?.state.type === PASSED_QUOTE_STATE
  const accepted =
    state === RfqState.Closed && quote?.state.type === ACCEPTED_QUOTE_STATE
  const missed =
    state === RfqState.Closed &&
    quote?.state.type !== ACCEPTED_QUOTE_STATE &&
    !passed

  return (
    <FooterWrapper accepted={accepted} missed={missed}>
      {state === RfqState.Open && !passed && (
        <>
          <PassButton
            disabled={disablePass}
            onClick={() => quote && passQuote(quote.id)}
          >
            Pass
          </PassButton>
          <TimerWrapper>
            {state !== RfqState.Open ? null : (
              <CreditRfqTimer
                start={Number(creationTimestamp)}
                end={Number(creationTimestamp) + expirySecs * 1000}
                isSellSideView={true}
              />
            )}
          </TimerWrapper>
          <SendQuoteButton
            ref={clickElementRef}
            direction={direction}
            onClick={() => quote && sendQuote(quote.id)}
            disabled={disableSend}
          >
            Send Quote
          </SendQuoteButton>
        </>
      )}
      {(isRfqTerminated(state) || passed) && (
        <Terminated>
          Request{" "}
          {passed
            ? "Passed"
            : state === RfqState.Cancelled
            ? "Canceled"
            : "Expired"}
        </Terminated>
      )}
      {accepted && (
        <Accepted>
          <FaCheckCircle size={11} />
          <div>
            <div>Trade Successful</div>
            <TradeDetails>
              You {direction === Direction.Buy ? "Bought" : "Sold"}{" "}
              {formatter(quantity)} {instrument?.name ?? "Unknown Instrument"} @
              {quote.state?.type === ACCEPTED_QUOTE_STATE
                ? `$${quote.state.payload}`
                : null}
              `
            </TradeDetails>
          </div>
        </Accepted>
      )}
      {missed && (
        <Missed>
          <FaThumbsDown size={11} />
          Traded Away
        </Missed>
      )}
    </FooterWrapper>
  )
}
