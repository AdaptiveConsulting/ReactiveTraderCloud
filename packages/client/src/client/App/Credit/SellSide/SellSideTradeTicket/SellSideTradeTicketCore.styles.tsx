import styled from "styled-components"

import { SellSideQuoteState } from "../sellSideState"
import { getSellSideStatusColor } from "../utils"

export const SellSideTradeTicketWrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding: 8px;
  gap: 8px;
  height: 100%;
  background-color: ${({ theme }) => theme.core.lightBackground};
`

export const SellSideTradeTicketInnerWrapper = styled.div`
  display: flex;
  flex-direction: column;
  border: 1px solid ${({ theme }) => theme.primary[4]};
  border-radius: 2px;
  height: 100%;
  background-color: ${({ theme }) => theme.core.lightBackground};
`
export const Banner = styled.div`
  display: flex;
  align-items: center;
  padding: 8px;
  gap: 8px;
  color: ${({ theme }) => theme.textColor};
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
