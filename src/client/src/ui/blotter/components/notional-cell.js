import React from 'react';
import numeral from 'numeral';
import { Cell } from 'fixed-data-table';

/**
 * Formatter for cells of type notional/currency
 * @class NotionalCell
 * @extends {React.Component}
 */
class NotionalCell extends React.Component {

  static propTypes = {
    format: React.PropTypes.string,
    suffix: React.PropTypes.string,
    notionalValue: React.PropTypes.number.isRequired,
    className: React.PropTypes.string.isRequired,
    width: React.PropTypes.number.isRequired
  }

  render(){
    const { notionalValue, format = '0,000,000[.]00', suffix = '', className, width } = this.props;
    const formatted = numeral(notionalValue).format(format) + suffix;
    return (<Cell className={className} width={width}>{formatted}</Cell>);
  }
}

export default NotionalCell;
