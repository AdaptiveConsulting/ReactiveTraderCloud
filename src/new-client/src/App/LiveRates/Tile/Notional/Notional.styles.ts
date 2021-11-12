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
  &.is-invalid {
    border-bottom-color: ${({ theme }) => theme.accents.negative.base};
  }
`

export const CurrencyPairSymbol = styled("label")`
  display: inline-block;
  width: 24px;
  opacity: 0.59;
  font-size: 0.625rem;
  line-height: 1.2rem;
`

export const InputWrapper = styled.div``

export const ErrorMessage = styled.div`
  margin-left: 24px;
  margin-top: 2px;
  padding-top: 2px;
  color: ${({ theme }) => theme.accents.negative.base};
  font-size: 0.6rem;
  line-height: 1;
`

export const ResetInputValue = styled.button<{ isVisible: boolean }>`
  background-color: ${({ theme }) => theme.core.lightBackground};
  border: 2px solid ${({ theme }) => theme.core.darkBackground};
  display: ${({ isVisible }) => (isVisible ? "inline-flex" : "none")};
  border-radius: 3px;
  margin-left: 8px;
  padding: 2px;
  cursor: pointer;
  font-size: 0.625rem;
  line-height: 1.2rem;
  .flipHorizontal {
    transform: scaleX(-1);
  }
`
