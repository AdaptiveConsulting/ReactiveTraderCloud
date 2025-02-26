import styled from "styled-components"

import { SellSideQuoteState } from "../sellSideState"
import { getSellSideStatusColor } from "../utils"

export const SellSideTradeTicketWrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding: ${({ theme }) => theme.newTheme.spacing.md};
  gap: ${({ theme }) => theme.newTheme.spacing.md};
  height: 100%;
  background-color: ${({ theme }) =>
    theme.newTheme.color["Colors/Background/bg-secondary_subtle"]};
`

export const SellSideTradeTicketInnerWrapper = styled.div`
  display: flex;
  flex-direction: column;
  border-radius: 2px;
  height: 100%;
  background-color: ${({ theme }) =>
    theme.newTheme.color["Colors/Background/bg-primary"]};
`
export const Banner = styled.div`
  display: flex;
  align-items: center;
  padding: 8px;
  gap: 8px;
  color: ${({ theme }) =>
    theme.newTheme.color["Colors/Text/text-primary (900)"]};
  font-size: 11px;
  line-height: 16px;
  font-weight: 500;
`

export const Diamond = styled.div<{ state: SellSideQuoteState }>`
  width: 0;
  height: 0;
  border: 4px solid transparent;
  border-bottom-color: ${({ theme, state }) =>
    getSellSideStatusColor(state, theme)};
  position: relative;
  top: -4px;
  &:after {
    content: "";
    position: absolute;
    left: -4px;
    top: 4px;
    width: 0;
    height: 0;
    border: 4px solid transparent;
    border-top-color: ${({ theme, state }) =>
      getSellSideStatusColor(state, theme)};
  }
`
