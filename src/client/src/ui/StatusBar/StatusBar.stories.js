import _ from 'lodash'
import React from 'react'
import { createStore } from 'redux'
import { Provider } from 'react-redux'

import { storiesOf } from '@storybook/react'
import { withKnobs, boolean } from '@storybook/addon-knobs'

import { Story } from 'rt-storybook'
import { styled } from 'rt-util'
import { ConnectionType } from 'system'

import StatusBar, { SERVICES } from './StatusBar'

const stories = storiesOf('Status Bar', module)

stories.addDecorator(withKnobs)

const connectionStatus = {
  status: 'connected',
  url: 'wss://web-demo.adaptivecluster.com:443/ws',
  transportType: ConnectionType.WebSocket
}

const compositeStatusService = _.mapValues(_.keyBy(SERVICES, 'serviceType'), ({ serviceType }) => ({
  serviceType,
  isConnected: true,
  connectedInstanceCount: 2
}))

const state = {
  connected: {
    connectionStatus,
    compositeStatusService
  },

  disconnected: {
    connectionStatus: {
      ...connectionStatus,
      status: 'disconnected'
    },
    compositeStatusService: _.mapValues(compositeStatusService, s => ({
      ...s,
      isConnected: false
    }))
  },

  connecting: {
    connectionStatus: {
      ...connectionStatus,
      status: 'disconnected'
    },
    compositeStatusService: _.mapValues(compositeStatusService, s => ({
      ...s,
      isConnected: Math.random() > 0.5
    }))
  }
}

_.forEach(state, (state, key) =>
  stories.add(_.capitalize(key), () => {
    // const expanded = boolean('expanded', false)
    return (
      <Root state={state}>
        <StatusBar />
      </Root>
    )
  })
)

const Root = ({ children, state = {} }) => (
  <Provider store={createStore(() => state)}>
    <Story>
      <Container>{children}</Container>
    </Story>
  </Provider>
)

const Container = styled.div`
  display: flex;
  align-items: flex-end;
  height: 100%;
  width: 100%;
`
