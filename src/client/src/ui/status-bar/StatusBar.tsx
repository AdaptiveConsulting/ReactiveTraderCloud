import _ from 'lodash'
import React, { Component } from 'react'

import { ConnectionState } from 'rt-system'
import { ServiceStatus } from 'rt-types'
import { Content, Fill, Header, Root, OpenFinLogoContainer } from './styled'
import { OpenFinLogo } from './assets/OpenFinLogo'
import { usePlatform } from 'rt-components'

const LogoWithPlatform: React.FC = () => {
  const platform = usePlatform()
  return (
    <div>
      {platform.name === 'openfin' && (
        <OpenFinLogoContainer>
          <OpenFinLogo />
        </OpenFinLogoContainer>
      )}
    </div>
  )
}

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
