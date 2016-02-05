import React from 'react';
import ReactDOM from 'react-dom';
import { Container } from '../../common/components';
import numeral from 'numeral';
import _ from 'lodash';

import NVD3Chart from 'react-nvd3';
import d3 from 'd3';
import { serviceContainer, model as serviceModel } from 'services';

// chart type for PnL chart - focus can break due to range. todo: fix
//const LINECHART = 'lineWithFocusChart';
const LINECHART = 'lineChart';

const tooltip = d =>{
  const { value, series } = d,
        formatted = numeral(series[0].value).format('0.0a');
  return `<p><strong>${value}:</strong> ${formatted}</p>`;
};

export default class Analytics extends React.Component {

  displayName = 'Analytics'

  static propTypes = {
    history: React.PropTypes.array,
    positions: React.PropTypes.array
  }

  constructor(props, context){
    super(props, context);
    this.state = {
      tearoff: false,
      lastPos: 'unknown',
      positionType: 'BaseTradedAmount',
      isAnalyticsServiceConnected:false,
      series: [{
        series: 'PNL',
        label: 'PNL',
        area: true,
        color: 'slategray',
        values: []
      }],
      history: [],
      positions: []
    };

    this.chartPnlOptions = {
      xAxis: {
        tickFormat: (d) => d3.time.format('%X')(new Date(d))
      },
      yAxis: {
        tickFormat: d3.format('s'),
      },
      showYAxis: true,
      showXAxis: true,
      showLegend: false,
      useInteractiveGuideline: true,
      duration: 0,
      margin: {
        left: 24,
        top: 0,
        right: 0,
        bottom: 24
      }
    };

    this.chartPositionsOptions = {
      showYAxis: true,
      showXAxis: true,
      showLegend: false,
      useInteractiveGuideline: true,
      // barColor: d3.scale.category20().range(),
      duration: 250,
      showValues: true,
      showControls: false,
      //stacked: true,
      tooltip: {
        enabled: false
      },
      margin: {
        top: 0,
        right: 0,
        bottom: 0
      }
    };
    this._disposables = new Rx.CompositeDisposable();
    this.linearGradient = null;
  }

