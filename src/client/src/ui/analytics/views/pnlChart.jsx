import React from 'react';
import PNLBar from './pnlBar.jsx';
import {  CurrencyPairPosition } from '../../../services/model';

export default class PNLChart extends React.Component{

  static propTypes = {
    series: React.PropTypes.array,
    isPnL: React.PropTypes.bool
  };

  _createBars(){

    const containerWidth = 330;
    let propName = this.props.isPnL ? CurrencyPairPosition.basePnlName : CurrencyPairPosition.baseTradedAmountName;
    let maxMinValues = this.props.series.reduce( (resultObj, element) => {
      resultObj.max = element[propName] > resultObj.max ? element[propName] : resultObj.max;
      resultObj.min = element[propName] < resultObj.min ? element[propName] : resultObj.min;

      return resultObj;
    }, {min: 0, max: 0});

    let ratio = (containerWidth/2) / Math.max(Math.abs(maxMinValues.max), Math.abs( maxMinValues.min));
    let bars = this.props.series.map((element, index) => {
      return (
        <PNLBar key={index}
                index={index}
                model={element}
                isPnL={this.props.isPnL}
                maxMinValues={maxMinValues}
                ratio={ratio}
                containerWidth={containerWidth}/>
      );
    });
    return bars;
  };

  render(){
    let bars = this._createBars();
    return (
      <div>{bars}</div>
    );
  }
}
