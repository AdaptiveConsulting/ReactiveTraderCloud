import React from 'react';
import './analytics.scss';
import numeral from 'numeral';
import classnames from 'classnames';


export default class PNLBar extends React.Component{

  static propTypes = {
    index : React.PropTypes.number,
    model: React.PropTypes.object,
    isPnL: React.PropTypes.bool,
    maxVal: React.PropTypes.number,

  }

  render(){
    let baseValue = this.props.isPnL ? this.props.model.basePnl : this.props.model.baseTradedAmount;
    let isPositive = baseValue > 0;
    let displayValue = Math.abs(baseValue) / this.props.maxVal * 100;
    let indicatorClassName = classnames('analytics__barchart-indicator',
      {
        'analytics__barchart-indicator--positive' : isPositive,
        'analytics__barchart-indicator--negative' : !isPositive
      });

    let amountStr = numeral(baseValue).format();
    let ccyPrefix = this.props.isPnL ? this.props.model.currencyPair.base : '';
    let indicatorStyle = { width: displayValue + '%'};

    let indicatorWrapperClassName = classnames( 'analytics__barchart-indicator-wrapper',
      {
        'analytics__barchart-indicator-wrapper--positive' : isPositive,
        'analytics__barchart-indicator-wrapper--negative' : !isPositive
      }
    );
    return(
      <div className='analytics__barchart-container'>
        <div>
          <label className='analytics__barchart-label'>{this.props.model.symbol}</label>
          <label className='analytics__barchart-amount'>{ccyPrefix} {amountStr}</label>
          <span >
            <div className='analytics__barchart-bar-background'></div>
            <div className={indicatorWrapperClassName}>
              <div className={indicatorClassName} style={indicatorStyle}></div>
            </div>

            <label className='analytics__barchart-label'></label>
          </span>
        </div>
      </div>
    );
  }
}
