import React from 'react'

import { storiesOf } from '@storybook/react'

import { Environment, Flex } from 'rt-components'
import { Story } from 'rt-storybook'
import { ConnectionType } from 'rt-system'
import { styled } from 'rt-util'

import Footer, { FooterProps } from './Footer'

const Padding = styled('div')`
  flex: 1;
`
const FooterStory: React.SFC = ({ children }) => (
  <Story>
    <Flex width="100%" height="100%" direction="column">
      <Padding />
      {children}
    </Flex>
  </Story>
)

const stories = storiesOf('Footer', module)

interface Props extends FooterProps {
  environment: Environment
}

const SERVICES = ['broker', 'blotter', 'reference', 'execution', 'pricing', 'analytics']

const getServiceStatus = (services, isConnected, connectedInstanceCount) =>
  services.reduce((acc, val) => {
    const newAcc = acc
    newAcc[val] = {
      connectedInstanceCount: val === 'broker' ? 0 : connectedInstanceCount,
      isConnected,
      serviceType: val
    }
    return newAcc
  }, {})

const footerProps: Props = {
  serviceStatus: getServiceStatus(SERVICES, true, 1),
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
  serviceStatus: getServiceStatus(SERVICES, false, 0),
  isConnected: false
}

stories.add('Disconnected', () => (
  <FooterStory>
    <Footer {...disconnectedFooterProps} />
  </FooterStory>
))
