import { bind } from "@react-rxjs/core"
import { createSignal } from "@react-rxjs/utils"
import { map } from "rxjs/operators"
import styled from "styled-components"

import { FormControl } from "@/client/components/FormControl/FormControl"
import { TextInput } from "@/client/components/FormControl/TextInput"
import {
  createApplyCharacterMultiplier,
  customNumberFormatter,
  parseQuantity,
} from "@/client/utils/formatNumber"

const RfqParametersWrapper = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.newTheme.spacing.xl};
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

export { quantity$, setQuantity, useQuantity }

export const RfqParameters = () => {
  const quantity = useQuantity()

  return (
    <RfqParametersWrapper>
      <FormControl label="Quantity (000)">
        <TextInput placeholder="1000" />
      </FormControl>
      <FormControl label="RFQ Duration">
        <TextInput placeholder="2 Minutes" disabled />
      </FormControl>
    </RfqParametersWrapper>
  )
}
