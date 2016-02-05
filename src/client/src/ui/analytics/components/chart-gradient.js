import React from 'react';
import ReactDOM from 'react-dom';

export default class ChartGradient {

  constructor(){
    this.createGradients();
    this.parentChart;
    this.domainMin;
    this.domainMax;
    this.chartHeight;
    this.parentChartDomElement;
  }


  update(parentChart, domainMin, domainMax, chartHeight){
    this.parentChart = parentChart;
    this.domainMin = domainMin;
    this.domainMax = domainMax;
    this.chartHeight = chartHeight;

    this.verifyDomStructure();
    this.updateStops();
  }

  verifyDomStructure(){
    if (!this.parentChartDomElement){
      this.parentChartDomElement = ReactDOM.findDOMNode(this.parentChart);
    }

    if (this.parentChartDomElement) {

      let nvGroups = this.parentChartDomElement.querySelector('.nv-groups');
      let nvArea;
      let nvStroke;
      let svgNS = 'http://www.w3.org/2000/svg';
      let defs;
      if (nvGroups) {
        nvArea = nvGroups.querySelector('.nv-area');
        nvStroke = nvGroups.querySelector('.nv-line');
        defs = nvGroups.querySelector('defs');
      } else {

        setTimeout(() => {
          this.update(this.parentChart, this.domainMin, this.domainMax, this.chartHeight);
        }, 10);
      }

      if (!defs && nvGroups) {
        //add the defs element here
        defs = document.createElementNS(svgNS, 'defs');
        nvGroups.appendChild(defs);
      }

      if (defs && !(this.linearGradient && this.linearGradient.parentNode == defs)) {
        defs.appendChild(this.linearGradient);
        if (nvArea) {
          if (nvArea.classList.contains('new-chart-area')) {
          } else {
            nvArea.classList.add('new-chart-area');
          }
        }
      }

      if (defs && !(this.strokeGradient.parentNode == defs)){
        defs.appendChild(this.strokeGradient);

        if (nvStroke){
          if (nvStroke.classList.contains('new-chart-stroke')){

          }else{
            nvStroke.classList.add('new-chart-stroke');
          }
        }
      }
    }
  }

  createGradients() {

    //add a linea gradient to the chart
    var svgNS = 'http://www.w3.org/2000/svg';

    //the area linear gradient
    this.linearGradient = document.createElementNS(svgNS, 'linearGradient');
    this.linearGradient.setAttribute('id', 'areaGradient');
    this.linearGradient.setAttribute('x1', '0%');
    this.linearGradient.setAttribute('x2', '0%');
    this.linearGradient.setAttribute('y1', '0%');
    this.linearGradient.setAttribute('y2', '100%');

    let stop1 = document.createElementNS(svgNS, 'stop');
    stop1.setAttribute('id', 'stop1');
    stop1.setAttribute('offset', '0%');
    stop1.setAttribute('stop-color', '#31a354');
    this.linearGradient.appendChild(stop1);

    let stop1End = document.createElementNS(svgNS, 'stop');
    stop1End.setAttribute('id', 'stop1End');
    stop1End.setAttribute('offset', '50%');
    stop1End.setAttribute('stop-color', '#31a354');
    stop1End.setAttribute('stop-opacity', '.06');
    this.linearGradient.appendChild(stop1End);


    var stop2 = document.createElementNS(svgNS, 'stop');
    stop2.setAttribute('id', 'stop2');
    stop2.setAttribute('offset', '50%');
    stop2.setAttribute('stop-color', '#cb181d');
    stop2.setAttribute('stop-opacity', '.1');
    this.linearGradient.appendChild(stop2);
    var stop2End = document.createElementNS(svgNS, 'stop');
    stop2End.setAttribute('id', 'stop2End');
    stop2End.setAttribute('offset', '100%');
    stop2End.setAttribute('stop-color', '#cb181d');
    this.linearGradient.appendChild(stop2End);

    //the stroke linear gradient
    this.strokeGradient = document.createElementNS(svgNS, 'linearGradient');
    this.strokeGradient.setAttribute('id', 'chartStrokeLinearGradient');
    this.strokeGradient.setAttribute('x1', '0%');
    this.strokeGradient.setAttribute('x2', '0%');
    this.strokeGradient.setAttribute('y1', '0%');
    this.strokeGradient.setAttribute('y2', '100%');

    let lineStop1 = document.createElementNS(svgNS, 'stop');
    lineStop1.setAttribute('id', 'lineStop1');
    lineStop1.setAttribute('offset', '0%');
    lineStop1.setAttribute('stop-color', '#31a354');
    this.strokeGradient.appendChild(lineStop1);

    let lineStop1End = document.createElementNS(svgNS, 'stop');
    lineStop1End.setAttribute('id', 'lineStop1End');
    lineStop1End.setAttribute('offset', '50%');
    lineStop1End.setAttribute('stop-color', '#31a354');
    this.strokeGradient.appendChild(lineStop1End);

    var lineStop2 = document.createElementNS(svgNS, 'stop');
    lineStop2.setAttribute('id', 'lineStop2');
    lineStop2.setAttribute('offset', '50%');
    lineStop2.setAttribute('stop-color', '#cb181d');
    this.strokeGradient.appendChild(lineStop2);
    var lineStop2End = document.createElementNS(svgNS, 'stop');
    lineStop2End.setAttribute('id', 'lineStop2End');
    lineStop2End.setAttribute('offset', '100%');
    lineStop2End.setAttribute('stop-color', '#cb181d');
    this.strokeGradient.appendChild(lineStop2End);

  }

  updateStops(){
    //update colour stops
    //need to modify stop1End and stop2
    let fullRange = Math.abs(this.domainMin) + Math.abs(this.domainMax);
    let zeroAt = (this.domainMax/fullRange) * 100 + '%';

    var stopGreenStart = this.linearGradient.querySelector('#stop1');
    var stopGreenEnd = this.linearGradient.querySelector('#stop1End');
    stopGreenStart.setAttribute('offset', '0%');
    stopGreenEnd.setAttribute('offset', zeroAt);

    var stopRedStart = this.linearGradient.querySelector('#stop2');
    var stopRedEnd = this.linearGradient.querySelector('#stop2End');
    stopRedStart.setAttribute('offset', zeroAt);
    stopRedEnd.setAttribute('offset', '100%');

    //modify lineStop1End and lineStop2 for the stroke
    var lineStopGreenStart = this.strokeGradient.querySelector('#lineStop1');
    var lineStopGreenEnd = this.strokeGradient.querySelector('#lineStop1End');
    lineStopGreenStart.setAttribute('offset', '0%');
    lineStopGreenEnd.setAttribute('offset', zeroAt);

    var lineStopRedStart = this.strokeGradient.querySelector('#lineStop2');
    var lineStopRedEnd = this.strokeGradient.querySelector('#lineStop2End');
    lineStopRedStart.setAttribute('offset', zeroAt);
    lineStopRedEnd.setAttribute('offset', '100%');

  }
}
