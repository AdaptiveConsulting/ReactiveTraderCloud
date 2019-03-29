import React from 'react'
import { platform, PlatformProvider } from 'rt-components'
import { styled, ThemeName, ThemeProvider, GlobalStyle, useTheme } from 'rt-theme'

const Story: React.FC = ({ children }) => (
  <>
    <GlobalStyle />
    <ThemeProvider>
      <PlatformProvider value={platform}>
        <StyledStory>
          <StoryToolbar />
          <Content>{children}</Content>
        </StyledStory>
      </PlatformProvider>
    </ThemeProvider>
  </>
)

const StoryToolbar: React.FC = () => {
  const { themeName, toggleTheme } = useTheme()

  return (
    <Toolbar>
      <IconButton onClick={toggleTheme} type={themeName || 'primary'}>
        <i className={`fa${themeName === ThemeName.Light ? 'r' : 's'} fa-lightbulb`} />
      </IconButton>
    </Toolbar>
  )
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
  background-color: ${p => p.theme.core.darkBackground};
  color: ${p => p.theme.core.textColor};
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
  background-color: ${({ theme }) => theme.core.lightBackground};
  color: ${({ theme }) => theme.core.textColor};

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