  componentDidMount() {
    this._observeDataStreams();

    //add a linea gradient to the chart
    var svgNS = 'http://www.w3.org/2000/svg';

    //the area linear gradient
    this.linearGradient = document.createElementNS(svgNS, 'linearGradient');
    this.linearGradient.setAttribute('id', 'myLGID');
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

  componentWillUnmount() {
    this._disposables.dispose();
  }

  _observeDataStreams() {
    this._disposables.add(
      serviceContainer.analyticsService.serviceStatusStream.subscribe(status => {
        this.setState({
          isAnalyticsServiceConnected: status.isConnected
        });
      })
    );
    this._disposables.add(
      serviceContainer.analyticsService.getAnalyticsStream(new serviceModel.AnalyticsRequest('USD')).subscribe(data => {
          this.state.series[0].values = this.formatHistoricData(data.History);
          this.setState({
            history: data.History,
            positions: data.CurrentPositions
          });
        },
        err => { _log.error('Error on analyticsService stream stream', err); }
      )
    );
  }

  tearOff(state){
    this.setState({
      tearoff: state
    });
  }

  formatHistoricData(data = []){
    let lastPos,
      domainMin = 0,
      domainMax = 0;

    const formatted = _(data).filter(item => item && item.UsdPnl != null).map((item, i) => {
      lastPos = item.UsdPnl.toFixed(2);

      domainMin = Math.min(domainMin, item.UsdPnl);
      domainMax = Math.max(domainMax, item.UsdPnl);

      return {
        x: new Date(item.Timestamp),
        y: item.UsdPnl.toFixed(2)
      };
    }).value();

    this.setState({
      lastPos,
      domainMin,
      domainMax
    });

    return formatted;
  }

  /**
   *
   * @param {boolean} asSeries
   * @returns {array}
   */
  getPositionData(asSeries:boolean = false){
    if(asSeries) {
      return this.state.positions.map(pos => {
        return {
          name: pos.Symbol,
          label: pos.Symbol,
          values: [pos]
        };
      });
    } else {
     return [{
       name: 'Pos/PnL',
       values: this.state.positions,
       color: 'slategray'
     }];
    }
  }

  render(){
    if (!this.state.isAnalyticsServiceConnected)
      return <span />;

    const chartHeight = 150;

    const PNLValues = this.state.series[0].values,
          { domainMin, domainMax } = this.state;

    const configurePnLChart = (chart) => {
      chart.yDomain([domainMin, domainMax]).yRange([chartHeight, 0]);
      chart.interactiveLayer.tooltip.contentGenerator(tooltip);
    };

    const configurePositionsChart = (chart) => {
      chart.tooltip.enabled(false);
    };

    const positionsSeries = this.getPositionData();

    const classMap = {
      pnl: this.state.positionType === 'BasePnl' ? 'selected': '',
      pos: this.state.positionType !== 'BasePnl' ? 'selected': ''
    };

    const className = this.state.lastPos > 0 ? 'nv-container' : 'nv-container negative';
    const pnlHeight = Math.min(positionsSeries[0].values.length * 30, 200);

    let domEl = ReactDOM.findDOMNode(this.refs.lineChart);
    if (domEl){
      //console.log(domEl.querySelectorAll('.nv-line'));

      let nvGroups = domEl.querySelector('.nv-groups');
      let nvArea;
      let nvStroke;
      let defs;
      let svgNS = 'http://www.w3.org/2000/svg';
      if (nvGroups){
        nvArea = nvGroups.querySelector('.nv-area');
        nvStroke = nvGroups.querySelector('.nv-line');
        defs = nvGroups.querySelector('defs');
      }

      if (!defs && nvGroups){
        //add the defs element here
        let defs = document.createElementNS(svgNS, 'defs');
        nvGroups.appendChild(defs);
      }

      if (defs && !(this.linearGradient && this.linearGradient.parentNode == defs)){
        defs.appendChild(this.linearGradient);

        if (nvArea ){
          if (nvArea.classList.contains('new-chart-area')){
          }else{
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

      //update colour stops

      //need to modify stop1End and stop2
      let fullRange = Math.abs(domainMin) + Math.abs(domainMax);
      let zeroAt = (domainMax/fullRange) * 100 + '%';

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


    return (
      <Container
        title='analytics'
        className='analytics-container animated fadeIn'
        onTearoff={(state) => this.tearOff(state)}
        tearoff={this.state.tearoff}
        width={400}
        height={600}
        options={{maximizable:true}}>

        <span className='header'>Profit & Loss <small className='text-small'>USD {this.state.lastPos}</small></span>

        <div className={className}>
          {(PNLValues && PNLValues.length) ?
            <NVD3Chart
              ref='lineChart'
              type={LINECHART}
              datum={this.state.series}
              options={this.chartPnlOptions}
              height={170}
              configure={configurePnLChart}/> :
            <div>No PNL data yet</div>}
        </div>

        <span>Positions / PNL</span>
        <div className='buttons'>
          <button
            className={classMap.pnl + ' pull-right btn btn-small btn-default'}
            onClick={() => this.setState({positionType: 'BasePnl'})}>PnL</button>
          <button
            className={classMap.pos + ' pull-right btn btn-small btn-default'}
            onClick={() => this.setState({positionType: 'BaseTradedAmount'})}>Positions</button>
        </div>

        <div className='nv-container clearfix pnlchart' >
          <NVD3Chart
            type='multiBarHorizontalChart'
            datum={positionsSeries}
            options={this.chartPositionsOptions}
            height={pnlHeight}
            x='Symbol'
            configure={configurePositionsChart}
            y={this.state.positionType}/>
        </div>
    </Container>
    );
  }
}
