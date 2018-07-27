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
  align-items: center;
  justify-content: center;
  padding-top: 40px;
`

const Toolbar = styled('div')`
  position: absolute;
  height: 40px;
  top: 0px;
  left: 0px;
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  background-color: white;
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
            <button onClick={this.toggleTheme}>Toggle Theme</button>
          </Toolbar>
          {children}
        </StyledStory>
      </Theme>
    )
  }
}

export default Story
