import _ from 'lodash'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { ThemeProvider } from 'emotion-theming'

import { Environment, withEnvironment } from 'rt-components'
import { Flex } from 'rt-components'
import { ConnectionType, ServiceConnectionInfo } from 'system'
import Icon from './Icon'

import {
  Root,
  Body,
  Fill,
  ExpandIcon,
  ServiceList,
  ServiceItem,
  ServiceName,
  NodeCount,
} from './styled.js'

const SERVICES = ['blotter', 'reference', 'execution', 'pricing', 'analytics'].map(serviceType => ({
  serviceType,
}))

class StatusBar extends Component {
  static getDerivedStateFromProps(props, state) {
    return {
      expanded: props.expanded || state.expanded,
    }
  }

  state = {
    expanded: false,
  }

  toggle = () => this.setState(({ expanded }) => ({ expanded: !expanded }))

  resolveTheme = theme => {
    const { mode } = this.props
    const currentTheme = theme.statusBar[mode]

    theme = {
      ...theme,
      ...theme.statusBar,
      ...theme.statusBar[mode],
      motion: { duration: 200 },
    }

    return theme
  }

  render() {
    const {
      connectionStatus: { url, transportType },
      mode,
      serviceStatus,
    } = this.props

    const { expanded } = this.state

    return (
      <ThemeProvider key={mode} theme={this.resolveTheme}>
        <Root expand={expanded}>
          <Body direction="row" alignItems="center" onClick={this.toggle}>
            <Icon name="check" />
            <span>
              {mode === 'disconnected' ? (
                'Disconnected'
              ) : (
                <React.Fragment>
                  {_.capitalize(mode)} to {url} ({transportType})
                </React.Fragment>
              )}
            </span>
            <Fill />
            <ExpandIcon className="fas fa-chevron-up" expand={expanded} />
          </Body>
          <ServiceList>
            {_.map(SERVICES, (service, index) => (
              <Service
                key={service.serviceType}
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

const Service = ({ service, index }) => (
  <ServiceItem index={index}>
    <Icon
      name={service.isConnected == null ? 'ellipsis-h' : service.isConnected ? 'check' : 'times'}
    />
    <div>
      <ServiceName>{service.serviceType}</ServiceName>
      <NodeCount>
        {service.connectedInstanceCount != null && (
          <React.Fragment>
            ({service.connectedInstanceCount} Node{service.connectedInstanceCount !== 1 ? 's' : ''})
          </React.Fragment>
        )}
      </NodeCount>
    </div>
  </ServiceItem>
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
    mode,
  }
})(withEnvironment(StatusBar))
