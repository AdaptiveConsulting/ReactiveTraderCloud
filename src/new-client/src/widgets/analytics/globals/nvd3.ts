import { createGlobalStyle } from "styled-components"

import {
  barBgColor,
  gray,
  negativeColor,
  positiveColor,
  strokeColor,
  transitionDuration,
} from "./variables"

export default createGlobalStyle`
  .nvtooltip {
    transition: opacity 50ms linear;
    transition-delay: 200ms;

    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
  }

  .nvd3 {
    color: currentColor !important;
  }

  .nvd3 .nv-axis {
    pointer-events: none;
    opacity: 1;
  }

  .nvd3 .nv-axis path {
    fill: none;
    stroke: currentColor;
    stroke-opacity: 0.5;
    shape-rendering: crispEdges;
  }

  .nvd3 .nv-axis path.domain {
    stroke-opacity: 0.5;
  }

  .nvd3 .nv-axis.nv-x path.domain {
    stroke-opacity: 0;
  }

  .nvd3 .nv-axis line {
    fill: none;
    stroke: ${strokeColor};
    shape-rendering: crispEdges;
    stroke-opacity: 0.5;
  }

  .nvd3 .nv-axis .zero line, .nvd3 .nv-axis line.zero {
    stroke-opacity: 0.5;
  }

  .nvd3 .x .nv-axis .nv-axisMaxMin text,
  .nvd3 .x2 .nv-axis .nv-axisMaxMin text,
  .nvd3 .x3 .nv-axis .nv-axisMaxMin text {
    text-anchor: middle;
  }

  .nvd3 .nv-axis.nv-disabled {
    opacity: 0;
  }

  .nvd3 .nv-bars rect {
    fill-opacity: 0.75;

    transition: fill-opacity ${transitionDuration} ease;
  }

  .nvd3 .nv-bars rect.hover {
    fill-opacity: 1;
  }

  .nvd3 .nv-bars .hover rect {
    fill: lightblue;
  }

  .nvd3 .nv-bars text {
    fill: rgba(0, 0, 0, 0);
  }

  .nvd3 .nv-bars .hover text {
    fill: rgba(0, 0, 0, 1);
  }

  .nvd3 .nv-multibar .nv-groups rect,
  .nvd3 .nv-multibarHorizontal .nv-groups rect,
  .nvd3 .nv-discretebar .nv-groups rect {
    stroke-opacity: 0;

    transition: fill-opacity ${transitionDuration} ease;
  }

  .nvd3 .nv-multibar .nv-groups rect:hover,
  .nvd3 .nv-multibarHorizontal .nv-groups rect:hover,
  .nvd3 .nv-candlestickBar .nv-ticks rect:hover,
  .nvd3 .nv-discretebar .nv-groups rect:hover {
    fill-opacity: 1;
  }

  .nvd3 .nv-discretebar .nv-groups text,
  .nvd3 .nv-multibarHorizontal .nv-groups text {
    font-weight: bold;
    fill: rgba(0, 0, 0, 1);
    stroke: rgba(0, 0, 0, 0);
  }

  /* boxplot CSS */
  .nvd3 .nv-boxplot circle {
    fill-opacity: 0.5;
  }

  .nvd3 .nv-boxplot circle:hover {
    fill-opacity: 1;
  }

  .nvd3 .nv-boxplot rect:hover {
    fill-opacity: 1;
  }

  .nvd3 line.nv-boxplot-median {
    stroke: black;
  }

  .nv-boxplot-tick:hover {
    stroke-width: 2.5rem;
  }
  /* bullet */
  .nvd3.nv-bullet {
    font: 10px sans-serif;
  }
  .nvd3.nv-bullet .nv-measure {
    fill-opacity: 0.8;
  }
  .nvd3.nv-bullet .nv-measure:hover {
    fill-opacity: 1;
  }
  .nvd3.nv-bullet .nv-marker {
    stroke: #000;
    stroke-width: 0.25rem;
  }
  .nvd3.nv-bullet .nv-markerTriangle {
    stroke: #000;
    fill: #fff;
    stroke-width: 1.5rem;
  }
  .nvd3.nv-bullet .nv-tick line {
    stroke: #666;
    stroke-width: 0.5rem;
  }
  .nvd3.nv-bullet .nv-range.nv-s0 {
    fill: #eee;
  }
  .nvd3.nv-bullet .nv-range.nv-s1 {
    fill: #ddd;
  }
  .nvd3.nv-bullet .nv-range.nv-s2 {
    fill: #ccc;
  }
  .nvd3.nv-bullet .nv-title {
    font-size: 1rem;
    font-weight: bold;
  }
  .nvd3.nv-bullet .nv-subtitle {
    fill: #999;
  }

  .nvd3.nv-bullet .nv-range {
    fill: #bababa;
    fill-opacity: 0.4;
  }
  .nvd3.nv-bullet .nv-range:hover {
    fill-opacity: 0.7;
  }

  .nvd3.nv-candlestickBar .nv-ticks .nv-tick {
    stroke-width: 1px;
  }

  .nvd3.nv-candlestickBar .nv-ticks .nv-tick.hover {
    stroke-width: 0.25rem;
  }

  .nvd3.nv-candlestickBar .nv-ticks .nv-tick.positive rect {
    stroke: ${positiveColor};
    fill: ${positiveColor};
  }

  .nvd3.nv-candlestickBar .nv-ticks .nv-tick.negative rect {
    stroke: ${negativeColor};
    fill: ${negativeColor};
  }

  .with-transitions .nv-candlestickBar .nv-ticks .nv-tick {
    transition: stroke-width ${transitionDuration} ease, stroke-opacity ${transitionDuration} ease;
    -moz-transition: stroke-width ${transitionDuration} ease, stroke-opacity ${transitionDuration} ease;
    -webkit-transition: stroke-width ${transitionDuration} ease, stroke-opacity ${transitionDuration} ease;
  }

  .nvd3.nv-candlestickBar .nv-ticks line {
    stroke: #333;
  }

  .nvd3 .nv-legend .nv-disabled rect {
    /*fill-opacity: 0;*/
  }

  .nvd3 .nv-check-box .nv-box {
    fill-opacity: 0;
    stroke-width: 2;
  }

  .nvd3 .nv-check-box .nv-check {
    fill-opacity: 0;
    stroke-width: 4;
  }

  .nvd3 .nv-series.nv-disabled .nv-check-box .nv-check {
    fill-opacity: 0;
    stroke-opacity: 0;
  }

  .nvd3 .nv-controlsWrap .nv-legend .nv-check-box .nv-check {
    opacity: 0;
  }

  /* line plus bar */
  .nvd3.nv-linePlusBar .nv-bar rect {
    fill-opacity: 0.75;
  }

  .nvd3.nv-linePlusBar .nv-bar rect:hover {
    fill-opacity: 1;
  }
  .nvd3 .nv-groups path.nv-line {
    fill: none;
  }

  .nvd3 .nv-groups path.nv-area {
    stroke: none;
  }

  .nvd3.nv-line .nvd3.nv-scatter .nv-groups .nv-point {
    fill-opacity: 0;
    stroke-opacity: 0;
  }

  .nvd3.nv-scatter.nv-single-point .nv-groups .nv-point {
    fill-opacity: 0.5 !important;
    stroke-opacity: 0.5 !important;
  }

  .with-transitions .nvd3 .nv-groups .nv-point {
    transition: stroke-width ${transitionDuration} ease, stroke-opacity ${transitionDuration} ease;
    -moz-transition: stroke-width ${transitionDuration} ease, stroke-opacity ${transitionDuration} ease;
    -webkit-transition: stroke-width ${transitionDuration} ease, stroke-opacity ${transitionDuration} ease;
  }

  .nvd3.nv-scatter .nv-groups .nv-point.hover,
  .nvd3 .nv-groups .nv-point.hover {
    stroke-width: 7px;
    fill-opacity: 0.95 !important;
    stroke-opacity: 0.95 !important;
  }

  .nvd3 .nv-point-paths path {
    stroke: #aaa;
    stroke-opacity: 0;
    fill: #eee;
    fill-opacity: 0;
  }

  .nvd3 .nv-indexLine {
    cursor: ew-resize;
  }

  /*
    * SVG CSS
    */

  /*
    Default CSS for an svg element nvd3 used
    */
  svg.nvd3-svg {
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -khtml-user-select: none;
    -ms-user-select: none;
    -moz-user-select: none;
    user-select: none;
    display: block;
    width: 100%;
    height: 100%;
  }

  /*
    Box shadow and border radius styling
    */
  .nvtooltip {
    background: rgba(68, 76, 95, 0.25) !important;
    border: none !important;
    box-shadow: none !important;
    border-radius: 0.125rem !important;
  }

  .nvtooltip.with-3d-shadow,
  .with-3d-shadow .nvtooltip {
    /* box-shadow: 0 0.5rem 10px rgba(0,0,0,.2); */

    border-radius: 0.25rem;
  }

  .nvd3 text {
    font-size: 1rem;
    fill: ${barBgColor};
  }

  .nvd3 .title {
    font-size: 1rem;
  }

  .nvd3 .nv-background {
    fill: currentColor;
    fill-opacity: 0;
  }

  .nvd3, .nvd3 text, .nvd3.nv-noData {
    font-size: 1rem;
    fill: currentColor;
  }

  /**********
    *  Brush
    */

  .nv-brush .extent {
    fill-opacity: 0.125;
    shape-rendering: crispEdges;
  }

  .nv-brush .resize path {
    fill: currentColor;
    stroke: ${gray};
  }

  /**********
    *  Legend
    */

  .nvd3 .nv-legend .nv-series {
    cursor: pointer;
  }

  .nvd3 .nv-legend .nv-disabled circle {
    fill-opacity: 0;
  }

  /* focus */
  .nvd3 .nv-brush .extent {
    fill-opacity: 0 !important;
  }

  .nvd3 .nv-brushBackground rect {
    stroke: #000;
    stroke-width: 0.4;
    fill: ${gray};
    fill-opacity: 0.7;
  }

  .nvd3.nv-ohlcBar .nv-ticks .nv-tick {
    stroke-width: 1px;
  }

  .nvd3.nv-ohlcBar .nv-ticks .nv-tick.hover {
    stroke-width: 0.25rem;
  }

  .nvd3.nv-ohlcBar .nv-ticks .nv-tick.positive {
    stroke: ${positiveColor};
  }

  .nvd3.nv-ohlcBar .nv-ticks .nv-tick.negative {
    stroke: ${negativeColor};
  }

  .nvd3 .background path {
    fill: none;
    stroke: currentColor;
    stroke-opacity: 0.4;
    shape-rendering: crispEdges;
  }

  .nvd3 .foreground path {
    fill: none;
    stroke-opacity: 0.7;
  }

  .nvd3 .nv-parallelCoordinates-brush .extent {
    fill: currentColor;
    fill-opacity: 0.6;
    stroke: ${gray};
    shape-rendering: crispEdges;
  }

  .nvd3 .nv-parallelCoordinates .hover {
    fill-opacity: 1;
    stroke-width: 3px;
  }

  .nvd3 .missingValuesline line {
    fill: none;
    /* stroke: black; */
    stroke-width: 1;
    stroke-opacity: 1;
    stroke-dasharray: 5, 5;
  }
  .nvd3.nv-pie path {
    stroke-opacity: 0;
    transition: fill-opacity ${transitionDuration} ease, stroke-width ${transitionDuration} ease, stroke-opacity ${transitionDuration} ease;
    -moz-transition: fill-opacity ${transitionDuration} ease, stroke-width ${transitionDuration} ease, stroke-opacity ${transitionDuration} ease;
    -webkit-transition: fill-opacity ${transitionDuration} ease, stroke-width ${transitionDuration} ease, stroke-opacity ${transitionDuration} ease;
  }

  .nvd3.nv-pie .nv-pie-title {
    font-size: 1rem;
    /* fill: rgba(19, 196, 249, 0.59); */
  }

  .nvd3.nv-pie .nv-slice text {
    /* stroke: #000; */
    stroke-width: 0;
  }

  .nvd3.nv-pie path {
    stroke: ${gray};
    stroke-width: 1px;
    stroke-opacity: 1;
  }

  .nvd3.nv-pie .hover path {
    fill-opacity: 0.7;
  }
  .nvd3.nv-pie .nv-label {
    pointer-events: none;
  }
  .nvd3.nv-pie .nv-label rect {
    fill-opacity: 0;
    stroke-opacity: 0;
  }

  /* scatter */
  .nvd3 .nv-groups .nv-point.hover {
    stroke-width: 1rem;
    stroke-opacity: 0.5;
  }

  .nvd3 .nv-scatter .nv-point.hover {
    fill-opacity: 1;
  }
  .nv-noninteractive {
    pointer-events: none;
  }

  .nv-distx,
  .nv-disty {
    pointer-events: none;
  }

  /* sparkline */
  .nvd3.nv-sparkline path {
    fill: none;
  }

  .nvd3.nv-sparklineplus g.nv-hoverValue {
    pointer-events: none;
  }

  .nvd3.nv-sparklineplus .nv-hoverValue line {
    /* stroke: #333; */
    stroke-width: 1.5rem;
  }

  .nvd3.nv-sparklineplus,
  .nvd3.nv-sparklineplus g {
    pointer-events: all;
  }

  .nvd3 .nv-hoverArea {
    fill-opacity: 0;
    stroke-opacity: 0;
  }

  .nvd3.nv-sparklineplus .nv-xValue,
  .nvd3.nv-sparklineplus .nv-yValue {
    stroke-width: 0;
    font-size: 0.5rem;
    font-weight: normal;
  }

  .nvd3.nv-sparklineplus .nv-yValue {
    stroke: ${negativeColor};
  }

  .nvd3.nv-sparklineplus .nv-maxValue {
    stroke: ${positiveColor};
    fill: ${positiveColor};
  }

  .nvd3.nv-sparklineplus .nv-minValue {
    stroke: ${negativeColor};
    fill: ${negativeColor};
  }

  .nvd3.nv-sparklineplus .nv-currentValue {
    font-weight: bold;
    font-size: 1.1em;
  }
  /* stacked area */
  .nvd3.nv-stackedarea path.nv-area {
    fill-opacity: 0.7;
    stroke-opacity: 0;
    transition: fill-opacity ${transitionDuration} ease, stroke-opacity ${transitionDuration} ease;
    -moz-transition: fill-opacity ${transitionDuration} ease, stroke-opacity ${transitionDuration} ease;
    -webkit-transition: fill-opacity ${transitionDuration} ease, stroke-opacity ${transitionDuration} ease;
  }

  .nvd3.nv-stackedarea path.nv-area.hover {
    fill-opacity: 0.9;
  }

  .nvd3.nv-stackedarea .nv-groups .nv-point {
    stroke-opacity: 0;
    fill-opacity: 0;
  }

  /*Give tooltips that old fade in transition by
        putting a "with-transitions" class on the container div.
    */
  .nvtooltip.x-nvtooltip,
  .nvtooltip.y-nvtooltip {
    padding: 0.25rem;
  }

  .nvtooltip h3 {
    margin: 0;
    padding: 0.25rem 1rem;
    line-height: 1rem;
    font-weight: normal;
    color: currentColor;
    text-align: center;

    border-radius: 0.5rem 0.5rem 0 0;
  }

  .nvtooltip p {
    margin: 0;
    padding: 0.25rem;
    font-size: 0.75rem;
    text-align: center;
  }

  .nvtooltip span {
    display: inline-block;
    margin: 0.125rem 0;
  }

  .nvtooltip table {
    /* background: transparent; */
    margin: 0.5rem;
    border-spacing: 0;
  }

  .nvtooltip table td {
    padding: 0.25rem 0.5rem 0.25rem 0;
    vertical-align: middle;
  }

  .nvtooltip table td.key {
    font-weight: normal;
  }
  .nvtooltip table td.value {
    text-align: right;
    font-weight: bold;
  }

  .nvtooltip table tr.highlight td {
    padding: 1px 0.5rem 1px 0;
    border-bottom-style: solid;
    border-bottom-width: 1px;
    border-top-style: solid;
    border-top-width: 1px;
  }

  .nvtooltip table td.legend-color-guide div {
    width: 8px;
    height: 8px;
    vertical-align: middle;
  }

  .nvtooltip table td.legend-color-guide div {
    width: 10.25rem;
    height: 10.25rem;
    border: 1px solid #999;
  }

  .nvtooltip .footer {
    padding: 3px;
    text-align: center;
  }

  .nvtooltip-pending-removal {
    pointer-events: none;
    display: none;
  }

  .nvd3 .nv-interactiveGuideLine {
    pointer-events: none;
  }
  .nvd3 line.nv-guideline {
    stroke: currentColor;
  }
`
