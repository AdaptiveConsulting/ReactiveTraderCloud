import _ from 'lodash'
import React from 'react'
import { Provider } from 'react-redux'
import { createStore } from 'redux'

import { withKnobs } from '@storybook/addon-knobs'
import { storiesOf } from '@storybook/react'

import { Story } from 'rt-storybook'
import { ConnectionType } from 'rt-system'
import { styled } from 'rt-util'

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

const connectionState = {
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

_.forEach(connectionState, (state, key) =>
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
