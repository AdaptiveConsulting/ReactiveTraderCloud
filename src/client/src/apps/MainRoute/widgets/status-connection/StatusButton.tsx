import React, { useState, useCallback, SyntheticEvent, useEffect } from 'react'

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

interface Props {
  connectionStatus: ConnectionInfo
  services: ServiceStatus[]
}

export const StatusButton: React.FC<Props> = ({ connectionStatus: { url }, services }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [appStatus, setAppStatus] = useState<ServiceConnectionStatus>()

  const toggleOpen = useCallback(
    (event: SyntheticEvent) => {
      const isAppUrl = (element: any) => element instanceof HTMLInputElement

      if (!isAppUrl(event.target)) {
        setIsOpen(!isOpen)
      }
    },
    [isOpen, setIsOpen],
  )

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
    <Root>
      <Button onClick={toggleOpen} data-qa="status-button__toggle-button">
        <StatusCircle status={appStatus} />
        <StatusLabel status={appStatus} />
      </Button>

      <ServiceListPopup open={isOpen} onClick={toggleOpen}>
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
