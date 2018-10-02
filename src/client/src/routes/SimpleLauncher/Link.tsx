import React from 'react'
import { styled } from 'rt-theme'
import { ConfigType } from './config'

import { open } from './tools'

export interface LinkProps {
  is?: React.ComponentType<any>
  to: ConfigType
}

export class Link extends React.Component<LinkProps> {
  static defaultProps = {
    is: styled.button`
      width: 100%;
      height: 100%;
      flex: 1 1 auto;
      font-size: 1.5rem;

      display: flex;
      align-items: center;
      justify-content: center;
      text-decoration: none;
      color: currentColor;
      position: relative;
      z-index: 100;

      &:hover {
        color: ${({ theme }) => theme.button.accent.backgroundColor};
      }
    `,
  }

  onClick = (event: MouseEvent) => {
    open(this.props.to)

    return false
  }

  render() {
    const { is: LinkElement, children } = this.props

    return <LinkElement onClick={this.onClick}>{children}</LinkElement>
  }
}
