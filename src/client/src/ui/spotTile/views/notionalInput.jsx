import React from 'react';
import numeral from 'numeral';
import { utils } from '../../../system';
import classnames from 'classnames';
import { CurrencyPair } from '../../../services/model';
import './notionalInput.scss';
import _ from 'lodash';
const NUMERAL_FORMAT      = '0,000,000[.]00',
      DOT                 = '.',
      ENTER               = 'Enter',
      CHAR_CODE_DOT       = 46,
      CHAR_CODE_0         = 48,
      CHAR_CODE_9         = 57,
      CHAR_CODE_UNIT_SEP  = 31;


export default class NotionalInput extends React.Component {

  static propTypes = {
    className: React.PropTypes.string,
    notional: React.PropTypes.number,
    currencyPair: React.PropTypes.instanceOf(CurrencyPair),
    onChange: React.PropTypes.func,
    maxValue: React.PropTypes.number
  };

  shouldComponentUpdate(nextProps, nextState){
    return this.props.className !== nextProps.className ||
      this.props.notional !== nextProps.notional ||
      this.props.currencyPair.symbol !== nextProps.currencyPair.symbol || // note currencyPair always here
      this.props.onChange !== nextProps.onChange;
  }

  render(){
    const formattedSize = numeral(this.props.notional).format(NUMERAL_FORMAT);
    let classes = classnames(
      'notional',
      this.props.className
    );
    return (
      <div className={classes}>
        <label className='notional__currency-pair' >{this.props.currencyPair.base}</label>
        <input className='notional__size-input'
               type='text'
               ref='notionalInput'
               defaultValue={formattedSize}
               onClick={this._handleSelect}
               onChange={(e) => this._handleInputChange(e)}
               onBlur={(e) => this._handleExitNotionalInput(e)}
               onKeyPress={(e) => this._handleKeyPressNotionalInput(e)}/>
      </div>
    );
  }

  _handleExitNotionalInput(e){
    this._processNotional(e.target.value);
  }

  _handleKeyPressNotionalInput(e){
    let charCode = e.charCode;
    if (e.key === ENTER) {
      this._processNotional(e.target.value);
    }
    else if (charCode === CHAR_CODE_DOT){
      //only allow one dot
      let numDots = _.filter(e.target.value.split(''), (char) => char === '.').length;
      if ( numDots >= 1){
        e.nativeEvent.stopImmediatePropagation();
        e.preventDefault();
      }
    }else if (charCode > CHAR_CODE_UNIT_SEP && (charCode != CHAR_CODE_DOT &&(charCode < CHAR_CODE_0 || charCode > CHAR_CODE_9))){
      if (utils.hasShorthandInput( rawValue)){ //first process input for shortcuts (k/K or m/M)
        this._processNotional(rawValue);
      }else{  //do not allow non-numeric input
        e.nativeEvent.stopImmediatePropagation();
        e.preventDefault();
      }
    }
  }
  
  _processNotional(inputValue){
    inputValue.trim();
    let notional = utils.convertNotionalShorthandToNumericValue(inputValue);
    if (notional >= this.props.maxValue) {
      notional = 0;
    }
    if (!isNaN(notional)){
      // send temp notional back to parent
      this.props.onChange(notional);

      // user may be trying to enter decimals. restore BACK into input
      if (inputValue.indexOf(DOT) === inputValue.length - 1){
        notional = notional + DOT;
      }
      let formattedValue = numeral(notional).format(NUMERAL_FORMAT);
      // propagate change back to dom node's value
      this.refs.notionalInput.value = formattedValue;
    }
  }

  _handleSelect(e) {
    const el = e.target;
    el.setSelectionRange(0, el.value.length);
  }

  _handleInputChange(e){
    const rawValue    = (this.refs.notionalInput.value || e.target.value).trim();
    //check for a shortcut input
    if (utils.hasShorthandInput( rawValue)){
      this._processNotional(rawValue);
    }
  }
}
