import { createSignal } from "@react-rxjs/utils"
import { exhaustMap, filter, map, withLatestFrom } from "rxjs/operators"

import { Button } from "@/client/components/Button"
import { CheckCircleIcon, CrossCircleIcon } from "@/client/components/icons"
import { Stack } from "@/client/components/Stack"
import { Typography } from "@/client/components/Typography"
import {
  customNumberFormatter,
  invertDirection,
  useClickElementOnEnter,
} from "@/client/utils"
import {
  ACCEPTED_QUOTE_STATE,
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

import { CreditRfqTimer, isBuy, isRfqTerminated } from "../../common"
import { price$, usePrice } from "../sellSideState"
import { useIsFocused } from "../utils/useIsFocused"
import { FooterWrapper, TimerWrapper } from "./SellSideTradeTicketFooter.styles"

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
    return <FooterWrapper accepted={false} missed={false} ended={false} />
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

  const ended = isRfqTerminated(state) || passed

  return (
    <FooterWrapper
      accepted={accepted}
      missed={missed}
      ended={ended}
      alignItems="center"
      padding="md"
      marginX="xs"
      marginBottom="xs"
    >
      {state === RfqState.Open && !passed && (
        <>
          <Button
            variant="primary"
            size="sm"
            disabled={disablePass}
            onClick={() => quote && passQuote(quote.id)}
          >
            Pass
          </Button>
          <TimerWrapper>
            {state !== RfqState.Open ? null : (
              <CreditRfqTimer
                start={Number(creationTimestamp)}
                end={Number(creationTimestamp) + expirySecs * 1000}
                isSellSideView={true}
              />
            )}
          </TimerWrapper>
          <Button
            variant="brand"
            size="sm"
            ref={clickElementRef}
            onClick={() => quote && sendQuote(quote.id)}
            disabled={disableSend}
          >
            Send Quote
          </Button>
        </>
      )}
      {ended && (
        <Stack alignItems="center" gap="sm">
          <Typography variant="Text sm/Regular">
            Request{" "}
            {passed
              ? "Passed"
              : state === RfqState.Cancelled
                ? "Cancelled"
                : "Expired"}
          </Typography>
        </Stack>
      )}
      {accepted && (
        <Stack alignItems="center" gap="sm">
          <CheckCircleIcon />
          <div>
            <Typography variant="Text lg/Medium">Trade Successful</Typography>
            <Typography variant="Text sm/Regular">
              You {isBuy(direction) ? "Bought" : "Sold"} {formatter(quantity)}{" "}
              {instrument?.name ?? "Unknown Instrument"} @
              {quote.state?.type === ACCEPTED_QUOTE_STATE
                ? ` ${quote.state.payload}`
                : null}
            </Typography>
          </div>
        </Stack>
      )}
      {missed && (
        <Stack alignItems="center" gap="sm">
          <CrossCircleIcon />
          <Typography variant="Text lg/Medium">Traded Away</Typography>
        </Stack>
      )}
    </FooterWrapper>
  )
}
