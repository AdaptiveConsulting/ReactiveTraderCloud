import { action } from '@storybook/addon-actions'
import { storiesOf } from '@storybook/react'
import React from 'react'

import { Story } from 'rt-storybook'
import { styled } from 'rt-util'
import { Themes } from 'shell/theme'

import Header from './Header'

const stories = storiesOf('Header', module)

const HeaderStory = styled('div')`
  width: 100%;
  height: 100%;
  background-color: ${({ theme }) => theme.palette.primary[2]};
`

const openLink = action('openLink')
const toggleTheme = action('toggleTheme')

stories.add('Header', () => (
  <Story>
    <HeaderStory>
      <Header openLink={openLink} toggleTheme={toggleTheme} theme={Themes.LIGHT_THEME} />
    </HeaderStory>
  </Story>
))
