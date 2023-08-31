import styled from "styled-components"

import { ThemeName } from "@/client/theme"
import { Direction } from "@/generated/TradingGateway"

export const FooterWrapper = styled.div<{ accepted: boolean; missed: boolean }>`
  display: flex;
  align-items: center;
  height: 50px;
  padding: 8px;
  border-top: 1px solid ${({ theme }) => theme.primary[3]};
  background-color: ${({ accepted, missed }) =>
    accepted
      ? "rgba(1, 195, 141, 0.1)"
      : missed
      ? "rgba(167, 39, 64, 0.15)"
      : undefined};
`

export const TimerWrapper = styled.div`
  display: flex;
  align-items: center;
  flex: 1;
  padding: 0 8px;
`

export const FooterButton = styled.button`
  padding: 4px 8px;
  border-radius: 3px;
  height: 24px;
  font-size: 11px;
  &:focus {
    border-radius: 3px;
    border: 1px solid #4c76c4 !important;
  }
`

export const PassButton = styled(FooterButton)<{ disabled: boolean }>`
  color: ${({ theme }) =>
    theme.secondary[theme.name === ThemeName.Dark ? "base" : 3]};
  background-color: ${({ theme }) =>
    theme.primary[theme.name === ThemeName.Dark ? 2 : 3]};
  ${({ disabled }) => (disabled ? "opacity: 0.3" : "")}
`

export const SendQuoteButton = styled(FooterButton)<{
  direction: Direction
  disabled: boolean
}>`
  color: ${({ theme }) => theme.white};
  background-color: ${({ theme, direction }) =>
    theme.colors.spectrum.uniqueCollections[direction].darker};
  ${({ disabled }) => (disabled ? "opacity: 0.3" : "")}
`

export const TradeStatus = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  font-size: 11px;
  font-weight: 700;
  svg {
    margin-right: 8px;
  }
`
export const Terminated = styled(TradeStatus)`
  justify-content: center;
  color: ${({ theme }) => theme.primary[5]};
`
export const Accepted = styled(TradeStatus)`
  color: ${({ theme }) => theme.accents.positive.base};
`
export const Missed = styled(TradeStatus)`
  color: ${({ theme }) =>
    theme.accents.negative[
      theme.name === ThemeName.Light ? "darker" : "medium"
    ]};
`
export const TradeDetails = styled.div`
  font-size: 9px;
  font-weight: 500px;
`
