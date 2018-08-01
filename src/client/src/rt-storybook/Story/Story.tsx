import React, { Component } from 'react'
import Ink from 'react-ink'

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
  transition: background-color ${({ theme }) => theme.animationSpeed.normal},
    color ${({ theme }) => theme.animationSpeed.normal};
  will-change: color, background-color;
  font-family: ${({ theme }) => theme.fontFamily.primary};
`

const Toolbar = styled('div')`
  padding: 0px 20px;
  height: 60px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
  background-color: ${({ theme }) => theme.background.secondary};
  will-change: color, background-color;
  color: ${({ theme }) => theme.text.secondary};
  transition: background-color ${({ theme }) => theme.animationSpeed.normal},
    color ${({ theme }) => theme.animationSpeed.normal};
  h2 {
    flex: 1;
  }
`

const IconButton = styled('div')`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color ${({ theme }) => theme.animationSpeed.normal};
  cursor: pointer;
  position: relative;
  will-change: background-color;
  &&:hover {
    background-color: ${({ theme }) => theme.palette.secondary[1]};
  }
  > i {
    font-size: ${({ theme }) => theme.fontSize.h2};
  }
`

const Content = styled('div')`
  display: flex;
  flex: 1;
  position: relative;
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
            <IconButton onClick={this.toggleTheme}>
              <Ink />
              <i className={`fa${theme === Themes.LIGHT_THEME ? 'r' : 's'} fa-lightbulb`} />
            </IconButton>
          </Toolbar>
          <Content>{children}</Content>
        </StyledStory>
      </Theme>
    )
  }
}

export default Story
