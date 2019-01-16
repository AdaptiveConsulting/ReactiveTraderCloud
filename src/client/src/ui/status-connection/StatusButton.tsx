import React, { Component, SFC, SyntheticEvent } from 'react'

import { ConnectionState } from 'rt-system'
import { ServiceConnectionStatus, ServiceStatus } from 'rt-types'
import {
  Button,
  StatusCircle,
  StatusLabel,
  NodeCount,
  Root,
  AppUrl,
  ServiceListPopup,
  ServiceList,
  ServiceName,
  ServiceRoot,
} from './styled'

interface State {
  opened: boolean
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

export class StatusButton extends Component<
  {
    connectionStatus: ConnectionState
    services: ServiceStatus[]
  },
  State
> {
  state = {
    opened: false,
  }

  toggleOpen = (e: SyntheticEvent) => {
    if (!this.isAppUrl(e.target)) {
      this.setState(({ opened }) => ({ opened: !opened }))
    }
  }

  isAppUrl = (element: any) => element instanceof HTMLInputElement

  selectAll = (e: SyntheticEvent) => {
    const input = e.target as HTMLInputElement
    input.select()
  }

  render() {
    const {
      connectionStatus: { url, transportType },
      services,
    } = this.props

    const { opened } = this.state
    const appStatus = getApplicationStatus(services)
    const appUrl = `${url} (${transportType})`
    return (
      <Root>
        <Button onClick={this.toggleOpen}>
          <StatusCircle status={appStatus} />
          <StatusLabel status={appStatus} />
        </Button>

        <ServiceListPopup open={opened} onClick={this.toggleOpen}>
          <ServiceList>
            <AppUrl title={appUrl} readOnly={true} value={appUrl} onFocus={this.selectAll} onClick={this.selectAll} />

            {services.map((service, index) => (
              <Service key={service.serviceType} service={service} index={index} />
            ))}
          </ServiceList>
        </ServiceListPopup>
      </Root>
    )
  }
}

const Service: SFC<{ service: ServiceStatus; index: number }> = ({
  service: { serviceType, connectionStatus, connectedInstanceCount },
  index,
}) => (
  <ServiceRoot index={index + 2}>
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <StatusCircle status={connectionStatus} />
      <ServiceName>{serviceType}</ServiceName>
    </div>

    {connectionStatus === ServiceConnectionStatus.CONNECTED && (
      <NodeCount>
        ({connectedInstanceCount} {connectedInstanceCount !== 1 ? 'Nodes' : 'Node'})
      </NodeCount>
    )}
  </ServiceRoot>
)
