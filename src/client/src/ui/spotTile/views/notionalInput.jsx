import React from 'react';
import numeral from 'numeral';
import { utils } from '../../../system';
import { CurrencyPair } from '../../../services/model';

const MONTHS         = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      NUMERAL_FORMAT = '0,000,000[.]00',
      DOT            = '.';

/**
 * @Class Sizer
 */
export default class NotionalInput extends React.Component {

  static propTypes = {
    className: React.PropTypes.string,
    notional: React.PropTypes.number,
    currencyPair: React.PropTypes.instanceOf(CurrencyPair),
    onChange: React.PropTypes.func
  };

  /**
   * When we mount, get latest date and construct spot date
   */
  componentWillMount(){
    const today = new Date;
    this.SPOTDATE = ['SP.', today.getDate(), MONTHS[today.getMonth()]].join(' ');
  }

  render(){
    const formattedSize = numeral(this.props.notional).format(NUMERAL_FORMAT);

    return (
      <div className={this.props.className}>
        <label>{this.props.currencyPair.base}
          <input className='size' type='text' ref='notionalInput' defaultValue={formattedSize} onChange={(e) => this._setNotionalFromDOMInput(e)}/>
        </label>
        <div className='pull-right'>
          {this.SPOTDATE}
        </div>
      </div>
    );
  }

  /**
   * Sets trade amount. Supports k/m modifiers for 1000s or millions.
   * @param {DOMEvent=} e
   */
  _setNotionalFromDOMInput(e){
    const rawValue    = (this.refs.notionalInput.value || e.target.value).trim();
    const hasdot = rawValue.indexOf(DOT) !== -1;

    let notional = utils.convertNotionalShorthandToNumericValue(rawValue);

    hasdot && (notional += DOT);

    if (!isNaN(notional)){
      // send temp notional back to parent
      this.props.onChange(notional);

      // user may be trying to enter decimals. restore BACK into input
      if (rawValue.indexOf(DOT) === rawValue.length - 1){
        notional = notional + DOT;
      }

      // propagate change back to dom node's value
      this.refs.notionalInput.value = numeral(notional).format(NUMERAL_FORMAT);
    }
  }
}
