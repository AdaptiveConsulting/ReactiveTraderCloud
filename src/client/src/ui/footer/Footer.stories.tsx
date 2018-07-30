import React from 'react'

import { storiesOf } from '@storybook/react'

import { Environment } from 'rt-components'
import { Story } from 'rt-storybook'
import { styled } from 'rt-util'
import { ConnectionType } from 'system'
import Footer, { FooterProps } from 'ui/footer/Footer'
import 'ui/styles/css/index.css'

const StyledStoryContainer = styled('div')`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
`
const Padding = styled('div')`
  flex: 1;
`
const FooterStory: React.SFC = ({ children }) => (
  <Story>
    <StyledStoryContainer>
      <Padding />
      {children}
    </StyledStoryContainer>
  </Story>
)

const stories = storiesOf('Footer', module)

interface Props extends FooterProps {
  environment: Environment
}

const footerProps: Props = {
  serviceStatus: {
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
  isConnected: true,
  url: 'wss://web-demo.adaptivecluster.com:443/ws',
  transportType: ConnectionType.WebSocket,
  environment: { isRunningDesktop: false }
}

stories.add('Connected', () => (
  <FooterStory>
    <Footer {...footerProps} />
  </FooterStory>
))

const disconnectedFooterProps: Props = {
  ...footerProps,
  serviceStatus: {
    blotter: {
      connectedInstanceCount: 0,
      isConnected: false,
      serviceType: 'blotter'
    },
    reference: {
      connectedInstanceCount: 0,
      isConnected: false,
      serviceType: 'reference'
    },
    execution: {
      connectedInstanceCount: 0,
      isConnected: false,
      serviceType: 'execution'
    },
    pricing: {
      connectedInstanceCount: 0,
      isConnected: false,
      serviceType: 'pricing'
    },
    analytics: {
      connectedInstanceCount: 0,
      isConnected: false,
      serviceType: 'analytics'
    }
  },
  isConnected: false
}

stories.add('Disconnected', () => (
  <FooterStory>
    <Footer {...disconnectedFooterProps} />
  </FooterStory>
))
