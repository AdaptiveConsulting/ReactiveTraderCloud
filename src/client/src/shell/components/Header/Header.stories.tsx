import { action } from '@storybook/addon-actions'
import { storiesOf } from '@storybook/react'
import React from 'react'

import { Story } from 'rt-storybook'

import Header from './Header'

const stories = storiesOf('Header', module)

const openLink = action('openLink')

stories.add('Header', () => (
  <Story>
    <Header openLink={openLink} />
  </Story>
))
