//react component which displays a message

import { useEffect } from "react"
import styled from "styled-components"

import { useCurrencyPairs } from "@/services/currencyPairs"

import { LimitSetter } from "./LimitSetter"
import { checkLimit } from "./state"

const Container = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  margin-top: 15px;
  padding: 0 10px 15px 10px;
  border-bottom: 5px solid ${({ theme }) => theme.core.dividerColor};
  h2 {
    font-size: 14px;
    font-weight: 400;
    color: white;
  }
`

const SettersContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-gap: 3px;
  padding: 10px 10px 10px 10px;
  background-color: ${({ theme }) => theme.core.lightBackground};
  border-radius: 3px;
`

const Header = styled.h1`
  padding: 0 0 15px 15px;
  font-size: 16px;
  font-weight: 400;
  color: white;
`

export interface LimitCheckerRequest {
  id: number
  responseTopic: string
  tradedCurrencyPair: string
  notional: number
  rate: number
}

export const LimitChecker = () => {
  const currencyPairs = useCurrencyPairs()

  useEffect(() => {
    fin.InterApplicationBus.subscribe(
      { uuid: "*" },
      "request-limit-check",
      checkLimit,
    )

    fin.InterApplicationBus.publish("request-limit-check-status", "ALIVE")
  }, [])

  return (
    <Container>
      <Header className="header">Currency Pair Trade Limits</Header>
      <SettersContainer>
        {Object.values(currencyPairs).map((currencyPair) => (
          <LimitSetter
            currencyPair={currencyPair.symbol}
            key={currencyPair.symbol}
          />
        ))}
      </SettersContainer>
    </Container>
  )
}
