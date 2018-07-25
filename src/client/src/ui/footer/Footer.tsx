import * as classnames from 'classnames'
import * as _ from 'lodash'
import * as React from 'react'
import styled from 'react-emotion'

import { ServiceStatus } from 'rt-types'
import { ConnectionStatus, ConnectionType, ServiceConnectionInfo } from 'system'
import { ConnectionInfo } from 'ui/connectionStatus'
import { Environment, withEnvironment } from 'ui/shell/EnvironmentProvider'
import { Styled } from 'ui/theme'

import { ApplicationStatusConst } from './applicationStatusConst'
import { StatusIndicator } from './StatusIndicator'

interface FooterProps {
  compositeStatusService: ServiceConnectionInfo
  connectionStatus: ConnectionInfo
  toggleStatusServices: () => any // https://github.com/DefinitelyTyped/DefinitelyTyped/issues/25874
  displayStatusServices: boolean
  openLink: (link: string) => any // https://github.com/DefinitelyTyped/DefinitelyTyped/issues/25874,
}

const ADAPTIVE_URL: string = 'http://www.weareadaptive.com'
const OPENFIN_URL: string = 'http://openfin.co'

type StyleProps = Styled<{
  connected: boolean
}>
const FooterContainer = styled('footer')`
  height: 100%;
  width: 100vw;
  background-color: ${({ connected, theme }: StyleProps) => (connected ? theme.colors.primary : theme.colors.error)};
  color: white;
  position: relative;
`

export const Footer: React.SFC<FooterProps & { environment: Environment }> = ({
  compositeStatusService,
  connectionStatus,
  toggleStatusServices,
  displayStatusServices,
  environment,
  openLink
}) => {
  const servicesAsList = _.values(compositeStatusService)

  const panelClasses = classnames('footer__service-status-panel', {
    hide: !isConnected(connectionStatus.status) || !displayStatusServices
  })

  const openfinLogoClassName = classnames('footer__logo', {
    'footer__logo-openfin': environment.isRunningDesktop
  })
  const footerClasses = classnames('footer', {
    'footer--disconnected': !isConnected(connectionStatus.status)
  })

  return (
    <FooterContainer className={footerClasses} connected={isConnected(connectionStatus.status)}>
      <span className="footer__connection-url">
        {isConnected(connectionStatus.status)
          ? `Connected to ${connectionStatus.url} (${connectionStatus.transportType})`
          : 'Disconnected'}{' '}
      </span>
      <span className="footer__logo-container">
        <span className={openfinLogoClassName} onClick={() => openLink(OPENFIN_URL)} />
        <span className="footer__logo footer__logo-adaptive" onClick={() => openLink(ADAPTIVE_URL)} />
      </span>
      <div
        className="footer__status-indicator-wrapper"
        onMouseOut={() => toggleStatusServices()}
        onMouseOver={() => toggleStatusServices()}
      >
        <StatusIndicator
          status={getApplicationStatus(connectionStatus.status, servicesAsList, connectionStatus.transportType)}
        />
      </div>
      <div className={panelClasses}>
        <ul className="footer__services">
          <li className="footer__service" key={Math.random()}>
            {renderBroker(connectionStatus.status)}
          </li>
          {servicesAsList.map(renderServiceStatus)}
        </ul>
      </div>
    </FooterContainer>
  )
}

const getApplicationStatus = (
  connection: ConnectionStatus,
  services: ServiceStatus[],
  connectionType: ConnectionType
) => {
  if (
    connection === ConnectionStatus.connected &&
    _.every(services, 'isConnected') &&
    connectionType === ConnectionType.WebSocket
  ) {
    return ApplicationStatusConst.Healthy
  } else if (_.some(services, 'isConnected')) {
    return ApplicationStatusConst.Warning
  } else {
    return ApplicationStatusConst.Down
  }
}

const isConnected = (connection: ConnectionStatus) => connection === ConnectionStatus.connected

const renderBroker = (connection: ConnectionStatus) =>
  (isConnected(connection) && (
    <span className="footer__service-label">
      <i className="footer__icon--online fa fa-circle " />broker
    </span>
  )) || (
    <span className="footer__service-label">
      <i className="footer__icon--offline fa fa-circle-o" />broker
    </span>
  )

const renderServiceStatus = (serviceStatus: ServiceStatus) => (
  <li className="footer__service" key={Math.random()}>
    {renderStatus(serviceStatus)}
  </li>
)

const renderStatus = (serviceStatus: ServiceStatus) =>
  (serviceStatus.isConnected && (
    <span className="footer__service-label">
      <i className="footer__icon--online fa fa-circle " />
      {renderTitle(serviceStatus)}
    </span>
  )) || (
    <span className="footer__service-label">
      <i className="footer__icon--offline fa fa-circle-o" />
      {serviceStatus.serviceType}
    </span>
  )

const renderTitle = ({ serviceType, connectedInstanceCount }: ServiceStatus) =>
  `${serviceType} (${connectedInstanceCount} ${renderConnectedNodesText(connectedInstanceCount)})`

const renderConnectedNodesText = (connectedInstanceCount: number) => (connectedInstanceCount === 1 && 'node') || 'nodes'

export default withEnvironment(Footer)
