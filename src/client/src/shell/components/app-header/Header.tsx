import _ from 'lodash'
import React from 'react'

import { styled, ThemeName, TestThemeConsumer } from 'test-theme'

import Logo from './Logo'

class Header extends React.Component {
  onClick = () => window.open('https://weareadaptive.com/')

  render() {
    const { children } = this.props
    return (
      <Root>
        <Logo size={1.75} onClick={this.onClick} />

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

const ThemeControl = () => (
  <TestThemeConsumer>
    {({ name, setTheme }) => (
      <IconButton
        onClick={() => setTheme({ name: name === ThemeName.Dark ? ThemeName.Light : ThemeName.Dark })}
        type={name || 'primary'}
      >
        <i className={`fa${name === ThemeName.Light ? 'r' : 's'} fa-lightbulb`} />
      </IconButton>
    )}
  </TestThemeConsumer>
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
  height: 3.5rem;
  /**
    TODO 8/22 extract this extension of header, and the fill outside header layout
  */
  -webkit-app-region: drag;
  cursor: -webkit-grab;
`

const IconButton = styled.button<{ type: string }>`
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

  &::before {
    content: '';
    display: block;
    width: 0.125rem;
    height: 100%;
    margin-right: -0.125rem;
    background-color: ${props => props.theme.shell.backgroundColor};
  }
`

export default Header
