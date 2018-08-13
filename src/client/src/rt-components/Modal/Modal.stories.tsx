import { action } from '@storybook/addon-actions'
import { boolean } from '@storybook/addon-knobs/react'
import { withKnobs } from '@storybook/addon-knobs/react'
import React from 'react'

import { storiesOf } from '@storybook/react'

import { Story } from 'rt-storybook'

import Modal from './Modal'

const stories = storiesOf('Modal', module).addDecorator(withKnobs)

stories.add('Modal', () => {
  const shouldShow = boolean('shouldShow?', true)
  const onDissmiss = action('onDissmiss')
  return (
    <Story>
      <Modal shouldShow={shouldShow} title="Modal Title" onDismiss={onDissmiss}>
        <h2>Modal Content</h2>
        <p>This is some modal content</p>
      </Modal>
    </Story>
  )
})
