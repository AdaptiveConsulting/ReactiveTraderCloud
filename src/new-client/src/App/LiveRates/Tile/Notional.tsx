import { useState } from "react"
import styled from "styled-components/macro"
import { InputWrapper } from "./responsiveWrappers"
import { useTileCurrencyPair } from "./context"
import { onChangeNotionalValue, useNotional } from "./state"
import { formatAsWholeNumber } from "utils/formatNumber"

export const Input = styled.input`
  grid-area: Input;
  background: none;
  text-align: center;
  outline: none;
  border: none;
  font-size: 0.75rem;
  width: 80px;
  padding: 2px 0;
  color: ${({ theme }) => theme.core.textColor};
  border-bottom: 1.5px solid ${({ theme }) => theme.primary[5]};
  caret-color: ${({ theme }) => theme.primary.base};
  &:focus {
    outline: none !important;
    border-color: ${({ theme }) => theme.accents.primary.base};
  }
`

export const CurrencyPairSymbol = styled("span")`
  grid-area: Currency;
  opacity: 0.59;
  font-size: 0.625rem;
  line-height: 1.2rem;
`

export const NotionalInput: React.FC = () => {
  const { base, symbol } = useTileCurrencyPair()
  const notional = useNotional(symbol)
  const [isFocused, setIsFocused] = useState(false)

  return (
    <InputWrapper>
      <CurrencyPairSymbol>{base}</CurrencyPairSymbol>
      <Input
        type="text"
        value={isFocused ? notional : formatAsWholeNumber(parseInt(notional))}
        onChange={({ target: { value } }) => {
          onChangeNotionalValue({ symbol, value })
        }}
        onFocus={(event) => {
          event.target.select()
          setIsFocused(true)
        }}
        onBlur={() => {
          setIsFocused(false)
        }}
      />
    </InputWrapper>
  )
}
