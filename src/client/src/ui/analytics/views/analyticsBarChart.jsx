import React from 'react';
import PNLBar from './pnlBar.jsx';
import {  CurrencyPairPosition } from '../../../services/model';
import _ from 'lodash';

export default class PNLChart extends React.Component{

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
    const containerWidth = 330;

    let propName = this.props.isPnL ? CurrencyPairPosition.basePnlName : CurrencyPairPosition.baseTradedAmountName;
    let chartData = this.props.isPnL ? this.props.series : this._getPositionsDataFromSeries(propName);

    let maxMinValues = chartData.reduce( (resultObj, element) => {
      resultObj.max = element[propName] > resultObj.max ? element[propName] : resultObj.max;
      resultObj.min = element[propName] < resultObj.min ? element[propName] : resultObj.min;

      return resultObj;
    }, {min: 0, max: 0});

    let ratio = (containerWidth/2) / Math.max(Math.abs(maxMinValues.max), Math.abs( maxMinValues.min));
    let bars = chartData.map((element, index) => {
      if (element[propName] === 0 && !this.props.isPnL) return;
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

  _getPositionsDataFromSeries(propName){
    let positionsPerCcyObj = this.props.series.reduce((resultObj, element) => {
      let ccy = element.symbol.substr(0,3);
      resultObj[ccy] = resultObj[ccy] ? resultObj[ccy] + element[propName] : element[propName];
      return resultObj;
    }, {});

    let positionsPerCcyArr = _.map(positionsPerCcyObj, function(val, key){
      return {symbol: key, [propName]: val};
    });
    return positionsPerCcyArr;
  }
}
