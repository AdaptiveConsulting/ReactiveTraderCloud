import * as React from 'react'
import './blotterRenderers.scss'

interface NumericRendererProps {
  value: number | string | undefined | null
}

export default class NumericValuesAlignedDecimalPoints extends React.Component<NumericRendererProps, {}> {
  render() {
    const valueStr = this.props.value ? this.props.value.toString() : ''
    const elements = valueStr.split('.')
    const leftEl = elements.length > 0 ? elements[0] : ''
    const rightEl = elements.length > 1 ? `.${elements[1]}` : ''
    return(
      <div className="numericDecimalContainer">
        <div className="numericAlignRight">{ leftEl }</div>
        <div className="numericAlignLeft">{ rightEl }</div>
      </div>
    )
  }
}
