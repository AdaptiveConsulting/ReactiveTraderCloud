import _ from 'lodash'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { ThemeProvider } from 'rt-theme'

import Icon from './Icon'
import { Root, Body, Fill, ExpandToggle, ServiceList, ServiceRoot, ServiceName, NodeCount } from './styled.js'

export const SERVICES = ['blotter', 'reference', 'execution', 'pricing', 'analytics'].map(serviceType => ({
  serviceType
}))

class StatusBar extends Component {
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
            {_.map(SERVICES, ({ serviceType }) => ({ serviceType, ...serviceStatus[serviceType] })).map(
              (service, index) => (
                <ThemeProvider
                  key={service.serviceType}
                  theme={theme => theme.button[service.isConnected ? 'good' : mode === 'connecting' ? 'aware' : 'bad']}
                >
                  <Service service={serviceStatus[service.serviceType] || service} index={index} />
                </ThemeProvider>
              )
            )}
          </ServiceList>
        </Root>
      </ThemeProvider>
    )
  }
}

const Service = ({ service: { serviceType, isConnected, connectedInstanceCount }, index }) => (
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

export default connect(({ compositeStatusService: serviceStatus, connectionStatus }) => {
  const services = Object.values(serviceStatus).map(s => s.isConnected)
  const mode =
    services.length < SERVICES.length || (services.some(s => s) && !services.every(s => s))
      ? 'connecting'
      : services.every(s => s)
        ? 'connected'
        : 'disconnected'

  return {
    connectionStatus,
    serviceStatus,
    mode
  }
})(StatusBar)
