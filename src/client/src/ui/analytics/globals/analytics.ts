import { injectGlobal } from 'emotion'
import {
  barBgColor,
  barchartTextColor,
  barHeight,
  negativeColor,
  pointerColor,
  positiveColor,
  transparentColor
} from './variables'

export default injectGlobal`
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

  .analytics__chart-container {
    position: relative;
    background: inherit;
    width: 100%;

    font-size: 0.75rem;
    .nv-lineChart {
      .nv-axis.nv-y {
        text {
          font-size: 0.5rem;
          fill: ${barchartTextColor};
        }
      }

      .nv-axis.nv-x {
        text {
          font-size: 0.5rem;
          fill: ${barchartTextColor};
        }
      }
    }
  }

  .analytics__barchart-container {
    vertical-align: middle;
    padding-top: 2px;
    padding-bottom: 0.75rem;
    height: 50px;
    &:hover {
    }
  }

  .analytics__barchart-bar {
    height: ${barHeight};
    overflow: hidden;
  }

  .analytics__barchart-bar-background {
    height: ${barHeight};
    width: 100%;
    background-color: ${barBgColor};
    position: absolute;
    margin-top: 3px;
  }

  .analytics__barchart-bar-wrapper {
    vertical-align: middle;
    height: 0.5rem;
    position: absolute;
    width: 100%;
    margin-top: 30px;
  }

  .analytics__barchart-border {
    height: 0.5rem;
    width: 2px;
    background-color: currentColor;
  }

  .analytics__barchart-border--center {
    position: absolute;
    left: calc(50% - 2px);
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
    height: 30px;
    position: absolute;

    &:hover {
      .analytics__barchart-pointer-container {
        transform: scale(1.5);
      }

      .analytics__barchart-label {
        font-size: 0.75rem;
        cursor: default;
      }

      .analytics__barchart-label-amount {
        display: none;
      }
      .analytics__barchart-label-amount--hover {
        display: inline;
      }

      .analytics__barchart-label-currency-terms {
        display: none;
      }
    }
  }

  .analytics__barchart-pointer-container {
    position: absolute;
    margin-top: 1.5rem;
    transition: left linear $transition-duration;
    z-index: 99;
  }

  .analytics__barchart-pointer {
    width: 0;
    height: 0;
    border-width: 0.5rem 0.25rem 0 0.25rem;
    border-color: ${pointerColor} transparent transparent transparent;
    border-style: inset;
    transform: rotate(360deg);
    position: absolute;
    z-index: 100;
    left: -6px;
    margin-top: 2px;
  }

  .analytics__barchart-pointer-icon {
    text-shadow: 0px 0px 0 $pointer-color, -1px -1px 0 $pointer-color, 1px -1px 0 $pointer-color,
      -1px 1px 0 $pointer-color, 1px 1px 0 $pointer-color;
    rotation: 90deg;
  }

  .analytics__barchart-pointer--outline {
    position: absolute;
    width: 0;
    height: 0;
    z-index: 99;
    left: -0.5rem;
    border-width: 0.75rem 0.5rem 0 0.5rem;
    border-color: ${pointerColor} transparent transparent transparent;
    border-style: inset;
    transform: rotate(360deg);
  }

  .analytics__barchart-label {
    font-size: 13px;
    margin-top: 3px;
    white-space: nowrap;
  }

  .analytics__barchart-label-amount {
  }

  .analytics__barchart-label-amount--hover {
    display: none;
  }

  .analytics__barchart-label-pusher {
    height: 0.5rem;
    display: inline-block;
    transition: all linear $transition-duration;
  }
  .analytics__barchart-label-wrapper {
    transition: left linear $transition-duration;
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
    font-weight: bold;
    font-size: 12px;
    pointer-events: none;
    select: none;
  }

  .analytics__positions-tooltip {
    position: absolute;
    width: auto;
    height: auto;
    padding: 2px 0.5rem;
    font-size: 0.75rem;
    background-color: currentColor;
    opacity: 1;
    box-shadow: 0.25rem 0.25rem 0.5rem rgba(0, 0, 0, 0.4);
    pointer-events: none;
    z-index: 100;
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
