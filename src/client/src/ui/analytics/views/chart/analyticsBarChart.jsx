import React from 'react';
import PNLBar from './pnlBar.jsx';
import {  CurrencyPairPosition } from '../../../../services/model';
import _ from 'lodash';

export default class AnalyticsBarChart extends React.Component{

  static propTypes = {
    series: React.PropTypes.array,
    isPnL: React.PropTypes.bool
  };

  render(){
    let bars = this._createBars();
    return (
      <div style={{width: '100%'}}>{bars}</div>
    );
  }

  _createBars(){
    let propName = CurrencyPairPosition.basePnlName;
    let chartData = this.props.series;

    let baseVals = _.map(chartData, propName);
    let maxVal = _.max(baseVals);
    let minVal = _.min(baseVals);

    let maxWidth =  Math.max(Math.abs(maxVal), Math.abs(minVal));
    let bars = chartData.map((ccyPairPosition, index) => {
      return (
        <PNLBar key={index}
                index={index}
                model={ccyPairPosition}
                isPnL={this.props.isPnL}
                maxVal={maxWidth}/>
      );
    });
    return bars;
  };
}
