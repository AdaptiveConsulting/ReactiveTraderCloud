import { useEffect } from "react"
import styled from "styled-components"

import Input from "@/styleguide/components/Input"

import { setLimit, useLimitResult, useLimits } from "./state"

const Container = styled.div`
  display: flex;
  flex-direction: column;
  background-color: ${({ theme }) => theme.core.darkBackground};
  padding: 20px 10px 10px 10px;
`

const HeaderRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`

const Dot = styled.div<{ result?: boolean }>`
  width: 7px;
  height: 7px;
  border-radius: 50%;
  margin-right: 10px;
  background-color: ${({ theme }) => theme.accents.primary.lighter};
  
    ${({ result }) =>
      result !== undefined &&
      `animation: resultColorFade${result ? "Success" : "Failure"} 2s;`}

  
  @keyframes resultColorFadeSuccess {
    0% {
      background-color: ${({ theme }) => theme.accents.positive.base};
    }
    100% {
      background-color: ${({ theme }) => theme.accents.primary.lighter};
    }
  }
  
  @keyframes resultColorFadeFailure {
    0% {
      background-color: ${({ theme }) => theme.accents.negative.base};
    }
    100% {
      background-color: ${({ theme }) => theme.accents.primary.lighter};
    }
`

export const LimitSetter = ({ currencyPair }: { currencyPair: string }) => {
  const limit = useLimits()[currencyPair]

  const result = useLimitResult()

  const handleLimitChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLimit({ [currencyPair]: Number(e.target.value) })
  }

  return (
    <Container>
      <HeaderRow>
        <Dot
          result={
            result !== null &&
            result.request.tradedCurrencyPair === currencyPair
              ? result.result
              : undefined
          }
        />
        <h2>{currencyPair.slice(0, 3) + "/" + currencyPair.slice(3)}</h2>
      </HeaderRow>
      <Input
        label={""}
        type="number"
        value={limit ? String(limit) : "0"}
        onChange={handleLimitChange}
        className="limit-setter"
      />
    </Container>
  )
}
