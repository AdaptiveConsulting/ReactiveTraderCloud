import { styled } from 'rt-theme'
import { css } from 'emotion'
import { transparentColor } from '../globals/variables'

export const AnalyticsStyle = styled.div`
  border-radius: 0.25rem;
  flex: 1;
  color: ${({ theme }) => theme.analytics.textColor};
  background-color: ${({ theme }) => theme.analytics.backgroundColor};
  width: 100%;
  height: 100%;
  position: relative;
  padding: 1rem;
  font-size: 1rem;
  overflow-y: scroll;

  /* axis */
  .nvd3 .nv-axis path,
  .nvd3 .nv-axis .tick.zero line {
    stroke: ${({ theme }) => theme.analytics.textColor};
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
    background-color: ${({ theme }) => theme.analytics.textColor};
    color: ${({ theme }) => theme.analytics.backgroundColor};
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
    fill: url('#areaGradient');
  }
  .new-chart-stroke {
    stroke: url('#chartStrokeLinearGradient');
  }

  .stop1,
  .lineStop1 {
    stop-color: ${({ theme }) => theme.analytics.green.normal};
    stop-opacity: 0.5;
  }

  .stop1End,
  .lineStop1End {
    stop-color: ${({ theme }) => theme.analytics.green.normal};
  }

  .stop2,
  .lineStop2 {
    stop-color: ${({ theme }) => theme.analytics.red.normal};
  }

  .stop2End,
  .lineStop2End {
    stop-color: ${({ theme }) => theme.analytics.red.normal};
    stop-opacity: 0.5;
  }
`

export const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.5rem;
`
//TODO ML 04/12 Generalize font-family, weight, and anything with normal by moving them to the theme? , font-family,
export const fontStyle = css`
  font-family: Lato;
  font-style: normal;
  font-stretch: normal;
  line-height: normal;
  letter-spacing: normal;
`

export const Title = styled.div`
  width: 84px;
  height: 18px;
  font-size: 15px;
  font-weight: normal;
  composes: ${fontStyle};
`
export const LastPositionWrapper = styled.div``
export const USDspan = styled.span`
  width: 29px;
  height: 17px;
  opacity: 0.6;
  font-size: 14px;
  composes: ${fontStyle};
  margin-right: 10px;
  color: #ffffff;
`
export const LastPositionStyle = styled.span<{ color?: string }>`
  width: 44px;
  height: 17px;
  font-size: 14px;
  composes: ${fontStyle};
  color: ${({ theme, color }) => color && theme.analytics[color].normal};
  margin: 0.5rem 0;
`
export const HrBar = styled.hr`
  height: 4px;
  color: #282d39;
  background-color: #282d39;
  margin-top: 20px;
  border: none;
`

export const ToolTipStyle = styled.div`
  background-color: #14161c;
  width: 116px;
  height: 30px;
  border-radius: 3px;
  font-size: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
`

export const ToolTipChildLeft = styled.div`
  width: 52px;
  height: 12px;
  opacity: 0.6;
  font-size: 8px;
  composes: ${fontStyle};
  margin-left: 2px;
`
export const ToolTipChildRight = styled.div`
  width: 30px;
  height: 12px;
  font-size: 9px;
  composes: ${fontStyle};
  margin: 0;
`

export const BubbleChart = styled.div`
  text-anchor: middle;
  height: 18rem;
`
export const AnalyticsLineChartWrapper = styled.div`
  width: 100%;
  height: 20%;
`

export const AnalyticsLineChartStyle = styled.div`
  width: 100%;
  height: 100%;
  margin: auto;
  .recharts-cartesian-axis-ticks {
    color: #ffffff;
    width: 52px;
    height: 12px;
    opacity: 1;
    font-size: 10px;
    composes: ${fontStyle};
  }
`
export const Controls = styled('div')`
  position: absolute;
  right: 0;
  top: 0;
  opacity: 0;
  transition: opacity 0.2s;
  padding: 0.25rem;

  ${AnalyticsStyle}:hover & {
    opacity: 0.75;
  }
`

export const PopoutButton = styled('button')`
  .svg-icon {
    stroke: ${({ theme }) => theme.analytics.textColor};
    fill: ${({ theme }) => theme.analytics.textColor};
  }
`
