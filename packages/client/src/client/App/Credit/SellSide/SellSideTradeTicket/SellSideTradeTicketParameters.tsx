import { PropsWithChildren, useEffect, useRef } from "react"

import { TextInput } from "@/client/components/Form/TextInput"
import { Gap } from "@/client/components/Gap"
import { Typography } from "@/client/components/Typography"
import { truncatedDecimalNumberFormatter } from "@/client/utils"
import {
  PendingWithPriceQuoteState,
  QuoteBody,
  RfqState,
} from "@/generated/TradingGateway"

import { hasPrice } from "../../common"
import {
  getSellSideQuoteState,
  SellSideQuoteState,
  setPrice,
  usePrice,
} from "../sellSideState"
import { setFocused } from "../utils/useIsFocused"
import { ParametersWrapper } from "./SellSideTradeTicketParameters.styles"

const formatter = truncatedDecimalNumberFormatter(4)

interface SellSideTradeTicketParametersProps {
  selectedRfqId: number
  quote: QuoteBody | undefined
  state: RfqState
  quantity: number
}

interface ParameterProps {
  label: string
  value?: string
}

const Parameter = ({
  label,
  value,
  children,
}: PropsWithChildren<ParameterProps>) => (
  <div>
    <Typography
      variant="Text sm/Medium"
      color="Colors/Text/text-secondary (700)"
    >
      {label}
    </Typography>
    <Gap height="sm" />
    {value && <Typography variant="Text xs/Regular">{value}</Typography>}
    {children}
  </div>
)

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
      <Parameter label="Quantity (000)" value={formatter(quantity / 1000)} />
      <Parameter label="Fill Type" value="All or None" />
      <Parameter label="Price">
        {sellSideQuoteState === SellSideQuoteState.New ? (
          <TextInput
            data-testid="price-input"
            ref={ref}
            onChange={(value) => setPrice(value)}
            value={price.inputValue}
            disabled={state !== RfqState.Open}
            onFocus={(event) => {
              event.target.select()
              setFocused(true)
            }}
            onBlur={() => setFocused(false)}
          />
        ) : sellSideQuoteState === SellSideQuoteState.Pending ? (
          <>
            <Typography
              variant="Text xs/Regular"
              color="Colors/Text/text-brand-primary (900)"
            >
              {(quote?.state as PendingWithPriceQuoteState)?.payload}
            </Typography>
            <Typography variant="Text xs/Regular italic">
              Awaiting Response
            </Typography>
          </>
        ) : (
          <Typography variant="Text xs/Regular">
            {hasPrice(quote?.state) && quote?.state.payload}
          </Typography>
        )}
      </Parameter>
    </ParametersWrapper>
  )
}
