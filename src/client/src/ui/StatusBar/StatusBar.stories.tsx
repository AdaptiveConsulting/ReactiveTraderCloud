import React from 'react'

import { storiesOf } from '@storybook/react'
import { withKnobs, boolean } from '@storybook/addon-knobs'

import { Flex } from 'rt-components'
import { Story } from 'rt-storybook'
import { styled } from 'rt-util'
import { ConnectionType } from 'system'

import StatusBar from './StatusBar'

const stories = storiesOf('Status Bar', module)

stories.addDecorator(withKnobs)

const SERVICES = ['broker', 'blotter', 'reference', 'execution', 'pricing', 'analytics']

const getServiceStatus = (services, connected, connectedInstanceCount) =>
  services.reduce((acc, val) => {
    const newAcc = acc
    newAcc[val] = {
      connectedInstanceCount: val === 'broker' ? 0 : connectedInstanceCount,
      connected,
      serviceType: val,
    }
    return newAcc
  }, {})

const footerProps = {
  serviceStatus: getServiceStatus(SERVICES, true, 1),
  connected: true,
  url: 'wss://web-demo.adaptivecluster.com:443/ws',
  transportType: ConnectionType.WebSocket,
  environment: { isRunningDesktop: false },
  expanded: true,
}

stories.add('Connected', () => {
  const expanded = boolean('expanded', true)
  return (
    <StatusBarStory>
      <StatusBar {...footerProps} expanded={expanded} />
    </StatusBarStory>
  )
})

const disconnectedStatusBarProps = {
  ...footerProps,
  serviceStatus: getServiceStatus(SERVICES, false, 0),
  connected: false,
}

stories.add('Disconnected', () => (
  <StatusBarStory>
    <StatusBar {...disconnectedStatusBarProps} />
  </StatusBarStory>
))

const Padding = styled('div')`
  flex: 1;
`
const StatusBarStory: React.SFC = ({ children }) => (
  <Story>
    <Flex width="100%" height="100%" direction="column">
      <Padding />
      {children}
    </Flex>
  </Story>
)
