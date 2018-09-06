import _ from 'lodash'
import React, { Component, SFC } from 'react'
import { ThemeProvider } from 'rt-theme'

import { ConnectionState } from 'rt-system'
import { ServiceConnectionStatus, ServiceStatus } from 'rt-types'
import Icon from './Icon'
import { Content, ExpandToggle, Fill, Header, NodeCount, Root, ServiceList, ServiceName, ServiceRoot } from './styled'

interface State {
  expanded: boolean
}

const mapToTheme = {
  [ServiceConnectionStatus.CONNECTED]: 'good',
  [ServiceConnectionStatus.CONNECTING]: 'aware',
  [ServiceConnectionStatus.DISCONNECTED]: 'bad'
}

const mapToIcon = {
  [ServiceConnectionStatus.CONNECTING]: 'ellipsis-h',
  [ServiceConnectionStatus.CONNECTED]: 'check',
  [ServiceConnectionStatus.DISCONNECTED]: 'times'
}

const getApplicationStatus = (services: ServiceStatus[]) => {
  if (services.every(s => s.connectionStatus === ServiceConnectionStatus.CONNECTED)) {
    return ServiceConnectionStatus.CONNECTED
  } else if (services.some(s => s.connectionStatus === ServiceConnectionStatus.CONNECTING)) {
    return ServiceConnectionStatus.CONNECTING
  } else {
    return ServiceConnectionStatus.DISCONNECTED
  }
}

export class StatusBar extends Component<
  {
    connectionStatus: ConnectionState
    services: ServiceStatus[]
  },
  State
> {
  state = {
    expanded: false
  }

  toggleExpanded = () => this.setState(({ expanded }) => ({ expanded: !expanded }))

  render() {
    const {
      connectionStatus: { url, transportType },
      services
    } = this.props

    const { expanded } = this.state
    const mode = getApplicationStatus(services)
    return (
      <ThemeProvider theme={theme => theme.button[mapToTheme[mode]]}>
        <Root>
          <Content expand={expanded}>
            <Header onClick={this.toggleExpanded}>
              <Icon name="check" />
              {mode === ServiceConnectionStatus.DISCONNECTED ? (
                'Disconnected'
              ) : (
                <React.Fragment>
                  {_.capitalize(mode)} to {url} ({transportType})
                </React.Fragment>
              )}
              <Fill />

              <ExpandToggle expand={expanded} />
            </Header>

            <ServiceList>
              {services.map((service, index) => (
                <ThemeProvider
                  key={service.serviceType}
                  theme={theme => theme.button[mapToTheme[service.connectionStatus]]}
                >
                  <Service service={service} index={index} />
                </ThemeProvider>
              ))}
            </ServiceList>
          </Content>
        </Root>
      </ThemeProvider>
    )
  }
}

const Service: SFC<{ service: ServiceStatus; index: number }> = ({
  service: { serviceType, connectionStatus, connectedInstanceCount },
  index
}) => (
  <ServiceRoot index={index + 2}>
    <Icon name={mapToIcon[connectionStatus]} />
    <div>
      <ServiceName>{serviceType}</ServiceName>

      {connectionStatus === ServiceConnectionStatus.CONNECTED && (
        <NodeCount>
          ({connectedInstanceCount} {connectedInstanceCount !== 1 ? 'Nodes' : 'Node'})
        </NodeCount>
      )}
    </div>
  </ServiceRoot>
)
