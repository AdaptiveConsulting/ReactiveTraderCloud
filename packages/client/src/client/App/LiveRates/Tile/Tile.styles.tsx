import styled from "styled-components"

import { DeliveryDate, HeaderAction } from "./Header"

export const PriceControlsStyle = styled("div")<{
  isAnalyticsView?: boolean
}>`
  display: grid;
  flex: 1;
  height: 100%;
  ${({ isAnalyticsView, theme }) =>
    isAnalyticsView
      ? `
  grid-template-rows: 50% 50%;
  grid-template-areas:
  "movement sell"
  "movement buy";
  gap: ${theme.spacing.xxs};
  padding-right: ${theme.spacing.xs}
  `
      : `
      grid-template-columns: 87px 1fr 87px;
      grid-template-rows: 100%;
      grid-template-areas:
      "sell movement buy";
      padding: 0 ${theme.spacing.md};
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
        shouldMoveDate ? theme.spacing["2xl"] : "0"};
    }
  }
`
export const Body = styled.div<{
  isAnalyticsView?: boolean
  showTimer: boolean
}>(
  ({ isAnalyticsView, theme }) => `
  display: flex;
  flex: 1;
  flex-direction: ${isAnalyticsView ? "row" : "column"};
  align-items: ${isAnalyticsView ? "center" : null};
  padding: ${theme.spacing.xs} 0;
  min-height: ${isAnalyticsView ? "136px" : "0"};
`,
)

export const Main = styled.div`
  min-height: 142px;
  flex: 1;
  width: 100%;
  display: flex;
  flex-direction: column;
  background-color: ${({ theme }) =>
    theme.color["Colors/Background/bg-primary"]};
  box-shadow: 0 2px 20px
    ${({ theme }) => theme.color["Colors/Background/bg-secondary"]};
  &:hover,
  .tile-hover & {
    color: ${({ theme }) =>
      theme.color["Colors/Text/text-brand-primary (900)"]};
  }
`
