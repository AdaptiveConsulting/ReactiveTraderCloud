import { darken } from 'polished'

import React, { MouseEvent } from 'react'

import { styled } from 'rt-theme'

const PopupContainer = styled.div<{ open: boolean }>`
  display: ${({ open }) => (open ? 'flex' : 'none')};
  position: absolute;
  z-index: 5;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  border-radius: 0.25rem;
  background: ${({ theme }) => theme.core.alternateBackground};
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05),
    0 1rem 3rem -1rem ${props => darken(0.1, props.theme.overlay.backgroundColor)};
`

const PopupPanel = styled.div`
  width: 100%;
  min-width: 16rem;

  position: relative;
  z-index: 1;

  color: ${({ theme }) => theme.core.textColor};
`

const Body = styled.div`
  margin: 1rem 0.25rem;
`

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
