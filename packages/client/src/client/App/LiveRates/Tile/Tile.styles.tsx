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
  position: relative;
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
      height: 4rem;
      grid-template-columns: 37% 26% 37%;
      grid-template-rows: 100%;
      grid-template-areas:
      "sell movement buy";
    `}
`

export const InputTimerStyle = styled.div<{ isAnalyticsView: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: ${({ isAnalyticsView }) =>
    isAnalyticsView ? "flex-start" : "center"};

  ${({ isAnalyticsView }) =>
    !isAnalyticsView
      ? `
    > div:first-child {
      padding-right: 1.3rem;
    }
  `
      : ""}
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

export const SpotTileStyle = styled.div`
  position: absolute;
  border-radius: 3px;
  box-sizing: border-box;
  background-color: ${({ theme }) => theme.core.lightBackground};
  display: flex;
  width: 100%;
  justify-content: space-between;
  flex-direction: column;
  overflow: hidden;
  &:hover,
    box-shadow: ${({ theme }) =>
      theme.name === "light" ? "0 0 10px 0 rgba(0, 0, 0, 0.1)" : "none"};
  }
`

const MainTileStyle = styled(SpotTileStyle)`
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
  height: 145px;
  color: ${({ theme }) => theme.core.textColor};
`

export const Main = ({ children }: WithChildren) => (
  <MainTileWrapper>
    <MainTileStyle>{children}</MainTileStyle>
  </MainTileWrapper>
)
