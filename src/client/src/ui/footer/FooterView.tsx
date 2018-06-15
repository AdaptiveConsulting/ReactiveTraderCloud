import * as classnames from 'classnames'
import * as _ from 'lodash'
import * as React from 'react'
import { StatusIndicator } from './StatusIndicator'

import { ConnectionInfo } from '../../services/connectionStatusService'
import { ConnectionStatus, ConnectionType, ServiceConnectionInfo } from '../../system'
import { ApplicationStatusConst, ServiceStatus } from '../../types'

interface FooterViewProps {
  compositeStatusService: ServiceConnectionInfo
  connectionStatus: ConnectionInfo
  toggleStatusServices: () => any // https://github.com/DefinitelyTyped/DefinitelyTyped/issues/25874
  displayStatusServices: boolean
  isRunningOnDesktop: boolean
  openLink: (link: string) => any // https://github.com/DefinitelyTyped/DefinitelyTyped/issues/25874
}

const ADAPTIVE_URL: string = 'http://www.weareadaptive.com'
const OPENFIN_URL: string = 'http://openfin.co'

export const FooterView: React.SFC<FooterViewProps> = (props: FooterViewProps) => {
  const servicesAsList = _.values(props.compositeStatusService)

  const panelClasses = classnames('footer__service-status-panel', {
    hide: !isConnected(props.connectionStatus.status) || !props.displayStatusServices
  })

  const openfinLogoClassName = classnames('footer__logo', {
    'footer__logo-openfin': props.isRunningOnDesktop
  })
  const footerClasses = classnames('footer', {
    'footer--disconnected': !isConnected(props.connectionStatus.status)
  })

  return (
    <footer className={footerClasses}>
      <span className="footer__connection-url">
        {isConnected(props.connectionStatus.status)
          ? `Connected to ${props.connectionStatus.url} (${props.connectionStatus.transportType})`
          : 'Disconnected'}{' '}
      </span>
      <span className="footer__logo-container">
        <span className={openfinLogoClassName} onClick={() => props.openLink(OPENFIN_URL)} />
        <span className="footer__logo footer__logo-adaptive" onClick={() => props.openLink(ADAPTIVE_URL)} />
      </span>
      <div
        className="footer__status-indicator-wrapper"
        onMouseOut={() => props.toggleStatusServices()}
        onMouseOver={() => props.toggleStatusServices()}
      >
        <StatusIndicator
          status={getApplicationStatus(
            props.connectionStatus.status,
            servicesAsList,
            props.connectionStatus.transportType
          )}
        />
      </div>
      <div className={panelClasses}>
        <ul className="footer__services">
          <li className="footer__service" key={Math.random()}>
            {renderBroker(props.connectionStatus.status)}
          </li>
          {servicesAsList.map(renderServiceStatus)}
        </ul>
      </div>
    </footer>
  )
}

const getApplicationStatus = (connection: ConnectionStatus, services, connectionType) => {
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

const renderServiceStatus = (serviceStatus: ServiceStatus) => {
  const statusSpan = renderStatus(serviceStatus)
  return (
    <li className="footer__service" key={Math.random()}>
      {statusSpan}
    </li>
  )
}

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

const renderStatus = serviceStatus =>
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

const renderConnectedNodesText = (connectedInstanceCount: number) => (connectedInstanceCount === 1 && 'node') || 'nodes'

const renderTitle = ({ serviceType, connectedInstanceCount }) =>
  `${serviceType} (${connectedInstanceCount} ${renderConnectedNodesText(connectedInstanceCount)})`

export default FooterView
