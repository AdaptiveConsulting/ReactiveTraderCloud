import React from 'react';
import moment from 'moment';
import { Cell } from 'fixed-data-table';

/**
 * Formatter for cells of type date/time via moment.js
 * @class DateCell
 * @extends {React.Component}
 */
class DateCell extends React.Component {

  static propTypes = {
    format: React.PropTypes.string,
    prefix: React.PropTypes.string,
    field: React.PropTypes.string.isRequired,
    data: React.PropTypes.array.isRequired,
    rowIndex: React.PropTypes.number.isRequired
  }

  render(){
    const { rowIndex, field, data, format = 'MMM Do, HH:mm:ss', prefix = '', ...props } = this.props;
    const formatted = moment(data[rowIndex][field]).format(format);

    return (
      <Cell {...props}>
        {prefix}{formatted}
      </Cell>
    );
  }
}

export default DateCell;
