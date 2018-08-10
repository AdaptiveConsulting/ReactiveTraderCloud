import React from 'react'
import styled from 'react-emotion'

import { ThemeSwitcher } from 'rt-components'
import { Themes } from 'shell/theme'
import Logo from './Logo'

const ADAPTIVE_URL: string = 'http://www.weareadaptive.com'

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
  z-index: 1;
`

const Fill = styled('div')`
  flex: 1;
`

interface Props {
  openLink: (url: string) => void
  toggleTheme: () => void
  theme: Themes
}

class Header extends React.Component<Props> {
  constructor(props: Props) {
    super(props)

    this.openLink = this.openLink.bind(this)
  }

  openLink() {
    const { openLink } = this.props
    openLink(ADAPTIVE_URL)
  }

  render() {
    const { toggleTheme, theme } = this.props

    return (
      <Root>
        <Logo
          size={2}
          // Has no properties in common with React.SFC? 🤔
          // onClick={this.openLink}
        />

        <Fill />
        <ThemeSwitcher toggleTheme={toggleTheme} theme={theme} />
      </Root>
    )
  }
}

export default Header
