import React, { SyntheticEvent, useCallback, useRef } from 'react'
import { ConnectionInfo } from 'rt-system'
import { ServiceConnectionStatus, ServiceStatus } from 'rt-types'
import { usePopUpMenu } from 'rt-util'
import FooterVersion from '../footer-version'
import Service from './Service'
import {
  AppUrl,
  Button,
  Root,
  ServiceList,
  ServiceListPopup,
  StatusCircle,
  StatusLabel,
} from './styled'

interface Props {
  connectionStatus: ConnectionInfo
  services: ServiceStatus[]
}

export const StatusButton: React.FC<Props> = ({ connectionStatus: { url }, services }) => {
  const ref = useRef<HTMLDivElement>(null)
  const { displayMenu, setDisplayMenu } = usePopUpMenu(ref)
  const toggleMenu = useCallback(() => {
    setDisplayMenu(!displayMenu)
  }, [displayMenu, setDisplayMenu])

  const selectAll = useCallback((event: SyntheticEvent) => {
    const input = event.target as HTMLInputElement
    input.select()
  }, [])

  const appStatus: ServiceConnectionStatus = getConnectionStatus(services)

  const appUrl = `${url}`
  return (
    <Root ref={ref}>
      <Button onClick={toggleMenu} data-qa="status-button__toggle-button">
        <StatusCircle status={appStatus} />
        <StatusLabel status={appStatus} />
      </Button>

      <ServiceListPopup open={displayMenu}>
        <ServiceList>
          <AppUrl title={appUrl} readOnly value={appUrl} onFocus={selectAll} onClick={selectAll} />

          {services.map(service => (
            <Service key={service.serviceType} service={service} />
          ))}

          <FooterVersion />
        </ServiceList>
      </ServiceListPopup>
    </Root>
  )
}

function getConnectionStatus(services: ServiceStatus[]) {
  let appStatus: ServiceConnectionStatus
  if (services.every(s => s.connectionStatus === ServiceConnectionStatus.CONNECTED)) {
    return ServiceConnectionStatus.CONNECTED
  } else if (services.some(s => s.connectionStatus === ServiceConnectionStatus.CONNECTING)) {
    appStatus = ServiceConnectionStatus.CONNECTING
  } else {
    appStatus = ServiceConnectionStatus.DISCONNECTED
  }
  return appStatus
}
