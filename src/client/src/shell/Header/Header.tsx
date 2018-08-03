import React from 'react'
import Ink from 'react-ink'

import { ThemeSwitcher } from 'rt-components'
import { styled } from 'rt-util'
import { Themes } from 'shell/theme'

const ADAPTIVE_URL: string = 'http://www.weareadaptive.com'

const HeaderBar = styled('div')`
  width: 100%;
  background-color: ${({ theme }) => theme.header.backgroundColor};
  color: ${({ theme }) => theme.header.textColor};
  height: 55px;
  display: flex;
  align-items: center;
  padding-right: 20px;
`

const Logo = styled('div')`
  position: relative;
  background-image: url(${({ theme }) => theme.header.logo});
  background-repeat: no-repeat;
  width: 190px;
  height: 100%;
  cursor: pointer;
`

const Padding = styled('div')`
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
      <HeaderBar>
        <Logo onClick={this.openLink}>
          <Ink />
        </Logo>
        <Padding />
        <ThemeSwitcher toggleTheme={toggleTheme} theme={theme} />
      </HeaderBar>
    )
  }
}

export default Header
