import React from "react"
import styled, { ThemeProvider } from "styled-components"
import { GlobalStyle, themes } from "@/theme"

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
}

export const globalTypes = {
  theme: {
    name: "Theme",
    description: "Global theme for components",
    defaultValue: "dark",
    toolbar: {
      icon: "circlehollow",
      items: ["light", "dark"],
      showName: true,
    },
  },
}

export const decorators = [
  (Story, context) => (
    <>
      <GlobalStyle />
      <ThemeProvider theme={themes[context.globals.theme]}>
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
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
  background-color: ${(p) => p.theme.core.darkBackground};
  color: ${(p) => p.theme.core.textColor};
  transition: background-color ${(p) => p.theme.motion.duration}ms
      ${(p) => p.theme.motion.easing},
    color ${(p) => p.theme.motion.duration}ms ${(p) => p.theme.motion.easing};
`

const Content = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`
