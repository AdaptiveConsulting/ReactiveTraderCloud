import * as React from 'react'

export interface DateCellProps {
  classname: string
  formattedValue: string
}

export default class DateCell extends React.Component<DateCellProps, {}> {

  render() {
    const { formattedValue, classname } = this.props
    return <div className={classname} style={{ width: '100%' }}>{formattedValue}</div>
  }
}
