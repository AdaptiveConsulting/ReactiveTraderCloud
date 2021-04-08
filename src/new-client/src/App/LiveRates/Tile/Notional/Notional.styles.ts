import styled from "styled-components"

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
  &:disabled {
    opacity: 0.3;
  }
`

export const CurrencyPairSymbol = styled("span")`
  grid-area: Currency;
  opacity: 0.59;
  font-size: 0.625rem;
  line-height: 1.2rem;
`

export const InputWrapper = styled.div`
  display: flex;
  justify-content: center;
  padding-right: 1.3rem;
`
