import { withKnobs } from '@storybook/addon-knobs'
import React from 'react'
import { storiesOf } from '@storybook/react'
import { Story, Centered } from 'rt-storybook'

import Tooltip from './Tooltip'

const stories = storiesOf('Tooltip', module).addDecorator(withKnobs)

stories.add('Tooltip at top', () => {
  return (
    <Story>
      <Centered>
        <Tooltip message="this is an tooltip" position="top">
          <button>Hover me!</button>
        </Tooltip>
      </Centered>
    </Story>
  )
})

stories.add('Tooltip at bottom', () => {
  return (
    <Story>
      <Centered>
        <Tooltip message="this is an tooltip">
          <button>Hover me!</button>
        </Tooltip>
      </Centered>
    </Story>
  )
})

stories.add('Tooltip at left', () => {
  return (
    <Story>
      <Centered>
        <Tooltip message="this is an tooltip" position="left">
          <button>Hover me!</button>
        </Tooltip>
      </Centered>
    </Story>
  )
})

stories.add('Tooltip at right', () => {
  return (
    <Story>
      <Centered>
        <Tooltip message="this is an tooltip" position="right">
          <button>Hover me!</button>
        </Tooltip>
      </Centered>
    </Story>
  )
})
