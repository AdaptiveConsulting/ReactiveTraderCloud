import * as React from 'react'
import * as numeral from 'numeral'

export interface NotionalCellProps {
  format?: string
  suffix?: string
  notionalValue: number
  className: string
  width: number
}

class NotionalCell extends React.Component<NotionalCellProps, {}> {
  render() {
    const { notionalValue, format = '0,000,000[.]00', suffix = '', className, width } = this.props
    const formatted = numeral(notionalValue).format(format) + suffix
    return (<div className={className} style={{ width }}>{formatted}</div>)
  }
}

export default NotionalCell
