import React from 'react'

import { action } from '@storybook/addon-actions'
import centered from '@storybook/addon-centered'
import { storiesOf } from '@storybook/react'

import { Environment } from 'rt-components'
import { Story } from 'rt-storybook'
import { ConnectionStatus, ConnectionType } from 'system'
import { Footer, FooterProps } from 'ui/footer/Footer'
import 'ui/styles/css/index.css'

const stories = storiesOf('Components', module).addDecorator(centered)

interface Props extends FooterProps {
  environment: Environment
}

const footerProps: Props = {
  compositeStatusService: {
    blotter: {
      connectedInstanceCount: 1,
      isConnected: true,
      serviceType: 'blotter'
    },
    reference: {
      connectedInstanceCount: 1,
      isConnected: true,
      serviceType: 'reference'
    },
    execution: {
      connectedInstanceCount: 1,
      isConnected: true,
      serviceType: 'execution'
    },
    pricing: {
      connectedInstanceCount: 1,
      isConnected: true,
      serviceType: 'pricing'
    },
    analytics: {
      connectedInstanceCount: 1,
      isConnected: true,
      serviceType: 'analytics'
    }
  },
  displayStatusServices: true,
  connectionStatus: {
    status: ConnectionStatus.connected,
    url: 'wss://web-demo.adaptivecluster.com:443/ws',
    transportType: ConnectionType.WebSocket
  },
  environment: { isRunningDesktop: false },
  toggleStatusServices: action('toggleStatusService'),
  openLink: action('openLink')
}

stories.add('default', () => (
  <Story>
    <div className="shell__footer">
      <Footer {...footerProps} />
    </div>
  </Story>
))

const disconnectedFooterProps: Props = {
  ...footerProps,
  connectionStatus: {
    ...footerProps.connectionStatus,
    status: ConnectionStatus.disconnected
  }
}

stories.add('disconnected', () => (
  <Story>
    <div className="shell__footer">
      <Footer {...disconnectedFooterProps} />
    </div>
  </Story>
))
