import styled from "styled-components/macro"
import { TradeButton } from "./PriceButton/PriceButton.styles"

export const PriceControlsStyle = styled("div")<{
  isAnalyticsView: boolean
}>`
  display: grid;
  ${({ isAnalyticsView }) =>
    isAnalyticsView
      ? `
      grid-template-columns: 20% 80%;
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

export const PanelItem = styled.div`
  flex-grow: 1;
  flex-basis: 20rem;
  position: relative;
`
export const Body = styled.div<{ isAnalyticsView: boolean }>`
  display: grid;
  ${({ isAnalyticsView }) =>
    isAnalyticsView
      ? `
    grid-template-columns: 52% 7% 41%;
    grid-template-rows: 50% 33% 17%;
    grid-template-areas: 
    "chart control control"
    "chart control control"
    "notional control control";
  `
      : `
    grid-template-columns: auto;
    grid-template-rows: 85% 15%;
    grid-template-areas: 
    "control"
    "notional";
    height: 77%;
  `}
`

export const PriceControlWrapper = styled.div`
  grid-area: control;
`

export const LineChartWrapper = styled.div<{ isTimerOn: boolean }>`
  width: 100%;
  height: ${({ isTimerOn }) => (isTimerOn ? "60%" : "80%")};
  grid-area: chart;
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
  &:hover {
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
  &:hover {
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
  color: ${({ theme }) => theme.core.textColor};
  &:hover {
    background-color: ${({ theme }) => theme.core.backgroundHoverColor};
  }
`

export const Main: React.FC = ({ children }) => (
  <MainTileWrapper>
    <MainTileStyle>{children}</MainTileStyle>
  </MainTileWrapper>
)
