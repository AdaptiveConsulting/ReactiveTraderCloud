import { action } from '@storybook/addon-actions'
import { boolean } from '@storybook/addon-knobs/react'
import { withKnobs } from '@storybook/addon-knobs/react'
import React from 'react'

import { storiesOf } from '@storybook/react'

import { Story } from 'rt-storybook'

import { ReconnectModal } from './'

const stories = storiesOf('ReconnectModal', module).addDecorator(withKnobs)

stories.add('ReconnectModal', () => {
  const shouldShow = boolean('shouldShow?', true)
  const reconnect = action('reconnect')
  return (
    <Story>
      <ReconnectModal shouldShow={shouldShow} reconnect={reconnect} />
    </Story>
  )
})
