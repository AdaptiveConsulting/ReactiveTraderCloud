import React from 'react';
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
    positions: React.PropTypes.array,
    onTearoff: React.PropTypes.func
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
  }

  componentDidMount() {
    this._observeDataStreams();
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

    this.props.onTearoff && this.props.onTearoff(state);
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

    const PNLValues = this.state.series[0].values,
          { domainMin, domainMax } = this.state;

    const configurePnLChart = (chart) => {
      chart.yDomain([domainMin, domainMax]).yRange([150, 0]);
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
