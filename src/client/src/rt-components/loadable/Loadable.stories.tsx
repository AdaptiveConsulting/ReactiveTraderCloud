import React from 'react'
import { Centered, Story } from 'rt-storybook'
import { capitalize } from 'lodash'

import { storiesOf } from '@storybook/react'

import { ServiceConnectionStatus } from 'rt-types'
import Loadable from './Loadable'

const stories = storiesOf('Loadable', module)

const LoadableStatuses = [ServiceConnectionStatus.CONNECTING, ServiceConnectionStatus.DISCONNECTED]
LoadableStatuses.map(status => {
  stories.add(capitalize(status), () => {
    return (
      <Story>
        <Centered>
          <div style={{ width: '22.5rem', height: '10rem' }}>
            <Loadable status={status} render={() => <Centered>Component</Centered>} />
          </div>
        </Centered>
      </Story>
    )
  })
})
