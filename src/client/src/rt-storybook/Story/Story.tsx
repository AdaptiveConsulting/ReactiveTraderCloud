import React, { Component } from 'react'
import styled from 'react-emotion'
import { ThemeState } from 'rt-theme'

// TODO make styleguide globals?
import 'rt-theme/globals'

// TODO (8/16/18) remove after removing rt-themes
import * as DeprecatedUITheme from '../../ui/theme'

class Story extends Component {
  render() {
    const { children } = this.props

    return (
      <ThemeState.Provider name="light">
        <DeprecatedUITheme.ThemeProvider>
          <StyledStory>
            <Toolbar>
              <ThemeState.Consumer>
                {({ name, setTheme }) => (
                  <IconButton
                    onClick={() => setTheme({ name: name === 'dark' ? 'light' : 'dark' })}
                    type={name || 'primary'}
                  >
                    <i className={`fa${name === 'light' ? 'r' : 's'} fa-lightbulb`} />
                  </IconButton>
                )}
              </ThemeState.Consumer>
            </Toolbar>
            <Content>{children}</Content>
          </StyledStory>
        </DeprecatedUITheme.ThemeProvider>
      </ThemeState.Provider>
    )
  }
}

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

const StyledStory = styled('div')`
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  background-color: ${({ theme: { background } }) => background.backgroundPrimary};
  color: ${({ theme }) => theme.text.primary};
  transition: background-color ${({ theme }) => theme.animationSpeed.normal}ms,
    color ${({ theme }) => theme.animationSpeed.normal}ms;
`

const Toolbar = styled('div')`
  z-index: 9999;
  padding: 0 1rem;
  height: 3rem;
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

export default Story
