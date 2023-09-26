import styled, { DefaultTheme } from "styled-components"

import { Theme, ThemeName } from "@/client/theme"
import { breathing } from "@/client/utils/styling"
import { Direction } from "@/generated/TradingGateway"

import { Row } from "../styled"

interface CommonProps {
  highlight: boolean
  direction: Direction
}
interface QuoteRowProps extends CommonProps {
  quoteActive: boolean
}
interface AnimatedRowProps extends CommonProps {
  passed: boolean
}

function getBuySellHighlightRowBackgroundColor(
  theme: Theme,
  direction: Direction,
) {
  return theme.colors.spectrum.uniqueCollections[direction][
    theme.name === ThemeName.Dark ? "darker" : "lighter"
  ]
}

export const QuoteRow = styled(Row)<QuoteRowProps>`
  justify-content: start;

  &:nth-child(even) {
    background-color: ${({ theme, highlight, direction }) =>
      highlight
        ? getBuySellHighlightRowBackgroundColor(theme, direction)
        : theme.core.darkBackground};
  }
  &:nth-child(odd) {
    background-color: ${({ theme, highlight, direction }) =>
      highlight
        ? getBuySellHighlightRowBackgroundColor(theme, direction)
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

export const QuoteDotWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 8px;
  height: 8px;
  margin: 0 4px;
`

function getBuySellHighlightTextColor(theme: Theme, direction: Direction) {
  return theme.colors.spectrum.uniqueCollections[direction][
    theme.name === ThemeName.Dark ? "base" : "darker"
  ]
}

export const QuoteDot = styled.div<AnimatedRowProps>`
  height: 4px;
  width: 4px;
  border-radius: 4px;
  background-color: ${({ theme, highlight, direction, passed }) =>
    highlight
      ? theme.textColor
      : passed
      ? theme.primary[4]
      : getBuySellHighlightTextColor(theme, direction)};
  animation: ${breathing} 1s linear infinite;
`

interface RowFieldProps {
  open: boolean
  accepted: boolean
  passed?: boolean
  priced: boolean
}

const getRowFieldFontWeight = ({ priced, open, accepted }: RowFieldProps) =>
  (priced && open) || accepted ? "700" : null

const getDealerFontColor = ({
  theme,
  open,
  accepted,
  priced,
}: RowFieldProps & { theme: DefaultTheme }) => {
  if (accepted) {
    return theme.accents.positive.base
  } else if (open) {
    if (priced) {
      return theme.secondary.base
    }
    return theme.secondary[theme.name === ThemeName.Dark ? 6 : "base"]
  } else {
    return theme.secondary[theme.name === ThemeName.Dark ? 6 : 4]
  }
}

// This color does not seem to be part of the palette
export const DealerName = styled(QuoteRowText)<RowFieldProps>`
  display: flex;
  align-items: center;
  color: ${getDealerFontColor};
  font-weight: ${getRowFieldFontWeight};
  margin-right: auto;
`

export const Price = styled(QuoteRowText)<RowFieldProps & CommonProps>`
  display: flex;
  align-items: center;
  color: ${({ theme, open, accepted, priced, highlight, direction }) => {
    if (accepted) {
      return theme.accents.positive.base
    } else if (open) {
      if (priced) {
        return highlight
          ? theme.textColor
          : getBuySellHighlightTextColor(theme, direction)
      }
      return theme.secondary[theme.name === ThemeName.Dark ? 5 : 4]
    } else {
      return theme.secondary[theme.name === ThemeName.Dark ? 6 : 4]
    }
  }};
  font-weight: ${getRowFieldFontWeight};
  ${({ open, accepted, passed }) =>
    (passed || (!open && !accepted)) && "text-decoration: line-through;"}

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
