import React from 'react';
import numeral from 'numeral';
import { utils } from 'system';

const MONTHS         = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      NUMERAL_FORMAT = '0,000,000[.]00',
      DOT            = '.';

/**
 * @Class Sizer
 */
export default class Sizer extends React.Component {

  static propTypes = {
    className: React.PropTypes.string,
    size: React.PropTypes.number,
    pair: React.PropTypes.string,
    onChange: React.PropTypes.func
  };

  /**
   * When we mount, get latest date and construct spot date
   */
  componentWillMount(){
    const today = new Date;
    this.SPOTDATE = ['SP.', today.getDate(), MONTHS[today.getMonth()]].join(' ');
  }

  /**
   * Sets trade amount. Supports k/m modifiers for 1000s or millions.
   * @param {DOMEvent=} e
   */
  _setNotionalFromDOMInput(e){
    const val    = (this.refs.size.value || e.target.value).trim();
    const hasdot = val.indexOf(DOT) !== -1;

    let size = utils.convertNotionalShorthandToNumericValue(val);

    hasdot && (size += DOT);

    if (!isNaN(size)){
      // send temp notional back to parent
      this.props.onChange(size);

      // user may be trying to enter decimals. restore BACK into input
      if (val.indexOf(DOT) === val.length - 1){
        size = size + DOT;
      }

      // propagate change back to dom node's value
      this.refs.size.value = numeral(size).format(NUMERAL_FORMAT);
    }
  }

  render(){
    const formattedSize = numeral(this.props.size).format(NUMERAL_FORMAT);
    const baseCurrency  = this.props.pair.substr(0, 3);

    return (
      <div className={this.props.className}>
        <label>{baseCurrency}
          <input className='size' type='text' ref='size' defaultValue={formattedSize} onChange={(e) => this._setNotionalFromDOMInput(e)}/>
        </label>
        <div className='pull-right'>
          {this.SPOTDATE}
        </div>
      </div>
    );
  }
}
