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
      <div>{bars}</div>
    );
  }

  _createBars(){
    let propName = CurrencyPairPosition.basePnlName;
    let chartData = this.props.series;

    let baseValues = _.map(chartData, propName);
    let maxValue = _.max(baseValues);
    let minValue = _.min(baseValues);

    let maxWidth =  Math.max(Math.abs(maxValue), Math.abs(minValue));
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
