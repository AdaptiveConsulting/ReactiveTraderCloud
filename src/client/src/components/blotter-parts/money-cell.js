import React from 'react';
import numeral from 'numeral';
import { Cell } from 'fixed-data-table';

/**
 * Formatter for cells of type notional/currency
 * @class MoneyCell
 * @extends {React.Component}
 */
class MoneyCell extends React.Component {

  static propTypes = {
    format: React.PropTypes.string,
    suffix: React.PropTypes.string,
    field: React.PropTypes.string.isRequired,
    data: React.PropTypes.array.isRequired,
    rowIndex: React.PropTypes.number.isRequired
  }

  render(){
    const { rowIndex, field, data, format = '0,000,000[.]00', suffix = '', ...props } = this.props;
    const formatted = numeral(data[rowIndex][field]).format(format) + suffix;

    return (
      <Cell {...props}>
        {formatted}
      </Cell>
    );
  }
}

export default MoneyCell;
