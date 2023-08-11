import { createSignal } from "@react-rxjs/utils"
import { ThemeName } from "client/theme"
import {
  customNumberFormatter,
  invertDirection,
  useClickElementOnEnter,
} from "client/utils"
import {
  ACCEPTED_QUOTE_STATE,
  Direction,
  PASSED_QUOTE_STATE,
  PENDING_WITHOUT_PRICE_QUOTE_STATE,
  QuoteBody,
  QuoteState,
  RfqState,
} from "generated/TradingGateway"
import { FaCheckCircle, FaThumbsDown } from "react-icons/fa"
import { exhaustMap, filter, map, withLatestFrom } from "rxjs/operators"
import {
  passCreditQuote$,
  quoteCreditQuote$,
  useCreditRfqDetails,
} from "services/credit"
import styled from "styled-components"

import { CreditRfqTimer, isRfqTerminated } from "../../common"
import { useIsFocused } from "../utils/useIsFocused"
import { price$, usePrice } from "./SellSideTradeTicketParameters"

const FooterWrapper = styled.div<{ accepted: boolean; missed: boolean }>`
  display: flex;
  align-items: center;
  height: 50px;
  padding: 8px;
  border-top: 1px solid ${({ theme }) => theme.primary[3]};
  background-color: ${({ accepted, missed }) =>
    accepted
      ? "rgba(1, 195, 141, 0.1)"
      : missed
      ? "rgba(167, 39, 64, 0.15)"
      : undefined};
`

export const TimerWrapper = styled.div`
  display: flex;
  align-items: center;
  flex: 1;
  padding: 0 8px;
`

const FooterButton = styled.button`
  padding: 4px 8px;
  border-radius: 3px;
  height: 24px;
  font-size: 11px;
  &:focus {
    border-radius: 3px;
    border: 1px solid #4c76c4 !important;
  }
`

const PassButton = styled(FooterButton)<{ disabled: boolean }>`
  color: ${({ theme }) =>
    theme.secondary[theme.name === ThemeName.Dark ? "base" : 3]};
  background-color: ${({ theme }) =>
    theme.primary[theme.name === ThemeName.Dark ? 2 : 3]};
  ${({ disabled }) => (disabled ? "opacity: 0.3" : "")}
`

const SendQuoteButton = styled(FooterButton)<{
  direction: Direction
  disabled: boolean
}>`
  color: ${({ theme }) => theme.white};
  background-color: ${({ theme, direction }) =>
    theme.colors.spectrum.uniqueCollections[direction].darker};
  ${({ disabled }) => (disabled ? "opacity: 0.3" : "")}
`

const TradeStatus = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  font-size: 11px;
  font-weight: 700;
  svg {
    margin-right: 8px;
  }
`
const Terminated = styled(TradeStatus)`
  justify-content: center;
  color: ${({ theme }) => theme.primary[5]};
`
const Accepted = styled(TradeStatus)`
  color: ${({ theme }) => theme.accents.positive.base};
`
const Missed = styled(TradeStatus)`
  color: ${({ theme }) =>
    theme.accents.negative[
      theme.name === ThemeName.Light ? "darker" : "medium"
    ]};
`
const TradeDetails = styled.div`
  font-size: 9px;
  font-weight: 500px;
`

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

  console.log(quote)

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
    !passed &&
    state === RfqState.Closed &&
    quote?.state.type !== ACCEPTED_QUOTE_STATE

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
                ? `$${quote?.state?.payload}`
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
