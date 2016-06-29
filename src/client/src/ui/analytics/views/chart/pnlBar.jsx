import React from 'react';
import './../analytics.scss';
import numeral from 'numeral';
import ReactDOM from 'react-dom';
import classnames from 'classnames';


export default class PNLBar extends React.Component{

  static propTypes = {
    index : React.PropTypes.number,
    model: React.PropTypes.object,
    isPnL: React.PropTypes.bool,
    maxVal: React.PropTypes.number,

  };

  componentDidMount(){
    this._refreshState();
  }

  _refreshState(){
    this.setState({updateRequired: true});
  }

  _calculateOffset(){
    if (!this.refs.barChartContainer || !this.refs.lbl) return 0;
    let containerBounds = this.refs.barChartContainer.getBoundingClientRect();
    let labelBounds = this.refs.lbl.getBoundingClientRect();

    let leftPoint = labelBounds.left - containerBounds.left;
    let rightPoint = containerBounds.right - labelBounds.right;

    let offset = leftPoint < 0 ? Math.abs(leftPoint) : rightPoint < 0 ? rightPoint : 0;
    return offset;
  }

  _getPusherRelativePosition(){
    if (!this.refs.barChartContainer || !this.refs.lbl) return 0;

    let containerBounds = this.refs.barChartContainer.getBoundingClientRect().width;
    let labelBounds = this.refs.lbl.getBoundingClientRect().width;

    let availableSpace = (1 - labelBounds/containerBounds) * 100;
    let relativePointerPosition = this._getRelativePointerPosition() - (labelBounds/containerBounds * 50 - 1);
    if (relativePointerPosition < 0){
      relativePointerPosition = 0;
    }

    return relativePointerPosition <= availableSpace ? relativePointerPosition : availableSpace;
  }

  _getRelativePointerPosition(){
    let baseValue = this.props.model.basePnl;
    let isPositive = baseValue > 0;
    let displayValue = Math.abs(baseValue) / this.props.maxVal * 100;
    let xPosRelative = isPositive ? 50 + displayValue /2 : (50 - displayValue /2);
    return xPosRelative;
  }

  _getRenderedLabel(){
    let amount = numeral(this.props.model.basePnl).format('0a').toUpperCase();
    let amountHover = numeral(this.props.model.basePnl).format('0,0');
    let labelText = `(${amount}) ${this.props.model.symbol}`;

    let approxLabelWidth = labelText.length * 8;
    let offset = this._calculateOffset() || -(approxLabelWidth/2);
    let posStyle = {'left': offset};

    return (
      <span ref='lbl' className='analytics__barchart-label' style={posStyle}>
        <span className='analytics__barchart-label-amount'>({amount}) </span>
        <span>{this.props.model.currencyPair.base}</span>
        <span className='analytics__barchart-label-currency-terms'>{this.props.model.currencyPair.terms}</span>
        <span className='analytics__barchart-label-amount--hover'> {amountHover}</span>
      </span>
    );
  }

  render(){
    let label = this._getRenderedLabel();
    let xPosRelative = this._getRelativePointerPosition();
    let xPosRelativePusher = this._getPusherRelativePosition();
    let pointerPosition = {'left': xPosRelative + '%'};
    let pusherStyle = {'width': xPosRelativePusher + '%'};

    return(
      <div ref='barChartContainer' className='analytics__barchart-container'>
        <div>
          <div className='analytics__barchart-title-wrapper'>
            <div className='analytics__barchart-label-wrapper'>
              <div className='analytics__barchart-label-pusher' style={pusherStyle}></div>
              {label}
            </div>

            <div className='analytics__barchart-pointer-container' style={pointerPosition}>
              <div className='analytics__barchart-pointer--outline'/>
              <div className='analytics__barchart-pointer'/>
            </div>
          </div>

          <div className='analytics__barchart-bar-wrapper'>
            <div className='analytics__barchart-bar-background'></div>
            <div className='analytics__barchart-border analytics__barchart-border--left'/>
            <div className='analytics__barchart-border analytics__barchart-border--center'/>
            <div className='analytics__barchart-border analytics__barchart-border--right'/>

          </div>
        </div>
      </div>
    );
  }
}

