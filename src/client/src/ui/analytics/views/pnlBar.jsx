import React from 'react';
import './analytics.scss';

export default class PNLBar extends React.Component{

  containerWidth = 330;

  static propTypes = {
    index : React.PropTypes.number,
    model: React.PropTypes.object,
    isPnL: React.PropTypes.bool,
    maxMinValues: React.PropTypes.object,
    ratio: React.PropTypes.ratio
  }

  render(){
    let baseValue = this.props.isPnL ? this.props.model.basePnl : this.props.model.baseTradedAmount;
    let isPositive = baseValue > 0;
    let displayValue = Math.abs(baseValue * this.props.ratio);
    let xPos = isPositive ? this.containerWidth/2 : (this.containerWidth/2 - displayValue);
    let clName = isPositive ? 'analytics__barchart-indicator-green' : 'analytics__barchart-indicator-red';

    return(
      <div className='analytics__barchart-container'>
        <div>
          <label className='analytics__barchart-label'>{this.props.model.symbol}</label>
          <label className='barchart-tradedamount'>{this.props.model.baseTradedAmount}</label>
          <span>
            <svg id='container' className='analytics__barchart-bar' width={this.containerWidth} height='12'>
              <g>
                <rect height='12' width={this.containerWidth} className='analytics__barchart-background'></rect>
                <rect height='12' width={displayValue} className={clName} x={xPos}></rect>
                </g>
            </svg>
            <label className='analytics__barchart-label'></label>
          </span>
        </div>
      </div>
    )
  }
}
