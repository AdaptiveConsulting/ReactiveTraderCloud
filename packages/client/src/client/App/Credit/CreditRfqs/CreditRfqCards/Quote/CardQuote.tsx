import { createSignal } from "@react-rxjs/utils"
import { exhaustMap } from "rxjs/operators"

import { CheckCircle } from "@/client/components/icons/CheckCircle"
import { Typography } from "@/client/components/Typography"
import { Color } from "@/client/theme/types"
import {
  ACCEPTED_QUOTE_STATE,
  DealerBody,
  Direction,
  PASSED_QUOTE_STATE,
  PENDING_WITH_PRICE_QUOTE_STATE,
  QuoteBody,
  RfqState,
} from "@/generated/TradingGateway"
import { acceptCreditQuote$, useQuoteState } from "@/services/credit"

import { hasPrice, isBuy } from "../../../common"
import {
  AcceptButton,
  Price,
  QuoteDot,
  QuoteDotWrapper,
  QuoteRow,
} from "./styled"

const [acceptRfq$, onAcceptRfq] = createSignal<number>()

acceptRfq$
  .pipe(exhaustMap((quoteId) => acceptCreditQuote$({ quoteId })))
  .subscribe()

interface QuoteProps {
  dealer: DealerBody
  quote: QuoteBody
  rfqState: RfqState
  rfqId: number
  direction: Direction
  highlight: boolean
}

export const Quote = ({
  dealer,
  quote,
  rfqState,
  rfqId,
  direction,
  highlight,
}: QuoteProps) => {
  const state = useQuoteState(dealer.id, rfqId)

  const rfqOpen = rfqState === RfqState.Open
  const priced = hasPrice(quote.state)
  const acceptable = state.type === PENDING_WITH_PRICE_QUOTE_STATE && rfqOpen
  const accepted = state.type === ACCEPTED_QUOTE_STATE
  const passed = quote.state.type === PASSED_QUOTE_STATE

  const getDealerColor = (
    open: boolean,
    accepted: boolean,
    priced: boolean,
    highlight: boolean,
  ): Color => {
    if (accepted) {
      return "Colors/Text/text-success-primary (600)"
    } else if (open) {
      if (priced) {
        return highlight
          ? "Colors/Text/text-black"
          : "Colors/Text/text-primary (900)"
      }
      return "Colors/Text/text-quaternary (500)"
    } else {
      return "Colors/Text/text-disabled"
    }
  }

  const getPriceColor = (
    open: boolean,
    accepted: boolean,
    priced: boolean,
    highlight: boolean,
    direction: Direction,
  ): Color => {
    if (accepted) {
      return "Colors/Text/text-success-primary (600)"
    } else if (open) {
      if (priced) {
        return highlight
          ? "Colors/Text/text-primary_alt"
          : isBuy(direction)
            ? "Colors/Text/text-buy-primary"
            : "Colors/Text/text-sell-primary"
      }
      return "Colors/Text/text-quaternary (500)"
    } else {
      return "Colors/Text/text-disabled"
    }
  }

  return (
    <QuoteRow
      quoteActive={acceptable}
      highlight={highlight}
      direction={direction}
    >
      {(acceptable || state.type === PASSED_QUOTE_STATE) && rfqOpen && (
        <QuoteDotWrapper>
          <QuoteDot
            highlight={highlight}
            direction={direction}
            passed={state.type === PASSED_QUOTE_STATE}
          />
        </QuoteDotWrapper>
      )}
      <Typography
        variant="Text xs/Regular"
        color={getDealerColor(rfqOpen, accepted, priced, highlight)}
      >
        {dealer?.name ?? "Dealer name not found"}
      </Typography>

      <Price open={rfqOpen} accepted={accepted} passed={passed} priced={priced}>
        {accepted && <CheckCircle />}
        <Typography
          variant={accepted ? "Text xs/Medium" : "Text xs/Regular"}
          color={getPriceColor(rfqOpen, accepted, priced, highlight, direction)}
        >
          {state.payload}
        </Typography>
      </Price>

      <AcceptButton
        variant="brand"
        size="xxs"
        onClick={() => onAcceptRfq(quote.id)}
      >
        Accept
      </AcceptButton>
    </QuoteRow>
  )
}
