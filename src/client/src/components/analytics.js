import React from 'react';
import Container from 'components/container';
import { LineChart } from 'react-d3';

const lineData = [
  {
    name: "series1",
    values: [ { x: 0, y: 1.75 }, { x: 1, y: 1.783 },  { x: 2, y: 1.76 }, { x: 5, y: 1.81 } ]
  }
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

  render(){
    return <Container title='analytics' className='analytics-container animated slideInRight' onTearoff={(state) => this.tearOff(state)}
               tearoff={this.state.tearoff} width={400} height={400} options={{maximizable:true}}>

      <LineChart data={lineData}
                 legend={!true}
                 width={400}
                 height={400}
                 viewBoxObject={{
                    x: 0,
                    y: 0,
                    width: 600,
                    height: 400
                  }}
                  title="PNL - EURGBP"
                  gridHorizontal={true}/>
    </Container>;
  }
}
