import styled from "styled-components/macro"

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

export const InputWrapper = styled.div`
  display: grid;
  grid-template-columns: 30px auto 30px;
  grid-template-areas: "Currency Input ResetInputValue" ". Message .";
  align-items: center;

  grid-template-rows: 23px 13px;
  margin-bottom: -0.5rem;
`

export const NotionalInputWrapper = styled("div")<{
  isAnalyticsView: boolean
}>`
  display: flex;
  align-items: center;
  grid-area: notional;
  ${({ isAnalyticsView }) =>
    isAnalyticsView
      ? ``
      : `
      justify-content: center;
    `}
`
