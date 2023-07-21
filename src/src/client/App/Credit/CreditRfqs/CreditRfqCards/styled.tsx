import styled, { css, DefaultTheme, keyframes } from "styled-components"

import { ThemeName } from "@/client/theme"
import { Direction } from "@/generated/TradingGateway"

// Card

export const CreditRfqCardsWrapper = styled.div<{ empty: boolean }>`
  display: ${({ empty }) => (empty ? "flex" : "grid")};
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  grid-gap: 8px;
  align-content: start;
  margin-right: 8px;
  flex: 1;
`

const cardFlash = ({
  theme,
  direction,
}: {
  theme: DefaultTheme
  direction: Direction
}) => keyframes`
  0% {
    border-color: ${theme.colors.spectrum.uniqueCollections[direction].base};
  }
  50% {
    border-color: transparent;
  }
  100% {
    border-color: ${theme.colors.spectrum.uniqueCollections[direction].base};
  }
`

const highlightBorderColor = css`
  animation: ${cardFlash} 1s ease-in-out 3;
`

export const CardContainer = styled.div<{
  direction: Direction
  live: boolean
  highlight: boolean
}>`
  display: flex;
  flex-direction: column;
  border-radius: 2px;
  border: ${({ highlight }) => (highlight ? "2px" : "1px")} solid transparent;
  width: 100%;
  height: 251px;

  ${({ highlight }) => highlight && highlightBorderColor}

  &:first-child {
    ${({ theme, direction, live, highlight }) =>
      live &&
      !highlight &&
      `border-color: ${theme.colors.spectrum.uniqueCollections[direction].base}`};
  }
`

export const Row = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 4px 8px;
  width: 100%;
`

export const DetailsWrapper = styled(Row)`
  margin: 1px 0;
  flex: 0 0 24px;
  background: ${({ theme }) => theme.primary[2]};
`

export const RowText = styled.span`
  font-size: 11px;
  font-weight: 500;
`

export const Label = styled(RowText)`
  color: ${({ theme }) => theme.textColor};
`

export const Quantity = styled(RowText)`
  color: ${({ theme }) => theme.secondary[5]};
`

export const QuotesContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  background-color: ${({ theme }) => theme.core.lightBackground};
`

export const NoRfqsWrapper = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`

// Card Footer

export const CardFooterWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 32px;
  padding: 0 8px;
  margin-top: 1px;
  background: ${({ theme }) => theme.core.lightBackground};
  font-size: 11px;
`

export const CancelQuoteButton = styled.button`
  color: ${({ theme }) => theme.core.textColor};
  background-color: ${({ theme }) => theme.core.darkBackground};
  border-radius: 3px;
  font-size: 11px;
  padding: 2px 5px 3px 5px;
  margin-left: 9px;
`

export const TerminatedCardState = styled.button`
  display: flex;
  align-items: center;
  padding: 4px 8px;
  border-radius: 3px;
  background-color: ${({ theme }) =>
    theme.primary[theme.name === ThemeName.Dark ? 2 : 3]};
  color: ${({ theme }) =>
    theme.name === ThemeName.Dark
      ? theme.colors.light.core.activeColor
      : theme.secondary[3]};

  svg {
    margin-right: 4px;
  }
`

export const AcceptedCardState = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  color: ${({ theme }) => theme.accents.positive.base};

  svg {
    margin-right: 8px;
  }
`

export const ViewTrade = styled.button`
  flex: 0 0 fit-content;
  color: ${({ theme }) => theme.accents.primary.base};
`
