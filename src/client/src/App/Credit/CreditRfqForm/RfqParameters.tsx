import {
  customNumberFormatter,
  DECIMAL_SEPARATOR,
  DECIMAL_SEPARATOR_REGEXP,
  THOUSANDS_SEPARATOR_REGEXP,
} from "@/utils/formatNumber"
import { bind } from "@react-rxjs/core"
import { createSignal } from "@react-rxjs/utils"
import { FC } from "react"
import { filter, map } from "rxjs/operators"
import styled from "styled-components"

const RfqParametersWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-column-gap: 8px;
  grid-row-gap: 16px;

  font-size: 12px;
  font-weight: 500;
`

const ParameterLabel = styled.div`
  color: #93959b;
  margin-bottom: 4px;
`

export const ParameterInput = styled.input`
  background-color: ${({ theme }) => theme.core.darkBackground};
  outline: none;
  height: 24px;
  width: 100%;
  padding: 4px;
  color: ${({ theme }) => theme.core.textColor};
  border: 1px solid ${({ theme }) => theme.primary[2]};
  border-radius: 3px;
  &:focus {
    outline: none !important;
    border-color: ${({ theme }) => theme.accents.primary.base};
  }
  &:disabled {
    opacity: 0.3;
  }
  &.is-invalid {
    border-color: ${({ theme }) => theme.accents.negative.base};
  }
`

const ParameterValue = styled.div`
  display: flex;
  align-items: center;
  height: 24px;
`

const formatter = customNumberFormatter()
const filterRegExp = new RegExp(THOUSANDS_SEPARATOR_REGEXP, "g")
const decimalRegExp = new RegExp(DECIMAL_SEPARATOR_REGEXP, "g")

const [rawQuantity$, setQuantity] = createSignal<string>()
const [useQuantity, quantity$] = bind(
  rawQuantity$.pipe(
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

export { setQuantity, useQuantity, quantity$ }

export const RfqParameters: FC = () => {
  const quantity = useQuantity()

  return (
    <RfqParametersWrapper>
      <div>
        <ParameterLabel>Quantity (000)</ParameterLabel>
        <ParameterInput
          type="text"
          value={quantity.inputValue}
          onChange={(event) => setQuantity(event.currentTarget.value)}
          onFocus={(event) => {
            event.target.select()
          }}
        />
      </div>
      <div>
        <ParameterLabel>RFQ Duration</ParameterLabel>
        <ParameterValue>2 Minutes</ParameterValue>
      </div>
      <div>
        <ParameterLabel>Fill Type</ParameterLabel>
        <ParameterValue>All or None</ParameterValue>
      </div>
    </RfqParametersWrapper>
  )
}
