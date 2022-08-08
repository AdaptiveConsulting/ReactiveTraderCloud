import { ThemeName } from "@/theme"
import styled from "styled-components"

// Card

export const CreditRfqCardsWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-content: start;
  gap: 8px;
  flex: 1;
`

export const CardContainer = styled.div`
  display: flex;
  flex-direction: column;
  border-radius: 2px;
  width: 300px;
  height: 251px;
`

const Row = styled.div`
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

export const QuoteRow = styled(Row)<{ quoteActive: boolean }>`
  justify-content: start;
  &:nth-child(even) {
    background-color: ${({ theme }) => theme.core.darkBackground};
  }
  &:nth-child(odd) {
    background-color: ${({ theme }) => theme.core.lightBackground};
  }
  &:hover {
    & button {
      display: ${({ quoteActive }) => (quoteActive ? "block" : null)};
    }
  }
`

// This color does not seem to be part of the palette
export const DealerName = styled(RowText)<{
  open: boolean
  accepted: boolean
}>`
  color: ${({ theme, open, accepted }) => {
    if (open) {
      return theme.name === ThemeName.Dark ? "#a1a5ae" : theme.secondary.base
    } else if (accepted) {
      return theme.textColor
    } else {
      return theme.name === ThemeName.Dark ? "#a1a5ae" : theme.secondary[4]
    }
  }};
  margin-right: auto;
`

export const Price = styled(RowText)<{ open: boolean; accepted: boolean }>`
  color: ${({ theme, open, accepted }) => {
    if (open) {
      return theme.secondary[theme.name === ThemeName.Dark ? 5 : 4]
    } else if (accepted) {
      return theme.accents.positive.base
    } else {
      return theme.name === ThemeName.Dark ? "#a1a5ae" : theme.secondary[4]
    }
  }};
  ${({ open, accepted }) =>
    !open && !accepted && "text-decoration: line-through;"}

  display:flex;
  align-items: center;

  svg {
    margin-right: 4px;
  }
`

export const AcceptQuoteButton = styled.button`
  user-select: none;
  display: none;
  border-radius: 3px;
  padding: 0 8px;
  height: 16px;
  font-size: 11px;
  font-weight: 500;
  margin-left: 8px;
  color: ${({ theme }) => theme.white};
  background-color: ${({ theme }) =>
    theme.colors.spectrum.uniqueCollections.Buy.base};
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
