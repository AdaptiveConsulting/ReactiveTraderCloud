import { QuoteBody, RfqState } from "@/generated/TradingGateway"
import {
  customNumberFormatter,
  DECIMAL_SEPARATOR,
  DECIMAL_SEPARATOR_REGEXP,
  THOUSANDS_SEPARATOR_REGEXP,
} from "@/utils"
import { bind } from "@react-rxjs/core"
import { createSignal } from "@react-rxjs/utils"
import { FC } from "react"
import { filter, map } from "rxjs/operators"
import styled from "styled-components"

const ParametersWrapper = styled.div`
  flex: 1;
  padding: 16px;
  overflow-y: auto;
  font-size: 12px;
  font-weight: 500;
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-auto-rows: minmax(min-content, max-content);
  grid-column-gap: 8px;
  grid-row-gap: 16px;
`

const ParameterLabel = styled.div`
  color: ${({ theme }) => theme.colors.light.secondary[5]};
  margin-bottom: 4px;
`

const ParameterValue = styled.div`
  display: flex;
  align-items: center;
  height: 24px;
  color: ${({ theme }) => theme.colors.light.secondary[1]};
`

export const ParameterInput = styled.input`
  outline: none;
  height: 24px;
  width: 100%;
  padding: 4px;
  color: ${({ theme }) => theme.colors.light.secondary[1]};
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

const formatter = customNumberFormatter()
const filterRegExp = new RegExp(THOUSANDS_SEPARATOR_REGEXP, "g")
const decimalRegExp = new RegExp(DECIMAL_SEPARATOR_REGEXP, "g")

const [rawPrice$, setPrice] = createSignal<string>()
export const [usePrice, price$] = bind(
  rawPrice$.pipe(
    map((rawVal) => {
      const lastChar = rawVal.slice(-1).toLowerCase()
      const value = Math.abs(
        Number(rawVal.replace(filterRegExp, "").replace(decimalRegExp, ".")),
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
  { value: 0, inputValue: "" },
)

interface CreditSellSideParametersProps {
  quote: QuoteBody | undefined
  state: RfqState
  quantity: number
}

export const CreditSellSideParameters: FC<CreditSellSideParametersProps> = ({
  quote,
  state,
  quantity,
}) => {
  const price = usePrice()

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
          <ParameterValue>{quote.price}</ParameterValue>
        ) : (
          <ParameterInput
            type="text"
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
