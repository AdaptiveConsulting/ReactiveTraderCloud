import styled from "styled-components/macro"
import { TileBaseStyle, TileWrapperBase } from "../styled"

export const AnalyticsTileContent = styled.div`
  display: flex;
  height: 90%;
  justify-content: space-between;
`
export const GraphNotionalWrapper = styled.div<{ isTimerOn: boolean }>`
  min-width: 0; //fixed bug with recharts resizing
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  z-index: 2;
  max-height: ${({ isTimerOn }) => isTimerOn && "103px"};
`
export const PriceControlWrapper = styled.div`
  display: flex;
  width: 160px;
`
export const LineChartWrapper = styled.div<{ isTimerOn: boolean }>`
  width: 100%;
  height: ${({ isTimerOn }) => (isTimerOn ? "60%" : "80%")};
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

export const AnalyticsTileStyle = styled(SpotTileStyle)`
  background-color: ${({ theme }) => theme.core.lightBackground};
  &:hover {
    background-color: ${({ theme }) =>
      theme.name === "dark"
        ? theme.core.backgroundHoverColor
        : theme.core.lightBackground};
    box-shadow: ${({ theme }) =>
      theme.name === "light" ? "0 0 10px 0 rgba(0, 0, 0, 0.1)" : "none"};
  }
`
export const AnalyticsTileWrapper = styled(TileWrapperBase)`
  min-height: 11rem;
  position: relative;
  height: 100%;
  &:hover {
    background-color: ${({ theme }) => theme.core.backgroundHoverColor};
  }
`
