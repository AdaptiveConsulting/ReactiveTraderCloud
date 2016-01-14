import React from 'react';
import { time } from 'd3';
import { Cell } from 'fixed-data-table';

/**
 * Formatter for cells of type date/time via moment.js
 * @class DateCell
 * @extends {React.Component}
 */
export default class DateCell extends React.Component {

  static propTypes = {
    format: React.PropTypes.string,
    prefix: React.PropTypes.string,
    field: React.PropTypes.string.isRequired,
    data: React.PropTypes.array.isRequired,
    rowIndex: React.PropTypes.number.isRequired
  }

  render(){
    const { rowIndex, field, data, format = '%b %e, %H:%M:%S', prefix = '', ...props } = this.props;
    const row = data[rowIndex];
    const fieldValue = row[field];
    const formatted = time.format(format)(new Date(fieldValue));

    return (
      <Cell {...props}>
        {prefix}{formatted}
      </Cell>
    );
  }
}
