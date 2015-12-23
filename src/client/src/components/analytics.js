import React from 'react';
import Container from 'components/container';
import moment from 'moment';
import numeral from 'numeral';
import _ from 'lodash';
import { serviceContainer } from 'services';

import NVD3Chart from 'react-nvd3';
import d3 from 'd3';

// chart type for PnL chart - focus can break due to range. todo: fix
//const LINECHART = 'lineWithFocusChart';
const LINECHART = 'lineChart';

const tooltip = (d) =>{
  const { value, series } = d;

  return `<p><strong>${value}:</strong> ${series[0].value}</p>`;
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
      series: [{
        series: 'PNL',
        label: 'PNL',
        area: true,
        color: 'slategray',
        values: []
      }]
    };

    this.chartPnlOptions = {
      xAxis: {
        tickFormat: (d) => d3.time.format('%X')(new Date(d))
      },
      x2Axis: {
        tickFormat: (d) => d3.time.format('%X')(new Date(d))
      },
      yAxis: {
        axisLabel: 'PnL',
        tickFormat: d3.format(',.1'),
      },
      showYAxis: false,
      showXAxis: true,
      showLegend: false,
      useInteractiveGuideline: true,
      duration: 0,
      margin: {
        left: 0,
        top: 0,
        right: 0,
        bottom: 30
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

  componentWillReceiveProps(props){
    this.state.series[0].values = this.formatHistoricData(props.history);
  }

  /**
   *
   * @param {boolean} asSeries
   * @returns {array}
   */
  getPositionData(asSeries:boolean = false){
    return asSeries ? this.props.positions.map((pos) => {
      return {
        name: pos.Symbol,
        label: pos.Symbol,
        values: [pos]
      };
    }) : [{
      name: 'Pos/PnL',
      values: this.props.positions.map((pos) => {
        //pos.Symbol += '\n' + pos[this.state.positionType];
        return pos;
      }),
      color: 'slategray'
    }];
  }

  render(){
    if (!serviceContainer.serviceStatus.analytics.isConnected)
      return <span />;

    let pnl;

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

    return (
      <Container
        title='analytics'
        className='analytics-container animated slideInRight'
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
            height={300}
            x='Symbol'
            configure={configurePositionsChart}
            y={this.state.positionType}/>
        </div>
    </Container>
    );
  }
}
