import _ from 'lodash'
import React from 'react'
import styled from 'react-emotion'

import { StyledComponent, ThemeState } from 'rt-theme'

import Logo from './Logo'

class Header extends React.Component {
  onClick = () => window.open('http://wearedaptive.com')

  render() {
    const { children } = this.props
    return (
      <Root>
        <Logo size={2} onClick={this.onClick} />

        <Fill />

        <ThemeControl />
        {children == null ? null : (
          <React.Fragment>
            <Division />
            {children}
          </React.Fragment>
        )}
      </Root>
    )
  }
}

const ThemeControl = props => (
  <ThemeState.Consumer>
    {({ name, setTheme }) => (
      <IconButton onClick={() => setTheme({ name: name === 'dark' ? 'light' : 'dark' })} type={name || 'primary'}>
        <i className={`fa${name === 'light' ? 'r' : 's'} fa-lightbulb`} />
      </IconButton>
    )}
  </ThemeState.Consumer>
)

const Root = styled.div`
  width: 100%;
  max-width: 100%;

  min-height: 3.5rem;
  max-height: 3.5rem;

  padding: 0 1rem;

  display: flex;
  align-items: center;

  background-color: ${({ theme }) => theme.header.backgroundColor};
  color: ${({ theme }) => theme.header.textColor};

  position: relative;
  z-index: 10;

  box-shadow: 0 0.125rem 0 ${({ theme }) => theme.shell.backgroundColor};
`

const Fill = styled.div`
  flex: 1;
  height: 100%;
  /**
    TODO 8/22 extract this extension of header, and the fill outside header layout
  */
  -webkit-app-region: drag;
  cursor: -webkit-grab;
`

const IconButton: StyledComponent = styled.div`
  width: 2rem;
  height: 2rem;
  font-size: 1rem;
  line-height: 1rem;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 50%;

  cursor: pointer;

  transition: background-color ${({ theme }) => theme.motion.duration}ms ${({ theme }) => theme.motion.easing};

  &:hover {
    background-color: ${({ theme }) => theme.button.secondary.active.backgroundColor};
    color: ${({ theme }) => theme.button.secondary.textColor};
  }
`

const Division = styled.div`
  height: 100%;
  padding: 0 1rem;

  display: flex;
  align-items: center;
  justify-content: center;

  &::after {
    content: '';
    display: block;
    width: 0.125rem;
    height: 100%;
    margin-right: -0.125rem;
    background-color: rgba(127, 127, 127, 0.2);
  }
`

export default Header
