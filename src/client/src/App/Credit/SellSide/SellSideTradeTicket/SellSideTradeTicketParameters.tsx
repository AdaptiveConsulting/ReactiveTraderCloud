import { bind } from "@react-rxjs/core"
import { createSignal } from "@react-rxjs/utils"
import { useEffect, useRef } from "react"
import { merge } from "rxjs"
import { filter, map } from "rxjs/operators"
import styled from "styled-components"

import { QuoteBody, RfqState } from "@/generated/TradingGateway"
import { ThemeName } from "@/theme"
import {
  DECIMAL_SEPARATOR,
  DECIMAL_SEPARATOR_REGEXP,
  THOUSANDS_SEPARATOR_REGEXP,
  truncatedDecimalNumberFormatter,
} from "@/utils"

import {
  getSellSideQuoteState,
  selectedRfqId$,
  SellSideQuoteState,
} from "../sellSideState"

const ParametersWrapper = styled.div`
  padding: 8px;
  overflow-y: auto;
  font-size: 12px;
  font-weight: 500;
  display: flex;
  justify-content: space-between;
  align-items: center;
`
const ParameterLabel = styled.div`
  color: ${({ theme }) => theme.secondary[5]};
  margin-bottom: 4px;
`

const ParameterValue = styled.div`
  display: flex;
  align-items: center;
  height: 24px;
  color: ${({ theme }) =>
    theme.secondary[theme.name === ThemeName.Dark ? "base" : 1]};
`

const PendingPrice = styled.span`
  margin-right: 6px;
  color: ${({ theme }) => theme.accents.primary.base};
`

export const ParameterInput = styled.input`
  outline: none;
  height: 24px;
  width: 100%;
  padding: 4px;
  color: ${({ theme }) =>
    theme.secondary[theme.name === ThemeName.Dark ? "base" : 1]};
  background-color: ${({ theme }) => theme.core.darkBackground};
  border: 1px solid ${({ theme }) => theme.colors.light.primary[3]};
  border-radius: 3px;
  &:focus {
    outline: none !important;
    border-color: ${({ theme }) => theme.accents.primary.darker};
  }
  &:disabled {
    opacity: 0.3;
  }
  &.is-invalid {
    border-color: ${({ theme }) => theme.accents.negative.base};
  }
`

const formatter = truncatedDecimalNumberFormatter(4)

const filterRegExp = new RegExp(THOUSANDS_SEPARATOR_REGEXP, "g")
const decimalRegExp = new RegExp(DECIMAL_SEPARATOR_REGEXP, "g")

const [rawPrice$, setPrice] = createSignal<string>()
export const [usePrice, price$] = bind(
  merge(
    selectedRfqId$.pipe(map(() => ({ value: 0, inputValue: "" }))),
    rawPrice$.pipe(
      map((rawVal) => {
        const lastChar = rawVal.slice(-1).toLowerCase()
        const cleanedInput = rawVal
          .replace(filterRegExp, "")
          .replace(decimalRegExp, ".")

        const inputQuantityAsNumber = Math.abs(Number(cleanedInput))

        // numeric value could be NaN at this stage

        const truncated = formatter(inputQuantityAsNumber)

        const value = Number(
          truncated.replace(filterRegExp, "").replace(decimalRegExp, "."),
        )

        return {
          value,
          inputValue:
            value === 0
              ? ""
              : formatter(value) +
                (lastChar === DECIMAL_SEPARATOR ? DECIMAL_SEPARATOR : ""),
        }
      }),
      filter(({ value }) => !Number.isNaN(value)),
    ),
  ),
  { value: 0, inputValue: "" },
)

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
        {quote ? (
          getSellSideQuoteState(state, quote.state) ===
          SellSideQuoteState.Pending ? (
            <ParameterValue>
              <PendingPrice>{quote.price}</PendingPrice>
              <em>Awaiting Response</em>
            </ParameterValue>
          ) : (
            <ParameterValue>{quote.price}</ParameterValue>
          )
        ) : (
          <ParameterInput
            type="text"
            ref={ref}
            value={price.inputValue}
            disabled={state !== RfqState.Open}
            onChange={(event) => setPrice(event.currentTarget.value)}
            onFocus={(event) => {
              event.target.select()
            }}
          />
        )}
      </div>
    </ParametersWrapper>
  )
}
