import React, { MouseEvent } from 'react'
import { PopupContainer, PopupPanel, Body } from './styled'

interface Props {
  className?: string
  open?: boolean
  onClick?: (e: MouseEvent<HTMLDivElement>) => void
}

export default class Popup extends React.Component<Props> {
  constructor(props: Props) {
    super(props)
    this.onClick = this.onClick.bind(this)
  }

  onClick(e: MouseEvent<HTMLDivElement>) {
    const { onClick } = this.props
    if (onClick) {
      onClick(e)
    }
  }

  render() {
    const { className, open = false, children } = this.props
    return (
      <PopupContainer className={className} open={open} onClick={this.onClick}>
        <PopupPanel>
          <Body>{children}</Body>
        </PopupPanel>
      </PopupContainer>
    )
  }
}
