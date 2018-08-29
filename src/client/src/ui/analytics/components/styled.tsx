import { styled } from 'rt-theme'
import {
  barBgColor,
  negativeColor,
  pointerColor,
  positiveColor,
  transitionDuration,
  transparentColor
} from '../globals/variables'

export const Root = styled.div`
  flex: 1;
  color: ${props => props.theme.shell.textColor};
  height: 100%;

  .analytics__chart-container {
    position: relative;
    background: inherit;
    width: 100%;

    font-size: 0.75rem;
    .nv-lineChart {
      .nv-axis.nv-y {
        text {
          font-size: 0.5rem;
          fill: ${props => props.theme.textColor};
        }
      }

      .nv-axis.nv-x {
        text {
          font-size: 0.5rem;
          fill: ${props => props.theme.textColor};
        }
      }
    }
  }

  .analytics__positions-tooltip {
    position: absolute;
    width: auto;
    height: auto;
    padding: 2px 0.5rem;
    font-size: 0.75rem;
    background-color: ${props => props.theme.shell.textColor};
    color: ${props => props.theme.shell.backgroundColor};
    opacity: 1;
    box-shadow: 0.25rem 0.25rem 0.5rem rgba(0, 0, 0, 0.4);
    pointer-events: none;
    z-index: 1;
  }

  .analytics__container {
    align-self: stretch;
    overflow-x: hidden;
    overflow-y: auto;
    height: 100%;
    padding: 0 1rem;

    #popout-content-container & {
      height: 100%;
    }
  }

  .analytics__barchart-indicator--negative {
    background-color: ${negativeColor};
  }

  .analytics__barchart-indicator--positive {
    background-color: ${positiveColor};
  }

  .analytics__controls {
    float: right;
  }

  .analytics__header {
    font-size: 1rem;
    padding-bottom: 0.5rem;
  }

  .analytics__header-value {
    font-weight: bold;
  }

  .analytics__header-title {
    display: block;
    margin-bottom: 1rem;
    color: currentColor;
  }

  .analytics__header-value--negative {
    color: ${negativeColor};
  }

  .analytics__header-value--positive {
    color: ${positiveColor};
  }

  .analytics__header-title-icon {
    margin-right: 17px;
  }

  .analytics__barchart-container {
    vertical-align: middle;
    padding-top: 0.5rem;
    padding-bottom: 0.75rem;
    height: 3rem;
  }

  .analytics__barchart-bar {
    height: 0.125rem;
    overflow: hidden;
  }

  .analytics__barchart-bar-background {
    height: 0.125rem;
    width: 100%;
    background-color: ${barBgColor};
    position: absolute;
    margin-top: 0.125rem;
    opacity: 0.125;
  }

  .analytics__barchart-bar-wrapper {
    position: absolute;
    height: 0.25rem;
    width: 100%;
    margin-top: 2rem;
    vertical-align: middle;
  }

  .analytics__barchart-border {
    height: 0.325rem;
    width: 0.125rem;
    background-color: currentColor;
    opacity: 0;
  }

  .analytics__barchart-border--center {
    position: absolute;
    left: calc(50% - 0.125rem);
  }

  .analytics__barchart-border--left {
    float: left;
    display: inline;
  }

  .analytics__barchart-border--right {
    right: 0;
    position: absolute;
  }

  .analytics__barchart-title-wrapper {
    width: 100%;
    height: 2rem;
    position: absolute;
  }

  .analytics__barchart-pointer-container,
  .analytics__barchart-label-pusher {
    transition: all ease ${transitionDuration};
  }
  .analytics__barchart-pointer-container {
    position: absolute;
    margin-top: 1.5rem;
    transition: left ease ${transitionDuration};
    z-index: 1;
    mix-blend-mode: exclusion;
  }

  .analytics__barchart-pointer {
    position: absolute;
    width: 0;
    height: 0;
    z-index: 1;
    top: 0.125rem;
    left: -0.375rem;
    border-width: 0.75rem 0.25rem 0 0.25rem;
    border-color: ${pointerColor} transparent transparent transparent;
    border-style: inset;
    border-radius: 50%;
    transform: rotate(360deg);
  }

  .analytics__barchart-label {
    font-size: 0.75rem;
    line-height: 2rem;
    white-space: nowrap;
  }

  .analytics__barchart-label-amount {
    font-weight: 900;
    margin-right: 0.25rem;
  }

  .analytics__barchart-label-pusher {
    height: 0.5rem;
    display: inline-block;
  }
  .analytics__barchart-label-wrapper {
    position: absolute;
    width: 100%;
    white-space: nowrap;
  }

  .analytics__barchart-container .analytics__barchart-amount {
    visibility: hidden;
    font-size: 18px;
    display: inline;
    float: right;
  }

  .analytics__barchart-container:hover .analytics__barchart-amount {
    visibility: visible;
  }

  .analytics__bubblechart-container {
    text-anchor: middle;
    height: 18rem;
  }

  .analytics__chart-title {
    font-size: 1rem;
    line-height: 2rem;
  }

  .analytics__bubblechart-title {
    position: absolute;
  }

  .analytics__bubblechart-container {
    display: block;
    position: relative;
    padding-bottom: 2px;
  }

  .analytics__positions-label {
    fill: currentColor;
    font-size: 0.75rem;
    pointer-events: none;
    select: none;
    user-select: none;
  }

  .new-chart-area {
    stroke-width: 2px !important;
    fill: url('#areaGradient');
  }
  .new-chart-stroke {
    stroke: url('#chartStrokeLinearGradient');
  }

  .analytics__icon--tearoff {
    cursor: pointer;
  }

  .analytics__icon--tearoff--hidden {
    display: none;
    visibility: hidden;
  }

  .stop1,
  .lineStop1 {
    stop-color: ${positiveColor};
    stop-opacity: 0.5;
  }

  .stop1End,
  .lineStop1End {
    stop-color: ${positiveColor};
  }

  .stop2,
  .lineStop2 {
    stop-color: ${negativeColor};
  }

  .stop2End,
  .lineStop2End {
    stop-color: ${negativeColor};
    stop-opacity: 0.5;
  }

  /* axis */
  .analytics__container .nvd3 .nv-axis path,
  .analytics__container .nvd3 .nv-axis .tick.zero line {
    stroke: currentColor;
  }
  /* axis labels */
  .analytics__chart-container .nv-lineChart .nv-axis.nv-x text,
  .analytics__chart-container .nv-lineChart .nv-axis.nv-y text {
    fill: currentColor;
  }
  /* grid */
  .analytics__container .nvd3 .nv-axis line {
    stroke: ${transparentColor};
  }

  .analytics__chart-tooltip {
    font-weight: 500;
    display: block;
    mix-blend-mode: difference !important;
  }

  .analytics__chart-tooltip-date {
    font-weight: 600;
  }

  .analytics__container--disconnected {
    display: flex;
    height: 100%;
    align-items: center;
    justify-content: center;
    font-size: 1rem;
  }
`
