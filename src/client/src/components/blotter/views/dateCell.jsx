import React from 'react';
import { time } from 'd3';
import { Cell } from 'fixed-data-table';

export default class DateCell extends React.Component {

  static propTypes = {
    format: React.PropTypes.string,
    prefix: React.PropTypes.string,
    dateValue: React.PropTypes.instanceOf(Date).isRequired,
    width: React.PropTypes.number.isRequired
  }

  render(){
    const { dateValue, format = '%b %e, %H:%M:%S', prefix = '', width } = this.props;
    const formatted = time.format(format)(dateValue);
    return (<Cell width={width}>{prefix}{formatted}</Cell>);
  }
}
