import _ from 'lodash'
import React, { Component, SFC } from 'react'
import { connect } from 'react-redux'
import { ThemeProvider } from 'rt-theme'

import { GlobalState } from 'StoreTypes'
import Icon from './Icon'
import { Body, ExpandToggle, Fill, NodeCount, Root, ServiceList, ServiceName, ServiceRoot } from './styled'

interface ServiceStatus {
  serviceType: string
  isConnected: boolean | null
  connectedInstanceCount: number | null
}

export const SERVICES = ['blotter', 'reference', 'execution', 'pricing', 'analytics'].map(serviceType => ({
  serviceType,
  isConnected: null,
  connectedInstanceCount: 0
}))

interface State {
  expanded: boolean
}

class StatusBar extends Component<StatusBarProps, State> {
  state = {
    expanded: false
  }

  toggleExpanded = () => this.setState(({ expanded }) => ({ expanded: !expanded }))

  render() {
    const {
      connectionStatus: { url, transportType },
      mode,
      serviceStatus
    } = this.props

    const { expanded } = this.state

    return (
      <ThemeProvider
        theme={theme => theme.button[mode === 'connected' ? 'good' : mode === 'connecting' ? 'aware' : 'bad']}
      >
        <Root expand={expanded}>
          <Body onClick={this.toggleExpanded}>
            <Icon name="check" />

            {mode === 'disconnected' ? (
              'Disconnected'
            ) : (
              <React.Fragment>
                {_.capitalize(mode)} to {url} ({transportType})
              </React.Fragment>
            )}
            <Fill />

            <ExpandToggle expand={expanded} />
          </Body>

          <ServiceList>
            {_.map(SERVICES, service => serviceStatus[service.serviceType] || service).map((service, index) => (
              <ThemeProvider
                key={service.serviceType}
                theme={theme => theme.button[service.isConnected ? 'good' : mode === 'connecting' ? 'aware' : 'bad']}
              >
                <Service service={service} index={index} />
              </ThemeProvider>
            ))}
          </ServiceList>
        </Root>
      </ThemeProvider>
    )
  }
}

const Service: SFC<{ service: ServiceStatus; index: number }> = ({
  service: { serviceType, isConnected, connectedInstanceCount },
  index
}) => (
  <ServiceRoot index={index + 2}>
    <Icon name={isConnected == null ? 'ellipsis-h' : isConnected ? 'check' : 'times'} />
    <div>
      <ServiceName>{serviceType}</ServiceName>

      {connectedInstanceCount != null && (
        <NodeCount>
          ({connectedInstanceCount} {connectedInstanceCount !== 1 ? 'Nodes' : 'Node'})
        </NodeCount>
      )}
    </div>
  </ServiceRoot>
)

const mapStateToProps = ({ compositeStatusService, connectionStatus }: GlobalState) => {
  const services = Object.values(compositeStatusService).map(s => s.isConnected)

  const mode =
    services.length < SERVICES.length || (services.some(s => s) && !services.every(s => s))
      ? 'connecting'
      : services.every(s => s)
        ? 'connected'
        : 'disconnected'

  return {
    connectionStatus,
    serviceStatus: compositeStatusService,
    mode
  }
}

type StatusBarProps = ReturnType<typeof mapStateToProps>

export default connect(mapStateToProps)(StatusBar)
