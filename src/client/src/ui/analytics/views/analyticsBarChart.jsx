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

    let baseVals = _.map(chartData, propName);
    let maxVal = _.max(baseVals);
    let minVal = _.min(baseVals);

    let ratio = (containerWidth/2) / Math.max(Math.abs(maxVal), Math.abs(minVal));
    let bars = chartData.map((element, index) => {
      return (
        <PNLBar key={index}
                index={index}
                model={element}
                isPnL={this.props.isPnL}
                ratio={ratio}
                containerWidth={containerWidth}/>
      );
    });
    return bars;
  };

  _getPositionsDataFromSeries(baseAmtPropName){
    let positionsPerCcyObj = this.props.series.reduce((resultObj, el) => {

      //aggregate amount per ccy;
      resultObj[el.ccy] = resultObj[el.ccy] ? resultObj[el.ccy] + el[baseAmtPropName] : el[baseAmtPropName];
      return resultObj;
    }, {});

    //map the object to the array of ccy-amount pairs and exclude 0 base amount
    return _.map(positionsPerCcyObj, (val, key) => {
      return {symbol: key, [baseAmtPropName]: val};
    }).filter((el, index) => el[baseAmtPropName] !== 0);
  }
}
