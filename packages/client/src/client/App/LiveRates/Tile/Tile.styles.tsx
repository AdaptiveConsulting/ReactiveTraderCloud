import styled from "styled-components"

import { DeliveryDate, HeaderAction } from "./Header/TileHeader"

export const PriceControlWrapper = styled.div<{ isAnalyticsView: boolean }>`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  align-self: stretch;
  padding: ${({ isAnalyticsView, theme }) =>
    isAnalyticsView ? `0` : theme.newTheme.spacing.md};
`

export const PriceControlsStyle = styled("div")<{
  isAnalyticsView: boolean
}>`
  flex: 1;
  display: grid;
  ${({ isAnalyticsView, theme }) =>
    isAnalyticsView
      ? `
  grid-template-rows: 50% 50%;
  grid-template-areas:
  "movement sell"
  "movement buy";
  gap: ${theme.newTheme.spacing.xxs};
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
    !isAnalyticsView &&
    `align-items: flex-start;
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
        shouldMoveDate ? theme.newTheme.spacing["2xl"] : "0"};
    }
  }
`
export const Body = styled.div<{
  isAnalyticsView: boolean
  showTimer: boolean
}>(
  ({ isAnalyticsView, theme }) => `
  display: flex;
  flex: 1;
  flex-direction: ${isAnalyticsView ? "row" : "column"};
  align-items: ${isAnalyticsView ? "center" : null};
  padding: ${theme.newTheme.spacing.xs} 0;
  min-height: ${isAnalyticsView ? "136px" : "0"};
`,
)

export const GraphPricesWrapper = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
`

export const Main = styled.div`
  flex: 1;
  width: 100%;
  display: flex;
  flex-direction: column;
  background-color: ${({ theme }) =>
    theme.newTheme.color["Colors/Background/bg-primary"]};
  border: 2px solid
    ${({ theme }) => theme.newTheme.color["Colors/Background/bg-secondary"]};

  &:hover,
  .tile-hover & {
    color: ${({ theme }) =>
      theme.newTheme.color["Colors/Text/text-brand-primary (900)"]};
    box-shadow: ${({ theme }) =>
      theme.name === "light" ? "0 0 10px 0 rgba(0, 0, 0, 0.1)" : "none"};
  }
`
