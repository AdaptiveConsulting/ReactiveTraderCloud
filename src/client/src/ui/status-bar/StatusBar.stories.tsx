import { capitalize } from 'lodash'
import React, { FC } from 'react'
import { Provider } from 'react-redux'
import { createStore } from 'redux'

import { withKnobs } from '@storybook/addon-knobs'
import { storiesOf } from '@storybook/react'

import { Story } from 'rt-storybook'
import { ConnectionStatus, ConnectionType } from 'rt-system'
import { styled } from 'rt-theme'

import { ServiceConnectionStatus } from 'rt-types'
import StatusBar from './StatusBar'
import { StatusButton } from '../status-connection/StatusButton'
const stories = storiesOf('Status Bar', module)

stories.addDecorator(withKnobs)

const generateConnectionStatus = (status: ConnectionStatus) => ({
  status,
  url: 'wss://web-demo.adaptivecluster.com:443/ws',
  transportType: 'websocket' as ConnectionType,
})

const generateServiceStatuses = (status: ServiceConnectionStatus) =>
  ['blotter', 'reference', 'execution', 'pricing', 'analytics'].map(serviceType => ({
    serviceType,
    connectionStatus: status,
    connectedInstanceCount: 1,
  }))

const connectionState = {
  connected: {
    status: generateConnectionStatus(ConnectionStatus.connected),
    services: generateServiceStatuses(ServiceConnectionStatus.CONNECTED),
  },

  disconnected: {
    status: generateConnectionStatus(ConnectionStatus.disconnected),
    services: generateServiceStatuses(ServiceConnectionStatus.DISCONNECTED),
  },

  connecting: {
    status: generateConnectionStatus(ConnectionStatus.connected),
    services: generateServiceStatuses(ServiceConnectionStatus.CONNECTING),
  },
}

Object.entries(connectionState).forEach(([key, state]) =>
  stories.add(capitalize(key), () => {
    return (
      <Root>
        <StatusBar fillSize={0.5}>
          <StatusButton connectionStatus={state.status} services={state.services} />
        </StatusBar>
      </Root>
    )
  }),
)

const Centered = styled('div')`
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`

const store = createStore(() => {})
const Root: FC = ({ children }) => (
  <Provider store={store}>
    <Story>
      <Centered>{children}</Centered>
    </Story>
  </Provider>
)
