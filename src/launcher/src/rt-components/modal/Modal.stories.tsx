import { boolean } from '@storybook/addon-knobs'
import { withKnobs } from '@storybook/addon-knobs'
import React from 'react'

import { storiesOf } from '@storybook/react'

import { Story } from 'rt-storybook'

import Modal from './Modal'

const stories = storiesOf('Modal', module).addDecorator(withKnobs)

stories.add('Modal', () => {
  const shouldShow = boolean('shouldShow?', true)
  return (
    <Story>
      <Modal shouldShow={shouldShow} title="Modal Title">
        <h2>Modal Content</h2>
        <p>This is some modal content</p>
      </Modal>
    </Story>
  )
})
