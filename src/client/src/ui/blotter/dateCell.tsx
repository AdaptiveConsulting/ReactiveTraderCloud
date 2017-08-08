import * as React from 'react'
import { timeFormat } from 'd3-time-format'

export interface DateCellProps {
  format?: string
  prefix?: string
  dateValue: Date
  width: number
}

export default class DateCell extends React.Component<DateCellProps, {}> {

  render() {
    const { dateValue, format = '%e-%b %H:%M:%S', prefix = '', width } = this.props
    const formatted = timeFormat(format)(dateValue)
    return (<div style={{ width }}>{prefix}{formatted}</div>)
  }
}
