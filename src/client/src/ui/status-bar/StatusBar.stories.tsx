import _ from 'lodash'
import React, { SFC } from 'react'
import { Provider } from 'react-redux'
import { createStore } from 'redux'

import { withKnobs } from '@storybook/addon-knobs'
import { storiesOf } from '@storybook/react'

import { Story } from 'rt-storybook'
import { ConnectionStatus, ConnectionType } from 'rt-system'
import { styled } from 'rt-theme'

import { ServiceConnectionStatus } from 'rt-types'
import { StatusBar } from './StatusBar'

const stories = storiesOf('Status Bar', module)

stories.addDecorator(withKnobs)

const generateConnectionStatus = (status: ConnectionStatus) => ({
  status,
  url: 'wss://web-demo.adaptivecluster.com:443/ws',
  transportType: ConnectionType.WebSocket
})

const generateServiceStatuses = (status: ServiceConnectionStatus) =>
  ['blotter', 'reference', 'execution', 'pricing', 'analytics'].map(serviceType => ({
    serviceType,
    connectionStatus: status,
    connectedInstanceCount: 0
  }))

const connectionState = {
  connected: {
    status: generateConnectionStatus(ConnectionStatus.connected),
    services: generateServiceStatuses(ServiceConnectionStatus.CONNECTED)
  },

  disconnected: {
    status: generateConnectionStatus(ConnectionStatus.disconnected),
    services: generateServiceStatuses(ServiceConnectionStatus.DISCONNECTED)
  },

  connecting: {
    status: generateConnectionStatus(ConnectionStatus.connected),
    services: generateServiceStatuses(ServiceConnectionStatus.CONNECTING)
  }
}

Object.entries(connectionState).forEach(([key, state]) =>
  stories.add(_.capitalize(key), () => {
    // const expanded = boolean('expanded', false)
    return (
      <Root state={state}>
        <StatusBar connectionStatus={state.status} services={state.services} />
      </Root>
    )
  })
)

const Root: SFC<{ state: {} }> = ({ children, state = {} }) => (
  <Provider store={createStore(() => state)}>
    <Story>
      <Container>{children}</Container>
    </Story>
  </Provider>
)

const Container = styled.div`
  display: flex;
  align-items: flex-end;
  height: 50vh;
  width: 100%;
`
