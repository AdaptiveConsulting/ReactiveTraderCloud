import * as React from 'react'
import * as classNames from 'classnames'
import { SplitDirection } from './Resizer'

interface PaneProps {
  className: string
  split: SplitDirection
}

interface PaneState {
  size: number | string
}

export default class Pane extends React.Component<PaneProps, PaneState> {

  state = {} as PaneState

  render() {

    const { children, className, split } = this.props

    const containerClass = classNames('pane', split, className)

    return <div className={containerClass} style={this.getStyle()}>
      {children}
    </div>
  }

  private getStyle = ():any => {
    const { size } = this.state
    const { split } = this.props
    const style:any = {
      flex: 1,
      position: 'relative',
      outline: 'none'
    }

    if (size !== undefined) {
      if (split === 'vertical') {
        style.width = size
      } else {
        style.height = size
        style.display = 'flex'
      }
      style.flex = 'none'
    }
    return style
  }

}
