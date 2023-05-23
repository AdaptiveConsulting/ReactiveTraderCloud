import styled from "styled-components"

import { useCurrencyPairs } from "@/services/currencyPairs"

import { LimitInput } from "./LimitInput"
import { Header } from "./styled"

const Container = styled.div`
  border-bottom: 3px solid ${({ theme }) => theme.core.dividerColor};
  background-color: ${({ theme }) => theme.core.lightBackground};
  h2 {
    font-size: 14px;
    font-weight: 400;
    color: white;
  }
`

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-gap: 3px;
  padding: 10px 10px 10px 10px;
  border-radius: 3px;
`

export const LimitInputs = () => {
  const currencyPairs = useCurrencyPairs()

  return (
    <Container>
      <Header className="header">Currency Pair Trade Limits</Header>
      <Grid>
        {Object.values(currencyPairs).map((currencyPair) => (
          <LimitInput
            currencyPair={currencyPair.symbol}
            key={currencyPair.symbol}
          />
        ))}
      </Grid>
    </Container>
  )
}
