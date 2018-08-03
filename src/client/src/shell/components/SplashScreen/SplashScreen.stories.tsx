import React from 'react'

import { storiesOf } from '@storybook/react'

import { Story } from 'rt-storybook'

import SplashScreen from './SplashScreen'

const stories = storiesOf('SplashScreen', module)

stories.add('SplashScreen', () => (
  <Story>
    <SplashScreen />
  </Story>
))
