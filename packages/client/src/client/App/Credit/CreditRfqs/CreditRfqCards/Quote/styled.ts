import styled from "styled-components"

import { Button } from "@/client/components/Button"
import { Theme } from "@/client/theme"
import { breathing } from "@/client/utils/styling"
import { Direction } from "@/generated/TradingGateway"

import { isBuy } from "../../../common"
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
  return isBuy(direction)
    ? theme.newTheme.color["Colors/Background/bg-buy-primary"]
    : theme.newTheme.color["Colors/Background/bg-sell-primary"]
}

export const QuoteRow = styled(Row)<QuoteRowProps>`
  height: ${({ theme }) => theme.newTheme.density.md};
  border-bottom: 1px solid
    ${({ theme }) => theme.newTheme.color["Colors/Background/bg-tertiary"]};

  background-color: ${({ theme, highlight, direction }) =>
    highlight ? getBuySellHighlightRowBackgroundColor(theme, direction) : null};

  &:hover {
    & button {
      display: ${({ quoteActive }) => (quoteActive ? "block" : null)};
    }
  }
`

export const QuoteDotWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 8px;
  height: 8px;
  margin: 0 4px;
`

export const QuoteDot = styled.div<AnimatedRowProps>`
  height: 4px;
  width: 4px;
  border-radius: 4px;
  background-color: ${({ theme, highlight, direction, passed }) =>
    highlight
      ? theme.newTheme.color["Colors/Text/text-primary (900)"]
      : passed
        ? theme.newTheme.color["Colors/Text/text-disabled"]
        : isBuy(direction)
          ? theme.newTheme.color["Colors/Text/text-buy-primary"]
          : theme.newTheme.color["Colors/Text/text-sell-primary"]};
  animation: ${breathing} 1s linear infinite;
`

interface RowFieldProps {
  open: boolean
  accepted: boolean
  passed?: boolean
  priced: boolean
}

export const Price = styled.div<RowFieldProps>`
  display: flex;
  align-items: center;
  margin-left: auto;
  ${({ open, accepted, passed, priced, theme }) =>
    (passed || (!open && !accepted)) &&
    `
      text-decoration: line-through;
      color: ${theme.newTheme.color["Colors/Text/text-disabled"]};
      ${priced && `margin-right: ${theme.newTheme.spacing.sm}`}
  `}

  svg {
    fill: ${({ theme }) =>
      theme.newTheme.color["Colors/Text/text-success-primary (600)"]};
    margin-right: 4px;
  }
`
export const AcceptButton = styled(Button)`
  display: none;
  margin-left: ${({ theme }) => theme.newTheme.spacing.sm};
`
