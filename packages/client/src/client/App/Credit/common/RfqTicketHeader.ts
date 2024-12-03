import styled, { css } from "styled-components"

import { Direction } from "@/generated/TradingGateway"

import { isBuy } from "./utils"

interface WithDirection {
  direction: Direction
}

interface WithTerminated {
  terminated: boolean
}

export const DirectionContainer = styled.div<WithDirection & WithTerminated>`
  display: flex;
  flex: 0 0 48px;
  background-color: ${({ theme, direction, terminated }) =>
    terminated
      ? theme.primary[2]
      : direction === Direction.Buy
        ? "rgba(76, 118, 196, 0.15)"
        : "rgba(167, 39, 64, 0.15)"};
`

const buyBackground = css<WithTerminated>`
  background-color: ${({ theme, terminated }) =>
    terminated
      ? theme.newTheme.color["Colors/Background/bg-quaternary"]
      : theme.newTheme.color["Colors/Background/bg-brand-primary"]};
`

const sellBackground = css<WithTerminated>`
  background-color: ${({ theme, terminated }) =>
    terminated
      ? theme.newTheme.color["Colors/Background/bg-quaternary"]
      : theme.newTheme.color["Colors/Background/bg-sell-primary"]};
`

export const DirectionLabel = styled.div<WithDirection & WithTerminated>`
  position: relative;
  display: flex;
  text-align: center;
  align-items: center;
  width: 50px;

  padding: ${({ theme }) => theme.newTheme.spacing.md};
  ${({ direction }) => (isBuy(direction) ? buyBackground : sellBackground)}
`

export const InstrumentLabelContainer = styled.div<WithTerminated>`
  flex-grow: 1;
  align-self: stretch;
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: left;
  padding-left: ${({ theme }) => theme.newTheme.spacing.md};
  background-color: ${({ theme }) =>
    theme.newTheme.color["Colors/Background/bg-tertiary"]};
`

export const InstrumentName = styled.div`
  font-size: 13px;
  font-weight: 600;
`
