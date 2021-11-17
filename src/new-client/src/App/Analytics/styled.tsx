import styled from "styled-components"
import { transparentColor } from "./globals/variables"

export const AnalyticsInnerWrapper = styled.div<{ inExternalWindow?: boolean }>`
  width: 100%;
  height: 100%;
  width: 320px;
  margin: auto;
  overflow-y: auto;
  overflow-x: hidden;
  position: relative;
  display: grid;
  grid-template-rows: ${({ inExternalWindow }) =>
    inExternalWindow ? "0 auto" : "46px auto"};
`

export const AnalyticsHeader = styled.header`
  display: grid;
  align-items: center;
  grid-template-columns: 1fr 24px;
  padding: 10px;
  color: ${({ theme }) => theme.core.textColor};
`

export const AnalyticsStyle = styled.div<{ inExternalWindow?: boolean }>`
  border-radius: 0.25rem;
  color: ${({ theme }) => theme.core.textColor};
  background-color: ${({ theme }) => theme.core.lightBackground};
  ${({ inExternalWindow }) =>
    inExternalWindow
      ? `@media (min-width: 640px) {
      display: grid;
      grid-template-rows: repeat(3, auto);
      grid-template-columns: 1fr 1fr;
      grid-gap: 0.5rem;
    }`
      : ``}
  padding: 1rem;
  font-size: 1rem;
  scrollbar-width: thin;
  /* axis */
  .nvd3 .nv-axis path,
  .nvd3 .nv-axis .tick.zero line {
    stroke: ${({ theme }) => theme.core.textColor};
  }

  /* grid */
  .nvd3 .nv-axis line {
    stroke: ${transparentColor};
  }

  .analytics__positions-tooltip {
    position: absolute;
    width: auto;
    height: auto;
    padding: 2px 0.5rem;
    font-size: 0.75rem;
    background-color: ${({ theme }) => theme.core.textColor};
    color: ${({ theme }) => theme.core.lightBackground};
    opacity: 1;
    box-shadow: 0.25rem 0.25rem 0.5rem rgba(0, 0, 0, 0.4);
    pointer-events: none;
    z-index: 1;
  }

  .analytics__positions-label {
    fill: ${({ theme }) => theme.white};
    font-size: 0.6875rem;
    pointer-events: none;
    user-select: none;
  }

  .new-chart-area {
    stroke-width: 2px !important;
    fill: url("#areaGradient");
  }
  .new-chart-stroke {
    stroke: url("#chartStrokeLinearGradient");
  }

  .stop1,
  .lineStop1 {
    stop-color: ${({ theme }) => theme.accents.positive.base};
    stop-opacity: 0.5;
  }

  .stop1End,
  .lineStop1End {
    stop-color: ${({ theme }) => theme.accents.positive.base};
  }

  .stop2,
  .lineStop2 {
    stop-color: ${({ theme }) => theme.accents.negative.base};
  }

  .stop2End,
  .lineStop2End {
    stop-color: ${({ theme }) => theme.accents.negative.base};
    stop-opacity: 0.5;
  }
`

export const AnalyticsLineChartWrapper = styled.div`
  width: 100%;
  min-height: 12.5rem;
  margin-top: 20px;
  margin-bottom: 20px;
`

export const ProfitAndLossHeader = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
`

export const Title = styled.div`
  margin-bottom: 1rem;
  font-size: 15px;
  font-weight: normal;
`

export const HrBar = styled.hr`
  height: 4px;
  color: #282d39;
  background-color: #282d39;
  margin-top: 20px;
  border: none;
`

export const BubbleChart = styled.div`
  text-anchor: middle;
  height: 18rem;
  overflow: hidden;
  position: relative;
`

export const Controls = styled("div")`
  text-align: right;
  opacity: 1;
  transition: opacity 0.2s;
`

export const PopoutButton = styled("button")`
  &:hover {
    .hover-state {
      fill: #5f94f5;
    }
  }
`

export const RightNav = styled.ul`
  align-self: flex-end;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  list-style-type: none;
  list-style: none;
`
