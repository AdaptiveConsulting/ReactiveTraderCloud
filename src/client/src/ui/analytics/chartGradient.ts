import 'classlist-polyfill';

/**
 * ChartGradient - a utility to draw linear gradients on area and stroke elements of a line chart
 *
 * Note: This code manipulate the DOM elements directly. We are adding extra functionality (gradients) to the SVG elements
 * of the chart component. An option to add gradients to the chart is not available in the component itself, so we have to
 * manipulate the DOM structure once the chart is already rendered.
 *
 * Creates two linear gradients and appends them the to the defs element of the chart.
 * read about the SVG defs:
 * https://developer.mozilla.org/en-US/docs/Web/SVG/Element/defs
 *
 * There are four colour stops: top, bottom, and the two in the middle that have the same offset value
 * (this is a relative value that matches 0 on the PnL scale)
 * On each update call it recalculates the zero position and reapplies the value to the offset attributes of the colour stops
 *
 */
export default class ChartGradient {
  linearGradient: any
  strokeGradient: any
  this: any
  constructor() {
    this.createGradients()
  }

  update(parentChart: Element, domainMin: number, domainMax: number) {
    this.appendLinearGradients(parentChart, domainMin, domainMax)
    this.updateStops(domainMin, domainMax)
  }

  appendLinearGradients(parentChart: Element, domainMin: number, domainMax: number) {
    if (!parentChart) {
      throw new Error('No parent chart element exists')
    }

    const nvGroups = parentChart.querySelector('.nv-groups')
    let nvArea
    let nvStroke
    const svgNS = 'http://www.w3.org/2000/svg'
    let defs
    if (nvGroups) {
      nvArea = nvGroups.querySelector('.nv-area')
      nvStroke = nvGroups.querySelector('.nv-line')
      defs = nvGroups.querySelector('defs')
    } else {
      // very ugly way to wait for dom. leaving as originaly but needs refactor
      setTimeout(() => this.update(parentChart, domainMin, domainMax), 10)
    }

    if (!defs && nvGroups) {
      // add the defs element here
      defs = document.createElementNS(svgNS, 'defs')
      nvGroups.appendChild(defs)
    }

    if (defs && !(this.linearGradient && this.linearGradient.parentNode === defs)) {
      defs.appendChild(this.linearGradient)
      if (nvArea) {
        if (nvArea.classList.contains('new-chart-area')) {
        } else {
          nvArea.classList.add('new-chart-area')
        }
      }
    }

    if (defs && !(this.strokeGradient.parentNode === defs)) {
      defs.appendChild(this.strokeGradient)

      if (nvStroke) {
        if (nvStroke.classList.contains('new-chart-stroke')) {

        } else {
          nvStroke.classList.add('new-chart-stroke')
        }
      }
    }
  }

  createGradients() {

    // add a linea gradient to the chart
    const svgNS = 'http://www.w3.org/2000/svg'

    // the area linear gradient
    this.linearGradient = document.createElementNS(svgNS, 'linearGradient')
    this.linearGradient.setAttribute('id', 'areaGradient')
    this.linearGradient.setAttribute('x1', '0%')
    this.linearGradient.setAttribute('x2', '0%')
    this.linearGradient.setAttribute('y1', '0%')
    this.linearGradient.setAttribute('y2', '100%')

    const stop1 = document.createElementNS(svgNS, 'stop')
    stop1.setAttribute('id', 'stop1')
    stop1.setAttribute('class', 'stop1')
    stop1.setAttribute('offset', '0%')
    this.linearGradient.appendChild(stop1)

    const stop1End = document.createElementNS(svgNS, 'stop')
    stop1End.setAttribute('id', 'stop1End')
    stop1End.setAttribute('class', 'stop1End')
    stop1End.setAttribute('offset', '50%')
    stop1End.setAttribute('stop-opacity', '.06')
    this.linearGradient.appendChild(stop1End)


    const stop2 = document.createElementNS(svgNS, 'stop')
    stop2.setAttribute('id', 'stop2')
    stop2.setAttribute('class', 'stop2')
    stop2.setAttribute('offset', '50%')
    stop2.setAttribute('stop-opacity', '.1')
    this.linearGradient.appendChild(stop2)
    const stop2End = document.createElementNS(svgNS, 'stop')
    stop2End.setAttribute('id', 'stop2End')
    stop2End.setAttribute('offset', '100%')
    this.linearGradient.appendChild(stop2End)

    // the stroke linear gradient
    this.strokeGradient = document.createElementNS(svgNS, 'linearGradient')
    this.strokeGradient.setAttribute('id', 'chartStrokeLinearGradient')
    this.strokeGradient.setAttribute('x1', '0%')
    this.strokeGradient.setAttribute('x2', '0%')
    this.strokeGradient.setAttribute('y1', '0%')
    this.strokeGradient.setAttribute('y2', '100%')

    const lineStop1 = document.createElementNS(svgNS, 'stop')
    lineStop1.setAttribute('id', 'lineStop1')
    lineStop1.setAttribute('class', 'lineStop1')
    lineStop1.setAttribute('offset', '0%')
    this.strokeGradient.appendChild(lineStop1)

    const lineStop1End = document.createElementNS(svgNS, 'stop')
    lineStop1End.setAttribute('id', 'lineStop1End')
    lineStop1End.setAttribute('class', 'lineStop1End')
    lineStop1End.setAttribute('offset', '50%')
    this.strokeGradient.appendChild(lineStop1End)

    const lineStop2 = document.createElementNS(svgNS, 'stop')
    lineStop2.setAttribute('id', 'lineStop2')
    lineStop2.setAttribute('class', 'lineStop2')
    lineStop2.setAttribute('offset', '50%')
    this.strokeGradient.appendChild(lineStop2)
    const lineStop2End = document.createElementNS(svgNS, 'stop')
    lineStop2End.setAttribute('id', 'lineStop2End')
    lineStop2End.setAttribute('class', 'lineStop2End')
    lineStop2End.setAttribute('offset', '100%')
    this.strokeGradient.appendChild(lineStop2End)

  }

  updateStops(domainMin: number, domainMax: number) {
    // update colour stops
    // need to modify stop1End and stop2
    const fullRange = Math.abs(domainMin) + Math.abs(domainMax)
    if (isNaN(fullRange) || fullRange === 0) return
    const zeroAt = (domainMax / fullRange) * 100 + '%'

    const stopGreenStart = this.linearGradient.querySelector('#stop1')
    const stopGreenEnd = this.linearGradient.querySelector('#stop1End')
    stopGreenStart.setAttribute('offset', '0%')
    stopGreenEnd.setAttribute('offset', zeroAt)

    const stopRedStart = this.linearGradient.querySelector('#stop2')
    const stopRedEnd = this.linearGradient.querySelector('#stop2End')
    stopRedStart.setAttribute('offset', zeroAt)
    stopRedEnd.setAttribute('offset', '100%')

    // modify lineStop1End and lineStop2 for the stroke
    const lineStopGreenStart = this.strokeGradient.querySelector('#lineStop1')
    const lineStopGreenEnd = this.strokeGradient.querySelector('#lineStop1End')
    lineStopGreenStart.setAttribute('offset', '0%')
    lineStopGreenEnd.setAttribute('offset', zeroAt)

    const lineStopRedStart = this.strokeGradient.querySelector('#lineStop2')
    const lineStopRedEnd = this.strokeGradient.querySelector('#lineStop2End')
    lineStopRedStart.setAttribute('offset', zeroAt)
    lineStopRedEnd.setAttribute('offset', '100%')

  }
}
