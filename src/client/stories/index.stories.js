import React from 'react'
import '../src/ui/styles/css/index.css'

import { storiesOf } from '@storybook/react'
import centered from '@storybook/addon-centered'
import { action } from '@storybook/addon-actions'

import { Footer } from '../src/ui/footer/Footer'

const stories = storiesOf('Components', module).addDecorator(centered)

const footerProps = {
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
    status: 'connected',
    url: 'wss://web-demo.adaptivecluster.com:443/ws',
    transportType: 'websocket'
  },
  environment: { isRunningDesktop: false }
}

stories.add('Footer', () => (
  <div className="shell__footer">
    <Footer {...footerProps} toggleStatusServices={action('toggleStatusService')} openLink={action('openLink')} />
  </div>
))
