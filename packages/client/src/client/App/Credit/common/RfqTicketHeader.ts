import styled, { css } from "styled-components"

import { Direction } from "@/generated/TradingGateway"

import { isBuy } from "./utils"

interface WithDirection {
  direction: Direction
}

interface WithTerminated {
  terminated: boolean
}

const buyBackground = css<WithTerminated>`
  background-color: ${({ theme, terminated }) =>
    terminated
      ? theme.color["Colors/Background/bg-quaternary"]
      : theme.color["Colors/Background/bg-brand-primary"]};
`

const sellBackground = css<WithTerminated>`
  background-color: ${({ theme, terminated }) =>
    terminated
      ? theme.color["Colors/Background/bg-quaternary"]
      : theme.color["Colors/Background/bg-sell-primary"]};
`

export const DirectionLabel = styled.div<WithDirection & WithTerminated>`
  position: relative;
  display: flex;
  text-align: center;
  align-items: center;
  justify-content: center;
  width: 56px;
  padding: ${({ theme }) => theme.spacing.md};
  height: 100%;
  ${({ direction }) => (isBuy(direction) ? buyBackground : sellBackground)}
`

export const InstrumentLabelContainer = styled.div<WithTerminated>`
  flex-grow: 1;
  align-self: stretch;
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: left;
  padding-left: ${({ theme }) => theme.spacing.md};
  background-color: ${({ theme }) =>
    theme.color["Colors/Background/bg-tertiary"]};
`
