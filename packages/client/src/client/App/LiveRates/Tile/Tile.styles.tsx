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
  display: grid;
  flex: 1;
  height: 100%;
  padding: ${({ theme }) => theme.newTheme.spacing.lg};

  ${({ isAnalyticsView }) =>
    isAnalyticsView
      ? `
      grid-row-gap: 3px;
      grid-template-rows: 50% 50%;
      grid-template-areas:
      "movement sell"
      "movement buy";
    `
      : `
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
      align-items: center;
    > div:first-child {
      padding-right: 1.3rem;
    }
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
  ${({ isAnalyticsView }) =>
    isAnalyticsView
      ? `
  `
      : `
    flex-direction: column;
    flex: 1;
  `}
`
export const GraphNotionalWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 50%;
`

const MainTileStyle = styled.div`
  // TODO remove after analysis tile design
  overflow: auto;
  scrollbar-width: none;

  display: flex;
  width: 100%;
  flex-direction: column;
  height: 100%;
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
  position: relative;
  width: 100%;
  height: 165px;
  color: ${({ theme }) => theme.core.textColor};
`

export const Main = ({ children }: WithChildren) => (
  <MainTileWrapper>
    <MainTileStyle>{children}</MainTileStyle>
  </MainTileWrapper>
)
