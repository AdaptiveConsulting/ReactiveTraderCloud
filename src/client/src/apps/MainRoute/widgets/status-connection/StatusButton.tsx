import React, { useCallback, SyntheticEvent, useRef } from 'react'
import { ConnectionInfo } from 'rt-system'
import { ServiceConnectionStatus, ServiceStatus } from 'rt-types'
import {
  Button,
  StatusCircle,
  StatusLabel,
  Root,
  AppUrl,
  ServiceListPopup,
  ServiceList,
} from './styled'
import Service from './Service'
import { FooterVersion } from 'rt-components'
import { usePopUpMenu } from 'rt-util'

interface Props {
  connectionStatus: ConnectionInfo
  services: ServiceStatus[]
}

const getApplicationStatus = (services: ServiceStatus[]) => {
  if (services.every(s => s.connectionStatus === ServiceConnectionStatus.CONNECTED)) {
    return ServiceConnectionStatus.CONNECTED
  }
  if (services.some(s => s.connectionStatus === ServiceConnectionStatus.CONNECTING)) {
    return ServiceConnectionStatus.CONNECTING
  }
  return ServiceConnectionStatus.DISCONNECTED
}

const selectAll = (event: SyntheticEvent) => {
  const input = event.target as HTMLInputElement
  input.select()
}

export const StatusButton: React.FC<Props> = ({ connectionStatus: { url }, services }) => {
  const ref = useRef<HTMLDivElement>(null)
  const { displayMenu, setDisplayMenu } = usePopUpMenu(ref)

  const toggleMenu = useCallback(() => {
    setDisplayMenu(!displayMenu)
  }, [displayMenu, setDisplayMenu])

  const appUrl = url
  const appStatus = getApplicationStatus(services)
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
