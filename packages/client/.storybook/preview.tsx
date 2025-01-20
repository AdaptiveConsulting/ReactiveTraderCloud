import { useDarkMode } from "storybook-dark-mode"
import styled, { ThemeProvider } from "styled-components"

import { GlobalStyle, themes } from "../src/client/theme"

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
  darkMode: {
    // Override the default dark theme
    dark: {
      ...themes.dark,
      barBg: "#232323",
      appBg: "#232323",
      appContentBg: "#232323",
      appPreviewBg: "#232323",
    },
    // Override the default light theme
    light: {
      ...themes.light,
      barBg: "#F6F9FC",
      appBg: "#F6F9FC",
      appContentBg: "#F6F9FC",
      appPreviewBg: "#F6F9FC",
    },
  },
}

export const decorators = [
  (Story) => (
    <>
      <ThemeProvider theme={useDarkMode() ? themes.dark : themes.light}>
        <GlobalStyle />
        <StyledStory>
          <Content>
            <Story />
          </Content>
        </StyledStory>
      </ThemeProvider>
    </>
  ),
]

const StyledStory = styled.div`
  overflow: hidden;
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
  background-color: ${({ theme }) =>
    theme.newTheme.color["Colors/Background/bg-primary"]};
  color: ${({ theme }) =>
    theme.newTheme.color["Colors/Text/text-primary (900)"]};
  transition:
    background-color ${({ theme }) => theme.motion.duration}ms
      ${({ theme }) => theme.motion.easing},
    color ${({ theme }) => theme.motion.duration}ms
      ${({ theme }) => theme.motion.easing};
`

const Content = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
`
