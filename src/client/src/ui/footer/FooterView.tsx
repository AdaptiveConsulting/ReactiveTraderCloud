import * as classnames from 'classnames'
import * as _ from 'lodash'
import * as React from 'react'
import { StatusIndicator } from './StatusIndicator'

import { Connections } from '../../connectionStatusOperations'
import { ConnectionStatus, ConnectionType } from '../../system'
import { ApplicationStatusConst, ServiceStatus } from '../../types'

export interface Services {
  pricing: ServiceStatus
  reference: ServiceStatus
  blotter: ServiceStatus
  execution: ServiceStatus
  analytics: ServiceStatus
}

interface FooterViewProps {
  compositeStatusService: Services
  connectionStatus: Connections
  toggleStatusServices: () => void
  displayStatusServices: boolean
  isRunningInOpenFin: boolean
  openFin: any
}

const ADAPTIVE_URL: string = 'http://www.weareadaptive.com'
const OPENFIN_URL: string = 'http://openfin.co'

export const FooterView: React.SFC<FooterViewProps> = (
  props: FooterViewProps
) => {
  const servicesAsList = _.values(props.compositeStatusService)

  const panelClasses = classnames('footer__service-status-panel', {
    hide:
      !isConnected(props.connectionStatus.connection) ||
      !props.displayStatusServices
  })

  const openfinLogoClassName = classnames('footer__logo', {
    'footer__logo-openfin': props.isRunningInOpenFin
  })
  const footerClasses = classnames('footer', {
    'footer--disconnected': !isConnected(props.connectionStatus.connection)
  })

  const openLink = (url: string) => {
    props.isRunningInOpenFin
      ? props.openFin.openLink(url)
      : window.open(url, '_blank')
  }

  return (
    <footer className={footerClasses}>
      <span className="footer__connection-url">
        {isConnected(props.connectionStatus.connection)
          ? `Connected to ${props.connectionStatus.url} (${
              props.connectionStatus.connectionType
            })`
          : 'Disconnected'}{' '}
      </span>
      <span className="footer__logo-container">
        <span
          className={openfinLogoClassName}
          onClick={() => openLink(OPENFIN_URL)}
        />
        <span
          className="footer__logo footer__logo-adaptive"
          onClick={() => openLink(ADAPTIVE_URL)}
        />
      </span>
      <div
        className="footer__status-indicator-wrapper"
        onMouseOut={() => props.toggleStatusServices()}
        onMouseOver={() => props.toggleStatusServices()}
      >
        <StatusIndicator
          status={getApplicationStatus(
            props.connectionStatus.connection,
            servicesAsList,
            props.connectionStatus.connectionType
          )}
        />
      </div>
      <div className={panelClasses}>
        <ul className="footer__services">
          <li className="footer__service" key={Math.random()}>
            {renderBroker(props.connectionStatus.connection)}
          </li>
          {servicesAsList.map(renderServiceStatus)}
        </ul>
      </div>
    </footer>
  )
}

const getApplicationStatus = (
  connection: ConnectionStatus,
  services,
  connectionType
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

const isConnected = (connection: ConnectionStatus) =>
  connection === ConnectionStatus.connected

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

const renderConnectedNodesText = (connectedInstanceCount: number) =>
  (connectedInstanceCount === 1 && 'node') || 'nodes'

const renderTitle = ({ serviceType, connectedInstanceCount }) =>
  `${serviceType} (${connectedInstanceCount} ${renderConnectedNodesText(
    connectedInstanceCount
  )})`

export default FooterView
