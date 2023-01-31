import {
  createApplyCharacterMultiplier,
  customNumberFormatter,
  parseQuantity,
} from "@/utils/formatNumber"
import { bind } from "@react-rxjs/core"
import { createSignal } from "@react-rxjs/utils"
import { map } from "rxjs/operators"
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

const [rawQuantity$, setQuantity] = createSignal<string>()

const applyCharacterMultiplier = createApplyCharacterMultiplier(["k", "m"])

const [useQuantity, quantity$] = bind(
  rawQuantity$.pipe(
    map((rawVal: string): number => {
      const numValue = Math.trunc(Math.abs(parseQuantity(rawVal)))
      const lastChar = rawVal.slice(-1).toLowerCase()
      const value = applyCharacterMultiplier(numValue, lastChar)
      return !Number.isNaN(value) ? value : 0
    }),
  ),
  0,
)

export { setQuantity, useQuantity, quantity$ }

export const RfqParameters = () => {
  const quantity = useQuantity()

  return (
    <RfqParametersWrapper>
      <div>
        <ParameterLabel>Quantity (000)</ParameterLabel>
        <ParameterInput
          type="text"
          value={quantity === 0 ? "" : formatter(quantity)}
          onChange={(event) => setQuantity(event.currentTarget.value)}
          onFocus={(event) => {
            event.target.select()
          }}
          data-testid="quantity"
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
