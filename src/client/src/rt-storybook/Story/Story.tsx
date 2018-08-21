import React, { Component } from 'react'
import { styled, StyledComponent, ThemeState } from 'rt-theme'

// TODO make styleguide globals?
import 'rt-theme'

class Story extends Component {
  render() {
    const { children } = this.props

    return (
      <ThemeState.Provider name="light">
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
      </ThemeState.Provider>
    )
  }
}

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

const StyledStory = styled.div`
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  background-color: ${p => p.theme.shell.backgroundColor};
  color: ${p => p.theme.shell.textColor};
  transition: background-color ${p => p.theme.motion.duration}ms ${p => p.theme.motion.easing},
    color ${p => p.theme.motion.duration}ms ${p => p.theme.motion.easing};
`

const Toolbar = styled.div`
  z-index: 9999;
  padding: 0 1rem;
  height: 3rem;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
  background-color: ${({ theme }) => theme.component.backgroundColor};
  color: ${({ theme }) => theme.component.textColor};

  transition: background-color ${p => p.theme.motion.duration}ms ${p => p.theme.motion.easing},
    color ${p => p.theme.motion.duration}ms ${p => p.theme.motion.easing};

  h2 {
    flex: 1;
  }
`

const Content = styled.div`
  display: flex;
  flex: 1;
  position: relative;
  overflow-y: hidden;
`

export default Story
