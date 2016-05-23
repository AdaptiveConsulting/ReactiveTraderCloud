import React from 'react';
import PNLBar from './pnlBar.jsx';
import {  CurrencyPairPosition } from '../../../services/model';
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
    let propName = this.props.isPnL ? CurrencyPairPosition.basePnlName : CurrencyPairPosition.baseTradedAmountName;
    let chartData = this.props.isPnL ? this.props.series : this._getPositionsDataFromSeries(propName);

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

  _getPositionsDataFromSeries(baseAmtPropName):Array<{symbol:string, baseAmount:number}>{
    let positionsPerCcyObj = this.props.series.reduce((aggregatedPositionsObj, ccyPairPosition) => {

      //aggregate amount per ccy;
      let baseCurrency = ccyPairPosition.currencyPair.base;
      aggregatedPositionsObj[baseCurrency] = aggregatedPositionsObj[baseCurrency]
        ? aggregatedPositionsObj[baseCurrency] + ccyPairPosition[baseAmtPropName] : ccyPairPosition[baseAmtPropName];

      return aggregatedPositionsObj;
    }, {});

    //map the object to the array of ccy-amount pairs and exclude 0 base amount
    return _.map(positionsPerCcyObj, (val, key) => {
      return {symbol: key, [baseAmtPropName]: val};
    }).filter((positionPerCcy, index) => positionPerCcy[baseAmtPropName] !== 0);
  }
}
