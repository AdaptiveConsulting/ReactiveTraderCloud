import { useEffect, useRef } from "react"

import { truncatedDecimalNumberFormatter } from "@/client/utils"
import { QuoteBody, RfqState } from "@/generated/TradingGateway"
import { PendingWithPriceQuoteState } from "@/generated/TradingGateway"

import { hasPrice } from "../../common"
import {
  getSellSideQuoteState,
  SellSideQuoteState,
  setPrice,
  usePrice,
} from "../sellSideState"
import { setFocused } from "../utils/useIsFocused"
import {
  ParameterInput,
  ParameterLabel,
  ParametersWrapper,
  ParameterValue,
  PendingPrice,
} from "./SellSideTradeTicketParameters.styles"

const formatter = truncatedDecimalNumberFormatter(4)

interface SellSideTradeTicketParametersProps {
  selectedRfqId: number
  quote: QuoteBody | undefined
  state: RfqState
  quantity: number
}

export const SellSideTradeTicketParameters = ({
  quote,
  selectedRfqId,
  state,
  quantity,
}: SellSideTradeTicketParametersProps) => {
  const price = usePrice()
  const sellSideQuoteState = getSellSideQuoteState(state, quote?.state)

  const ref = useRef<HTMLInputElement>(null)

  useEffect(() => {
    ref.current?.focus()
  }, [selectedRfqId])

  return (
    <ParametersWrapper>
      <div>
        <ParameterLabel>Quantity (000)</ParameterLabel>
        <ParameterValue>{formatter(quantity / 1000)}</ParameterValue>
      </div>
      <div>
        <ParameterLabel>Fill Type</ParameterLabel>
        <ParameterValue>All or None</ParameterValue>
      </div>
      <div>
        <ParameterLabel>Price</ParameterLabel>
        {sellSideQuoteState === SellSideQuoteState.New ? (
          <ParameterInput
            tabIndex={1}
            type="text"
            data-testid="price-input"
            ref={ref}
            value={price.inputValue}
            disabled={state !== RfqState.Open}
            onChange={(event) => setPrice(event.currentTarget.value)}
            onFocus={(event) => {
              event.target.select()
              setFocused(true)
            }}
            onBlur={() => setFocused(false)}
          />
        ) : sellSideQuoteState === SellSideQuoteState.Pending ? (
          <ParameterValue>
            <PendingPrice>
              {(quote?.state as PendingWithPriceQuoteState)?.payload}
            </PendingPrice>
            <em>Awaiting Response</em>
          </ParameterValue>
        ) : (
          <ParameterValue>
            {hasPrice(quote?.state) && quote?.state.payload}
          </ParameterValue>
        )}
      </div>
    </ParametersWrapper>
  )
}
