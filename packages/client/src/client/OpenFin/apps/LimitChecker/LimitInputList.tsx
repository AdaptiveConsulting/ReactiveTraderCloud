import styled from "styled-components"

import { useCurrencyPairs } from "@/services/currencyPairs"

import { LimitInput } from "./LimitInput"
import { Header } from "./styled"

const Container = styled.div`
  background-color: ${({ theme }) =>
    theme.newTheme.color["Colors/Background/bg-primary"]};
  h2 {
    font-size: 14px;
    font-weight: 400;
    color: white;
  }
  display: flex;
  flex-direction: column;
`

const Scroll = styled.div`
  padding-left: 10px;
  overflow: auto;
`

export const LimitInputs = () => {
  const currencyPairs = useCurrencyPairs()

  return (
    <Container>
      <Header className="header">Currency Pair Trade Limits</Header>
      <Scroll>
        {Object.values(currencyPairs).map((currencyPair) => (
          <LimitInput currencyPair={currencyPair} key={currencyPair.symbol} />
        ))}
      </Scroll>
    </Container>
  )
}
