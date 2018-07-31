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

const SERVICES = ['blotter', 'reference', 'execution', 'pricing', 'analytics']

const getServiceStatus = (services, isConnected, connectedInstanceCount) =>
  services.reduce((acc, val) => {
    const newAcc = acc
    newAcc[val] = {
      connectedInstanceCount,
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
