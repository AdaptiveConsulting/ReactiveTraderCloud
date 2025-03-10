import styled from "styled-components"

import { CurrencyPair } from "@/services/currencyPairs/types"

import { onChangeLimitValue, useLimit } from "./state"

const Container = styled.div`
  background-color: ${({ theme }) => theme.newTheme.color["Colors/Background/bg-secondary"]}};
  padding: 10px;
  margin-bottom: 0.25rem;

  &:hover {
    background-color: ${({ theme }) => theme.newTheme.color["Colors/Background/bg-secondary_hover"]};
  }
`

const Symbol = styled.div`
  font-size: 0.8125rem;
  line-height: 1rem;
  margin-bottom: 5px;
`

const Label = styled.label`
  font-size: 0.625rem;
  line-height: 1.2rem;
  opacity: 0.59;
`

const Input = styled.input`
  grid-area: Input;
  background: none;
  text-align: right;
  outline: none;
  border: none;
  font-size: 0.75rem;

  padding: 2px 0;
  color: ${({ theme }) => theme.newTheme.color["Colors/Text/text-primary (900)"]}};
  border-bottom: 1.5px solid ${({ theme }) => theme.newTheme.color["Colors/Border/border-primary"]};
  caret-color: ${({ theme }) => theme.newTheme.color["Colors/Foreground/fg-brand-primary (600)"]};
  &:focus {
    border-color: ${({ theme }) => theme.newTheme.color["Colors/Foreground/fg-brand-primary (600)"]};
  }
`

export const LimitInput = ({
  currencyPair,
}: {
  currencyPair: CurrencyPair
}) => {
  const [, inputValue] = useLimit(currencyPair.symbol)

  const handleLimitChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChangeLimitValue(currencyPair.symbol, e.target.value)
  }

  return (
    <Container>
      <Symbol>{currencyPair.base + "/" + currencyPair.terms}</Symbol>
      <Label>{currencyPair.base}</Label>
      <Input value={inputValue} onChange={handleLimitChange} />
    </Container>
  )
}
