import { storiesOf } from '@storybook/react'
import React from 'react'

import { Story } from 'rt-storybook'

import Header from './Header'

const stories = storiesOf('Header', module)

stories.add('Header', () => (
  <Story>
    <Header />
  </Story>
))
