import React, { Component } from 'react'
import { styled, ThemeName, TestThemeProvider, TestThemeConsumer } from 'test-theme'

// TODO make styleguide globals?
import 'test-theme'

class Story extends Component {
  render() {
    const { children } = this.props

    return (
      <TestThemeProvider>
        <StyledStory>
          <Toolbar>
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
          </Toolbar>
          <Content>{children}</Content>
        </StyledStory>
      </TestThemeProvider>
    )
  }
}

const IconButton = styled.div<{ type: string }>`
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
