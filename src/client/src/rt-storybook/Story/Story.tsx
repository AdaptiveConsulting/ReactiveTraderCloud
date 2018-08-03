import React, { Component } from 'react'
import { ThemeSwitcher } from 'rt-components'
import { styled } from 'rt-util'
import { Themes } from 'shell/theme'
import Theme from 'ui/theme/Theme'

const StyledStory = styled('div')`
  position: absolute;
  top: 0px;
  left: 0px;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  background-color: ${({ theme }) => theme.background.primary};
  color: ${({ theme }) => theme.text.primary};
  transition: background-color ${({ theme }) => theme.animationSpeed.normal}ms,
    color ${({ theme }) => theme.animationSpeed.normal}ms;
  will-change: color, background-color;
  font-family: ${({ theme }) => theme.fontFamily.primary};
`

const Toolbar = styled('div')`
  z-index: 9999;
  padding: 0px 20px;
  height: 60px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
  background-color: ${({ theme }) => theme.background.secondary};
  will-change: color, background-color;
  color: ${({ theme }) => theme.text.secondary};
  transition: background-color ${({ theme }) => theme.animationSpeed.normal}ms,
    color ${({ theme }) => theme.animationSpeed.normal}ms;
  h2 {
    flex: 1;
  }
`

const Content = styled('div')`
  display: flex;
  flex: 1;
  position: relative;
  overflow-y: hidden;
`

interface State {
  theme: Themes
}

const initialState: State = {
  theme: Themes.LIGHT_THEME
}
class Story extends Component<{}, State> {
  constructor(props) {
    super(props)
    this.state = initialState

    this.toggleTheme = this.toggleTheme.bind(this)
  }

  toggleTheme() {
    const { theme } = this.state
    this.setState({
      theme: theme === Themes.LIGHT_THEME ? Themes.DARK_THEME : Themes.LIGHT_THEME
    })
  }

  render() {
    const { children } = this.props
    const { theme } = this.state
    return (
      <Theme type={theme}>
        <StyledStory>
          <Toolbar>
            <ThemeSwitcher toggleTheme={this.toggleTheme} theme={theme} type="secondary" />
          </Toolbar>
          <Content>{children}</Content>
        </StyledStory>
      </Theme>
    )
  }
}

export default Story
