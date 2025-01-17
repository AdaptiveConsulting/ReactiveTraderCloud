import styled, { css, DefaultTheme, keyframes } from "styled-components"

import { FlexBox } from "@/client/components/FlexBox"
import { Direction } from "@/generated/TradingGateway"

const cardFlash = ({ theme }: { theme: DefaultTheme }) => keyframes`
  0% {
    border-color: ${theme.newTheme.color["Colors/Border/border-brand"]};
  }
  50% {
    border-color: transparent;
  }
  100% {
    border-color: ${theme.newTheme.color["Colors/Border/border-brand"]};
  }
`

const highlightBorderColor = css`
  animation: ${cardFlash} 1s ease-in-out 3;
`

export const CardContainer = styled.div<{
  live: boolean
  highlight: boolean
  direction: Direction
}>`
  display: flex;
  flex-direction: column;
  border: 2px solid
    ${({ theme }) => theme.newTheme.color["Colors/Background/bg-tertiary"]};
  width: 100%;
  height: 251px;

  ${({ highlight }) => highlight && highlightBorderColor}

  &:first-child {
    ${({ theme, live, highlight, direction }) =>
      live &&
      !highlight &&
      `border-color: ${direction === Direction.Buy ? theme.newTheme.color["Colors/Border/border-buy"] : theme.newTheme.color["Colors/Border/border-sell"]}`};
  }
`

export const Row = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${({ theme }) => theme.newTheme.spacing.md} 0;

  width: 100%;
`

export const DetailsWrapper = styled(Row)`
  padding: ${({ theme }) => theme.newTheme.spacing.xs};
  background: ${({ theme }) =>
    theme.newTheme.color["Colors/Background/bg-quaternary"]};
`

export const QuotesContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  background-color: ${({ theme }) =>
    theme.newTheme.color["Colors/Background/bg-primary"]};
`

export const NoRfqsWrapper = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`

// Card Footer

export const CardFooterWrapper = styled(FlexBox)`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.newTheme.spacing.md};
  background: ${({ theme }) =>
    theme.newTheme.color["Colors/Background/bg-secondary_subtle"]};
  svg {
    fill: ${({ theme }) =>
      theme.newTheme.color["Colors/Text/text-success-primary (600)"]};
    margin-right: ${({ theme }) => theme.newTheme.spacing.xs};
  }
`

export const AcceptedCardState = styled.div`
  flex: 1;
  display: flex;
  align-items: center;

  svg {
    margin-right: ${({ theme }) => theme.newTheme.spacing.md};
  }
`

export const FooterButton = styled.button`
  background-color: ${({ theme }) =>
    theme.newTheme.color["Colors/Background/bg-tertiary"]};
  padding: ${({ theme }) => theme.newTheme.spacing.md};

  &:hover {
    background-color: ${({ theme }) =>
      theme.newTheme.color[
        "Component colors/Components/Buttons/Primary/button-primary-bg_hover"
      ]};
  }
`

export const ViewTradeButton = styled(FooterButton)`
  margin-left: auto;
`

export const CloseRfqButton = styled(FooterButton)`
  display: flex;
  align-items: center;
  padding: ${({ theme }) => theme.newTheme.spacing.xs}
    ${({ theme }) => theme.newTheme.spacing.md};
  border-radius: ${({ theme }) => theme.newTheme.radius.xs};
  svg {
    fill: ${({ theme }) =>
      theme.newTheme.color["Colors/Text/text-brand-tertiary (600)"]};
    margin-right: ${({ theme }) => theme.newTheme.spacing.md};
  }
`
