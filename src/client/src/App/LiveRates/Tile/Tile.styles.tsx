import styled from "styled-components"
import { DeliveryDate, HeaderAction } from "./Header/TileHeader"
import { TradeButton } from "./PriceButton/PriceButton.styles"

export const AnalyticsPricesFirstCol = "20%"

export const PriceControlsStyle = styled("div")<{
  isAnalyticsView: boolean
}>`
  display: grid;
  position: relative;
  ${({ isAnalyticsView }) =>
    isAnalyticsView
      ? `
      grid-row-gap: 3px;
      height: 90%;
      width: 10rem;
      grid-template-columns: ${AnalyticsPricesFirstCol} 80%;
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
      margin-right: ${({ shouldMoveDate }) =>
        shouldMoveDate ? "1.3rem" : "0"};
    }
  }
`
export const Body = styled.div<{
  isAnalyticsView: boolean
  showTimer: boolean
}>`
  height: 100%;
  display: flex;
  justify-content: space-between;
  ${({ isAnalyticsView, showTimer }) =>
    isAnalyticsView
      ? `
  `
      : `
    flex-direction: column;
    height: 77%;
  `}
`
export const GraphNotionalWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 50%;
`

export const PriceControlWrapper = styled.div`
  grid-area: control;
`

export const SpotTileStyle = styled.div`
  position: absolute;
  border-radius: 3px;
  padding: 1.25rem;
  box-sizing: border-box;
  background-color: ${({ theme }) => theme.core.lightBackground};
  display: flex;
  height: 100%;
  width: 100%;
  justify-content: space-between;
  flex-direction: column;
  overflow: hidden;
  &:hover,
  .tile-hover & {
    background-color: ${({ theme }) =>
      theme.name === "dark"
        ? theme.core.backgroundHoverColor
        : theme.core.lightBackground};
    box-shadow: ${({ theme }) =>
      theme.name === "light" ? "0 0 10px 0 rgba(0, 0, 0, 0.1)" : "none"};
  }
`

const MainTileStyle = styled(SpotTileStyle)`
  background-color: ${({ theme }) => theme.core.lightBackground};
  &:hover,
  .tile-hover & {
    background-color: ${({ theme }) =>
      theme.name === "dark"
        ? theme.core.backgroundHoverColor
        : theme.core.lightBackground};
    box-shadow: ${({ theme }) =>
      theme.name === "light" ? "0 0 10px 0 rgba(0, 0, 0, 0.1)" : "none"};
    ${TradeButton} {
      background-color: ${({ theme }) => theme.core.darkBackground};
    }
  }
`
const MainTileWrapper = styled.div`
  min-height: 11rem;
  position: relative;
  height: 100%;
  width: 100%;
  color: ${({ theme }) => theme.core.textColor};
  &:hover,
  .tile-hover & {
    background-color: ${({ theme }) => theme.core.backgroundHoverColor};
  }
`

export const Main: React.FC = ({ children }) => (
  <MainTileWrapper>
    <MainTileStyle>{children}</MainTileStyle>
  </MainTileWrapper>
)
