import React from 'react'
import styled from 'react-emotion'

import { ThemeState } from 'rt-theme'

import Logo from './Logo'

const ADAPTIVE_URL: string = 'http://www.weareadaptive.com'

class Header extends React.Component<{
  openLink: (url: string) => void
}> {
  openLink = () => {
    const { openLink } = this.props

    openLink(ADAPTIVE_URL)
  }

  render() {
    return (
      <Root>
        <Logo
          size={2}
          // Has no properties in common with React.SFC? 🤔
          // onClick={this.openLink}
        />

        <Fill />
        <ThemeState.Consumer>
          {({ name, setTheme }) => (
            <IconButton onClick={() => setTheme({ name: name === 'dark' ? 'light' : 'dark' })} type={name || 'primary'}>
              <i className={`fa${name === 'light' ? 'r' : 's'} fa-lightbulb`} />
            </IconButton>
          )}
        </ThemeState.Consumer>
      </Root>
    )
  }
}

const Root = styled('div')`
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

const Fill = styled('div')`
  flex: 1;
`

const IconButton = styled('div')<{ [key: string]: any }>`
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

export default Header
