import styled from "styled-components"

import { WithChildren } from "@/client/utils/utilityTypes"

import { DeliveryDate, HeaderAction } from "./Header/TileHeader"

export const AnalyticsPricesFirstCol = "20%"

export const PriceControlWrapper = styled.div`
  grid-area: control;
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
`

export const PriceControlsStyle = styled("div")<{
  isAnalyticsView: boolean
}>`
  flex: 1;
  display: grid;
  padding: 0 ${({ theme }) => theme.newTheme.spacing.md};
  ${({ isAnalyticsView }) =>
    isAnalyticsView
      ? `
  grid-template-rows: 50% 50%;
  grid-template-areas:
  "movement sell"
  "movement buy";
  `
      : `
      height: 100%;
      grid-template-columns: 37% 26% 37%;
      grid-template-rows: 100%;
      grid-template-areas:
      "sell movement buy";
    `}
`

export const InputTimerStyle = styled.div<{ isAnalyticsView: boolean }>`
  display: flex;
  flex-direction: column;

  ${({ isAnalyticsView }) =>
    !isAnalyticsView
      ? `
      align-items: flex-start;
      `
      : `
      `}
`

export const PanelItem = styled.div<{ shouldMoveDate: boolean }>`
  position: relative;
  display: flex;

  &:hover,
  &.tile-hover {
    ${HeaderAction} {
      opacity: 1;
    }

    ${DeliveryDate} {
      margin-right: ${({ shouldMoveDate, theme }) =>
        shouldMoveDate ? theme.newTheme.spacing.lg : "0"};
    }
  }
`
export const Body = styled.div<{
  isAnalyticsView: boolean
  showTimer: boolean
}>`
  display: flex;
  flex-direction: column;
  flex: 1;
  padding: ${({ theme }) => theme.newTheme.spacing.md} 0;
`
export const GraphPricesWrapper = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
`

const MainTileStyle = styled.div`
  background-color: ${({ theme }) =>
    theme.newTheme.color["Colors/Background/bg-primary"]};
  border: 2px solid
    ${({ theme }) => theme.newTheme.color["Colors/Background/bg-primary"]};
  &:hover,
  .tile-hover & {
    color: ${({ theme }) =>
      theme.newTheme.color["Colors/Text/text-brand-primary (900)"]};
    box-shadow: ${({ theme }) =>
      theme.name === "light" ? "0 0 10px 0 rgba(0, 0, 0, 0.1)" : "none"};
  }
`
const MainTileWrapper = styled.div`
  width: 100%;
  color: ${({ theme }) => theme.core.textColor};
`

export const Main = ({ children }: WithChildren) => (
  <MainTileWrapper>
    <MainTileStyle>{children}</MainTileStyle>
  </MainTileWrapper>
)
