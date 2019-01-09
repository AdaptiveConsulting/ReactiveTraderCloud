import { styled } from 'rt-theme'
import { transparentColor } from '../globals/variables'

export const AnalyticsStyle = styled.div`
  border-radius: 0.25rem;
  flex: 1;
  color: ${({ theme }) => theme.core.textColor};
  background-color: ${({ theme }) => theme.core.lightBackground};
  width: 100%;
  height: 100%;
  position: relative;
  padding: 1rem;
  font-size: 1rem;
  overflow-y: scroll;

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
    fill: ${({ theme }) => theme.template.white.normal};
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
    stop-color: ${({ theme }) => theme.template.green.normal};
    stop-opacity: 0.5;
  }

  .stop1End,
  .lineStop1End {
    stop-color: ${({ theme }) => theme.template.green.normal};
  }

  .stop2,
  .lineStop2 {
    stop-color: ${({ theme }) => theme.template.red.normal};
  }

  .stop2End,
  .lineStop2End {
    stop-color: ${({ theme }) => theme.template.red.normal};
    stop-opacity: 0.5;
  }
`

export const AnalyticsLineChartWrapper = styled.div`
  width: 100%;
  height: 20%;
  margin-top: 20px;
`

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
`

export const Title = styled.div`
  margin-bottom: 1rem;
  width: 84px;
  height: 18px;
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
`

export const Controls = styled('div')`
  opacity: 0;
  transition: opacity 0.2s;

  /* We want to whow the popout icon when we hover over the whole panel */
  ${AnalyticsStyle}:hover & {
    opacity: 0.75;
  }
`

export const PopoutButton = styled('button')`
  .svg-icon {
    stroke: ${({ theme }) => theme.core.textColor};
    fill: ${({ theme }) => theme.core.textColor};
  }
`
