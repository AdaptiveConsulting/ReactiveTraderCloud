import React from 'react';
import PNLBar from './pnlBar.jsx';
import {  CurrencyPairPosition } from '../../../services/model';

export default class PNLChart extends React.Component{

  containerWidth = 330;

  static propTypes = {
    series: React.PropTypes.array,
    isPnL: React.PropTypes.bool
  };

  _createBars(){
    console.log(this.props.series);

    let propName = this.props.isPnL ? CurrencyPairPosition.basePnlName : CurrencyPairPosition.baseTradedAmountName;
    let maxMinValues = this.props.series.reduce( (resultObj, element) => {
      resultObj.max = element[propName] > resultObj.max ? element[propName] : resultObj.max;
      resultObj.min = element[propName] < resultObj.min ? element[propName] : resultObj.min;

      return resultObj;
    }, {min: 0, max: 0});

    let ratio = (this.containerWidth/2) / Math.max(Math.abs(maxMinValues.max), Math.abs( maxMinValues.min));
    let bars = this.props.series.map((element, index) => {
      return <PNLBar index={index} model={element} isPnL={this.props.isPnL} maxMinValues={maxMinValues} ratio={ratio}/>
    });
    return bars;
  };

  render(){
    let bars = this._createBars();

    return (
      <div>{bars}</div>
    )
  }
}
