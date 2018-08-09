import _ from 'lodash'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { ThemeProvider } from 'emotion-theming'

import Icon from './Icon'
import { Root, Body, Fill, ExpandToggle, ServiceList, ServiceRoot, ServiceName, NodeCount } from './styled.js'

export const SERVICES = ['blotter', 'reference', 'execution', 'pricing', 'analytics'].map(serviceType => ({
  serviceType
}))

class StatusBar extends Component {
  state = {
    expanded: false
  }

  resolveTheme = theme => {
    const { mode } = this.props
    const currentTheme = theme.statusBar[mode]

    return {
      ...theme,

      ...theme.statusBar[mode],

      serviceItem: {
        connected: theme.statusBar.connected,
        disconnected: mode === 'connecting' ? theme.statusBar.connecting : theme.statusBar.disconnected
      }
    }
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
      <ThemeProvider key={mode} theme={this.resolveTheme}>
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
            {_.map(SERVICES, (service, index) => (
              <Service
                key={service.serviceType + service.isConnected}
                service={serviceStatus[service.serviceType] || service}
                index={index}
              />
            ))}
          </ServiceList>
        </Root>
      </ThemeProvider>
    )
  }
}

const Service = ({ service: { serviceType, isConnected, connectedInstanceCount }, index }) => (
  <ThemeProvider theme={theme => theme.serviceItem[isConnected ? 'connected' : 'disconnected']}>
    <ServiceRoot index={index + 2}>
      <Icon name={isConnected == null ? 'ellipsis-h' : isConnected ? 'check' : 'times'} />
      <div>
        <ServiceName>{serviceType}</ServiceName>

        {connectedInstanceCount != null && (
          <NodeCount>
            ({connectedInstanceCount} Node
            {connectedInstanceCount !== 1 ? 's' : ''})
          </NodeCount>
        )}
      </div>
    </ServiceRoot>
  </ThemeProvider>
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
