import React, { Component } from 'react'

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
  justify-content: center;
  background-color: ${({ theme }) => theme.palette.background.primary};
  color: ${({ theme }) => theme.palette.text.primary};
  transition: background-color 0.3s, color 0.3s;
  font-family: ${({ theme }) => theme.fontFamily.primary};
`

const Toolbar = styled('div')`
  padding: 0px 20px;
  height: 60px;
  display: flex;
  flex-direction: row;
  align-items: center;
  background-color: ${({ theme }) => theme.palette.background.secondary};
  color: ${({ theme }) => theme.palette.text.secondary};
  transition: background-color 0.3s, color 0.3s;
  h2 {
    flex: 1;
  }
`

const Content = styled('div')`
  flex: 1;
  position: relative;
  overflow-y: auto;
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
            <h2>{theme === Themes.LIGHT_THEME ? 'Light Theme' : 'Dark Theme'}</h2>
            <button onClick={this.toggleTheme}>Toggle Theme</button>
          </Toolbar>
          <Content>{children}</Content>
        </StyledStory>
      </Theme>
    )
  }
}

export default Story
