import React from 'react'
import { styled } from 'rt-theme'
import { Config } from './config'

import { open } from './tools'

export interface LinkProps {
  to: Config
}

const StyledButton = styled.button`
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
`

export class Link extends React.Component<LinkProps> {
  onClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    open(this.props.to)
    event.preventDefault()
  }

  render = () => <StyledButton onClick={this.onClick}>{this.props.children}</StyledButton>
}
