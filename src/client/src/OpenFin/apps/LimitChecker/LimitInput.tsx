import styled from "styled-components"

import { CurrencyPair } from "@/services/currencyPairs/types"
import Input from "@/styleguide/components/Input"

import { setLimit, useLimit } from "./state"

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${({ theme }) => theme.core.darkBackground};
  padding: 10px 10px 10px 10px;
`

export const LimitInput = ({
  currencyPair,
}: {
  currencyPair: CurrencyPair
}) => {
  const limit = useLimit(currencyPair.symbol)

  const handleLimitChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLimit({ [currencyPair.symbol]: Number(e.target.value) })
  }

  return (
    <Container>
      <Input
        label={currencyPair.base + "/" + currencyPair.terms}
        type="number"
        disabled={false}
        value={limit ? String(limit) : "0"}
        onChange={handleLimitChange}
      />
    </Container>
  )
}
