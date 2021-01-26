import styled from "styled-components/macro"
import { TileBaseStyle, TileWrapperBase } from "./styled"
import { TradeButton } from "./PriceButton/PriceButtonStyles"

export const TileBodyWrapper = styled.div<{ isAnalyticsView: boolean }>`
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

export const NotionalInputWrapper = styled("div")<{
  isAnalyticsView: boolean
}>`
  display: flex;
  align-items: center;
  grid-area: notional;
  ${({ isAnalyticsView }) =>
    isAnalyticsView
      ? ``
      : `
      justify-content: center;
    `}
`

export const SpotTileStyle = styled(TileBaseStyle)`
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

export const MainTileStyle = styled(SpotTileStyle)`
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
export const MainTileWrapper = styled(TileWrapperBase)`
  min-height: 11rem;
  position: relative;
  height: 100%;
  &:hover {
    background-color: ${({ theme }) => theme.core.backgroundHoverColor};
  }
`
export const InputWrapper = styled.div`
  display: grid;
  grid-template-columns: 30px auto 30px;
  grid-template-areas: "Currency Input ResetInputValue" ". Message .";
  align-items: center;

  grid-template-rows: 23px 13px;
  margin-bottom: -0.5rem;
`
