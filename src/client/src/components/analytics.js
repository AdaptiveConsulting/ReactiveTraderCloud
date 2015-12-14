import React from 'react';
import Container from 'components/container';
import moment from 'moment';
import { LineChart } from 'react-d3';

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
      tearoff: false
    };
  }

  tearOff(state){
    this.setState({
      tearoff: state
    });
  }

  formatHistoricData(data){
    return data.map((item) => {
      return {
        x: moment(item.Timestamp),
        y: item.UsdPnl + Math.random()
      };
    });
  }

  render(){
    USDPNL.values = this.formatHistoricData(this.props.history);

    return <Container title='analytics' className='analytics-container animated slideInRight' onTearoff={(state) => this.tearOff(state)}
               tearoff={this.state.tearoff} width={400} height={800} options={{maximizable:true}}>

      {(USDPNL.values && USDPNL.values.length) ?
      <LineChart data={lineData}
                 legend={!true}
                 width={380}
                 height={400}
                 viewBoxObject={{
                    x: 0,
                    y: 0,
                    width: 600,
                    height: 400
                  }}
                  title="Profit & Loss - USD"
                  gridHorizontal={true}/> : <div className='alert-warning'>No PNL data yet</div>}
    </Container>;
  }
}
