import React from 'react'

import { withKnobs } from '@storybook/addon-knobs'
import { storiesOf } from '@storybook/react'

import { Story as BaseStory } from 'rt-storybook'
import { styled, ThemeProvider } from 'rt-theme'

export const Centered = styled('div')`
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`

export const Story: React.SFC = ({ children }) => (
  <BaseStory>
    <ThemeProvider>{children}</ThemeProvider>
  </BaseStory>
)

export const stories = storiesOf('Spot Tile', module)
stories.addDecorator(withKnobs)
