import React from 'react'
import { Centered, Story } from 'rt-storybook'

import { boolean, withKnobs } from '@storybook/addon-knobs'
import { storiesOf } from '@storybook/react'

import Loadable from './Loadable'

const stories = storiesOf('Loadable', module)
stories.addDecorator(withKnobs)

stories.add('Loading', () => (
  <Story>
    <Centered>
      <div style={{ width: '360px', height: '160px' }}>
        <Loadable
          loading={boolean('Loading', false)}
          disconnected={boolean('Disconnected', false)}
          render={() => <Centered>Component</Centered>}
        />
      </div>
    </Centered>
  </Story>
))
