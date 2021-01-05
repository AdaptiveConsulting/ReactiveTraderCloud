import { ExecutionStatus } from "services/executions"
import styled, { DefaultTheme } from "styled-components/macro"

export const OverlayDiv = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  z-index: 2;
  width: 100%;
  height: 100%;
`

export const ExecutionStatusAlertContainer = styled(OverlayDiv)<{
  status: ExecutionStatus
  theme: DefaultTheme
}>`
  background-color: ${({ status, theme }) => {
    switch (status) {
      case "Done":
        return `${theme.colors.accents.positive.darker} `
      case "Rejected":
        return `${theme.colors.accents.negative.darker} `
      default:
        return ""
    }
  }};
  display: flex;
  flex-direction: column;
  font-weight: bolder;
  justify-content: space-evenly;
`

export const TradeIdDiv = styled.div`
  margin: 0 1.25rem;
  text-align: center;
`

export const TradeMessageDiv = styled.div`
  font-size: 0.8rem;
  line-height: 1.5rem;
  margin: 0 1.25rem;
  text-align: center;
`

export const Button = styled("button")<{
  success: Boolean
  theme: DefaultTheme
}>`
  background-color: ${({ success, theme }) =>
    success ? theme.accents.positive.base : theme.accents.negative.base};
  border-radius: 2rem;
  margin: 0 auto;
  padding: 0.5rem 0;
  text-align: center;
  width: 33%;
`

export const CurrencyPairDiv = styled.div`
  margin: 0 1.25rem;
`
