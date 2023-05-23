import { useEffect } from "react"
import styled from "styled-components"

import Input from "@/styleguide/components/Input"

import { setLimit, useLimitResult, useLimits } from "./state"

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${({ theme }) => theme.core.darkBackground};
  padding: 10px 10px 10px 10px;
`

export const LimitInput = ({ currencyPair }: { currencyPair: string }) => {
  const limit = useLimits()[currencyPair]

  const result = useLimitResult()

  const handleLimitChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLimit({ [currencyPair]: Number(e.target.value) })
  }

  return (
    <Container>
      <h2>{currencyPair.slice(0, 3) + "/" + currencyPair.slice(3)}</h2>
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
