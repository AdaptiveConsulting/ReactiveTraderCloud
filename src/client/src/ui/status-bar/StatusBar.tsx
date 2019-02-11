import _ from 'lodash'
import React, { Component } from 'react'

import { ConnectionState } from 'rt-system'
import { ServiceStatus } from 'rt-types'
import { Content, Fill, Header, Root } from './styled'
import { OpenFinLogo } from './assets/OpenFinLogo'
import { PlatformAdapter, withPlatform } from 'rt-components'

const Logo: React.SFC<{ platform: PlatformAdapter }> = ({ platform }) => (
  <div>{platform.type === 'desktop' && <OpenFinLogo />}</div>
)

const LogoWithPlatform = withPlatform(Logo)

export default class StatusBar extends Component<
  {
    connectionStatus: ConnectionState
    services: ServiceStatus[]
  },
  {}
> {
  render() {
    return (
      <Root>
        <Content expand={false}>
          <Header>
            <Fill />
            <LogoWithPlatform />
            {this.props.children}
          </Header>
        </Content>
      </Root>
    )
  }
}
