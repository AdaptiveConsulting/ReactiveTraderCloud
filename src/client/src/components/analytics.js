import React from 'react';
import Container from 'components/container';
import moment from 'moment';
import numeral from 'numeral';
import _ from 'lodash';

import NVD3Chart from 'react-nvd3';
import d3 from 'd3';

const USDPNL = {
  name: 'USD PnL',
  values: [
  ]
};
const lineData = [
  USDPNL
];

export default class Analytics extends React.Component {

  constructor(props, context){
    super(props, context);
    this.state = {
      tearoff: false,
      lastPos: 'unknown',
      series: [{
        series: 'PNL',
        label: 'PNL',
        area: true,
        values: []
      }]
    };
  }

  tearOff(state){
    this.setState({
      tearoff: state
    });
  }

  formatHistoricData(data = []){
    let lastPos;
    const formatted = _(data).filter(item => item && item.UsdPnl != null).map((item, i) => {
      lastPos = item.UsdPnl.toFixed(2);
      return {
        x: new Date(item.Timestamp),
        y: item.UsdPnl.toFixed(2)
      };
    }).value();

    this.setState({
      lastPos
    });

    return formatted;
  }

  componentWillReceiveProps(props){
    this.state.series[0].values = this.formatHistoricData(props.history);
  }

  render(){
    const values = this.state.series[0].values;

    this.state.series[0].values = values;

    const options = {
      xAxis: {
        axisLabel: 'Time',
        tickFormat: (d) => moment(d).format('hh:mm:ss'),
      },
      yAxis: {
        axisLabel: 'PnL',
        tickFormat: d3.format(',.1')
      },
      showYAxis: true,
      showXAxis: false,
      showLegend: false,
      useInteractiveGuideline: false,
      color: d3.scale.category10().range(),
      margin: {
        left: 70,
        bottom: 50
      }
    }

    return <Container title='analytics' className='analytics-container animated slideInRight' onTearoff={(state) => this.tearOff(state)}
                      tearoff={this.state.tearoff} width={400} height={800} options={{maximizable:true}}>

      <span>Profit & Loss <small className="text-small">USD {this.state.lastPos}</small></span>

      <div className="nv-container" ref="container">
        {(values && values.length) ?
          <NVD3Chart type='lineChart' datum={this.state.series} options={options} height="200" /> :
          <div>No PNL data yet</div>}
      </div>
    </Container>;
  }
}
