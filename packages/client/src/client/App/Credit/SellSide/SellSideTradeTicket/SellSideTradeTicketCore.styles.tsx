import styled from "styled-components"

import { Stack } from "@/client/components/Stack"

import { SellSideQuoteState } from "../sellSideState"
import { getSellSideStatusColor } from "../utils"

export const SellSideTradeTicketWrapper = styled(Stack)`
  background-color: ${({ theme }) =>
    theme.color["Colors/Background/bg-secondary"]};
`

export const SellSideTradeTicketInnerWrapper = styled.div`
  display: flex;
  flex-direction: column;
  border-radius: 2px;
  box-shadow: -2px -2px 10px
    ${({ theme }) => theme.color["Colors/Border/border-secondary"]};
  background-color: ${({ theme }) =>
    theme.color["Colors/Background/bg-primary"]};
`
export const Banner = styled.div`
  display: flex;
  align-items: center;
  padding: 8px;
  gap: 8px;
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
