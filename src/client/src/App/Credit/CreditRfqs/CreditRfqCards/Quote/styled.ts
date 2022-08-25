import { Direction } from "@/generated/TradingGateway"
import { ThemeName } from "@/theme"
import styled, { keyframes } from "styled-components"
import { Row } from "../styled"

type QuoteRowProps = {
  quoteActive: boolean
  highlight: boolean
  direction: Direction
}

export const QuoteRow = styled(Row)<QuoteRowProps>`
  justify-content: start;

  &:nth-child(even) {
    background-color: ${({ theme, highlight, direction }) =>
      highlight
        ? theme.colors.spectrum.uniqueCollections[direction][
            theme.name === ThemeName.Dark ? "base" : "lighter"
          ]
        : theme.core.darkBackground};
  }
  &:nth-child(odd) {
    background-color: ${({ theme, highlight, direction }) =>
      highlight
        ? theme.colors.spectrum.uniqueCollections[direction][
            theme.name === ThemeName.Dark ? "base" : "lighter"
          ]
        : theme.core.lightBackground};
  }
  &:hover {
    & button {
      display: ${({ quoteActive }) => (quoteActive ? "block" : null)};
    }
  }
`

export const QuoteRowText = styled.div`
  font-size: 11px;
  line-height: 16px;
  font-weight: 500;
`

const breathing = keyframes`
    0% {
        transform: scale(1);
    }

    25% {
        transform: scale(2);
    }

    50% {
        transform: scale(2);
    }

    100% {
        transform: scale(1);
    }
`

export const QuoteDotWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 8px;
  height: 8px;
  margin-right: 4px;
`

export const QuoteDot = styled.div<{ highlight: boolean }>`
  height: 4px;
  width: 4px;
  border-radius: 4px;
  background-color: ${({ theme, highlight }) =>
    highlight ? theme.textColor : theme.accents.primary.base};
  animation: ${breathing} 1s linear infinite;
`

type RowFieldProps = {
  open: boolean
  accepted: boolean
  priced: boolean
  highlight?: boolean
}

const getRowFieldFontWeight = ({ priced, open, accepted }: RowFieldProps) =>
  (priced && open) || accepted ? "700" : null

// This color does not seem to be part of the palette
export const DealerName = styled(QuoteRowText)<RowFieldProps>`
  display: flex;
  align-items: center;
  color: ${({ theme, open, accepted, priced }) => {
    if (accepted) {
      return theme.accents.positive.base
    } else if (open) {
      if (priced) {
        return theme.secondary.base
      }
      return theme.name === ThemeName.Dark ? "#a1a5ae" : theme.secondary.base
    } else {
      return theme.name === ThemeName.Dark ? "#a1a5ae" : theme.secondary[4]
    }
  }};
  font-weight: ${getRowFieldFontWeight};
  margin-right: auto;
`

export const Price = styled(QuoteRowText)<RowFieldProps>`
  display: flex;
  align-items: center;
  color: ${({ theme, open, accepted, priced, highlight }) => {
    if (accepted) {
      return theme.accents.positive.base
    } else if (open) {
      if (priced) {
        return highlight ? theme.textColor : theme.accents.primary.base
      }
      return theme.secondary[theme.name === ThemeName.Dark ? 5 : 4]
    } else {
      return theme.name === ThemeName.Dark ? "#a1a5ae" : theme.secondary[4]
    }
  }};
  font-weight: ${getRowFieldFontWeight};
  ${({ open, accepted }) =>
    !open && !accepted && "text-decoration: line-through;"}

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
