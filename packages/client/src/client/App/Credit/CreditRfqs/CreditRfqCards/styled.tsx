import styled, { css, DefaultTheme, keyframes } from "styled-components"

import { FlexBox } from "@/client/components/FlexBox"
import { Typography } from "@/client/components/Typography"
import { Direction } from "@/generated/TradingGateway"

const cardFlash = ({ theme }: { theme: DefaultTheme }) => keyframes`
  0% {
    border-color: ${theme.color["Colors/Border/border-brand"]};
  }
  50% {
    border-color: transparent;
  }
  100% {
    border-color: ${theme.color["Colors/Border/border-brand"]};
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
    ${({ theme }) => theme.color["Colors/Background/bg-tertiary"]};
  width: 100%;
  height: 251px;

  ${({ highlight }) => highlight && highlightBorderColor}

  &:first-child {
    ${({ theme, live, highlight, direction }) =>
      live &&
      !highlight &&
      `border-color: ${direction === Direction.Buy ? theme.color["Colors/Border/border-buy"] : theme.color["Colors/Border/border-sell"]}`};
  }
`

export const Row = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.md} 0;

  width: 100%;
`

export const DetailsWrapper = styled(Row)`
  white-space: nowrap;
  display: flex;
  gap: ${({ theme }) => theme.spacing["4xl"]};
  padding: ${({ theme }) => theme.spacing.xs};
  background: ${({ theme }) => theme.color["Colors/Background/bg-quaternary"]};
`

export const QuotesContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  background-color: ${({ theme }) =>
    theme.color["Colors/Background/bg-primary"]};
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
  padding: ${({ theme }) => theme.spacing.md};
  background: ${({ theme }) =>
    theme.color["Colors/Background/bg-secondary_subtle"]};
  color: ${({ theme }) =>
    theme.color["Colors/Text/text-success-primary (600)"]};
  svg {
    margin-right: ${({ theme }) => theme.spacing.xs};
  }
`

export const AcceptedCardState = styled.div`
  flex: 1;
  display: flex;
  align-items: center;

  svg {
    margin-right: ${({ theme }) => theme.spacing.md};
  }
`

export const FooterButton = styled.button`
  background-color: ${({ theme }) =>
    theme.color["Colors/Background/bg-tertiary"]};
  padding: ${({ theme }) => theme.spacing.md};

  &:hover {
    background-color: ${({ theme }) =>
      theme.color[
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
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.radius.xs};
  color: ${({ theme }) => theme.color["Colors/Text/text-brand-tertiary (600)"]};
`

export const QuantityTypography = styled(Typography)`
  overflow: hidden;
  text-overflow: ellipsis;
`
