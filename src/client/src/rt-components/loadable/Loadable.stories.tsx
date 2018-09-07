import React from 'react'
import { Centered, Story } from 'rt-storybook'

import { select, withKnobs } from '@storybook/addon-knobs'
import { storiesOf } from '@storybook/react'

import { ServiceConnectionStatus } from 'rt-types'
import Loadable from './Loadable'

const stories = storiesOf('Loadable', module)
stories.addDecorator(withKnobs)

stories.add('Loading', () => (
  <Story>
    <Centered>
      <div style={{ width: '360px', height: '160px' }}>
        <Loadable
          status={select(
            'Status',
            {
              Connecting: ServiceConnectionStatus.CONNECTING,
              Connected: ServiceConnectionStatus.CONNECTED,
              Disconnected: ServiceConnectionStatus.DISCONNECTED
            },
            ServiceConnectionStatus.CONNECTED
          )}
          render={() => <Centered>Component</Centered>}
        />
      </div>
    </Centered>
  </Story>
))
