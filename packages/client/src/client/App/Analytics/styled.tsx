import styled from "styled-components"

import { transparentColor } from "./globals/variables"

export const AnalyticsStyle = styled.div<{ inExternalWindow?: boolean }>`
  color: ${({ theme }) => theme.core.textColor};
  flex: 1;

  overflow-y: hidden;

  ${({ inExternalWindow }) =>
    inExternalWindow
      ? `@media (min-width: 640px) {
      display: grid;
      grid-template-rows: repeat(3, auto);
      grid-template-columns: 1fr 1fr;
      grid-gap: 0.5rem;
    }`
      : ``}

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
    background-color: ${({ theme }) =>
      theme.newTheme.color["Colors/Foreground/fg-white"]};
    color: ${({ theme }) => theme.newTheme.color["Colors/Text/text-black"]};
    font-size: ${({ theme }) => theme.newTheme.typography["Font size/text-xs"]};
    opacity: 1;
    box-shadow: 0.25rem 0.25rem 0.5rem rgba(0, 0, 0, 0.4);
    pointer-events: none;
    z-index: 1;
  }

  .analytics__positions-label {
    fill: ${({ theme }) =>
      theme.newTheme.color["Colors/Text/text-primary (900)"]};
    font-size: ${({ theme }) => theme.newTheme.typography["Font size/text-xs"]};
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

export const BubbleChartWrapper = styled.div`
  position: relative;
  height: 260px;
  text-anchor: middle;
  overflow: hidden;
`
