import { action } from '@storybook/addon-actions'
import { storiesOf } from '@storybook/react'
import React from 'react'

import { Story } from 'rt-storybook'
import { Themes } from 'shell/theme'

import Header from './Header'

const stories = storiesOf('Header', module)

const openLink = action('openLink')
const toggleTheme = action('toggleTheme')

stories.add('Header', () => (
  <Story>
    <Header openLink={openLink} toggleTheme={toggleTheme} theme={Themes.LIGHT_THEME} />
  </Story>
))
