import styled from "styled-components"

export const AnalyticsStyle = styled.div<{ inExternalWindow?: boolean }>`
  flex: 1;

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

  .analytics__positions-tooltip {
    position: absolute;
    width: auto;
    height: auto;
    padding: 2px 0.5rem;
    background-color: ${({ theme }) =>
      theme.color["Colors/Foreground/fg-white"]};
    color: ${({ theme }) => theme.color["Colors/Text/text-black"]};
    font-size: ${({ theme }) => theme.typography["Font size/text-xs"]};
    opacity: 1;
    box-shadow: 0.25rem 0.25rem 0.5rem rgba(0, 0, 0, 0.4);
    pointer-events: none;
    z-index: 1;
  }

  .analytics__positions-label {
    fill: ${({ theme }) => theme.color["Colors/Text/text-primary (900)"]};
    font-size: ${({ theme }) => theme.typography["Font size/text-xs"]};
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
`

export const BubbleChartWrapper = styled.div`
  position: relative;
  height: 260px;
  text-anchor: middle;
  overflow: hidden;
`
