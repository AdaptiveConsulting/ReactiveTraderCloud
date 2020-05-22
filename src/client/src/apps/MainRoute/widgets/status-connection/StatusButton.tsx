import React, { useState, useCallback, SyntheticEvent, useEffect, useRef } from 'react'
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
import FooterVersion from '../footer-version'
import { usePopUpMenu } from 'rt-util'

interface Props {
  connectionStatus: ConnectionInfo
  services: ServiceStatus[]
}

export const StatusButton: React.FC<Props> = ({ connectionStatus: { url }, services }) => {
  const ref = useRef<HTMLDivElement>(null)
  const { displayMenu, setDisplayMenu } = usePopUpMenu(ref)
  const [appStatus, setAppStatus] = useState<ServiceConnectionStatus>()

  const toggleMenu = useCallback(() => {
    setDisplayMenu(!displayMenu)
  }, [displayMenu, setDisplayMenu])

  const selectAll = useCallback((event: SyntheticEvent) => {
    const input = event.target as HTMLInputElement
    input.select()
  }, [])

  useEffect(() => {
    if (services.every(s => s.connectionStatus === ServiceConnectionStatus.CONNECTED)) {
      setAppStatus(ServiceConnectionStatus.CONNECTED)
    } else if (services.some(s => s.connectionStatus === ServiceConnectionStatus.CONNECTING)) {
      setAppStatus(ServiceConnectionStatus.CONNECTING)
    } else {
      setAppStatus(ServiceConnectionStatus.DISCONNECTED)
    }
  }, [services])

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
