import React, { useState, useCallback, SyntheticEvent, useEffect } from 'react'

import { ConnectionState } from 'rt-system'
import { ServiceConnectionStatus, ServiceStatus } from 'rt-types'
import { Button, StatusCircle, StatusLabel, Root, AppUrl, ServiceList } from './styled'
import Service from './Service'
import FooterVersion from '../../../../apps/MainRoute/widgets/footer-version'
import { Flex, Modal } from 'rt-components'
import { CloseButton } from '../OpenfinWorkspaceSelection/styled'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes } from '@fortawesome/free-solid-svg-icons'

interface Props {
  connectionStatus: ConnectionState
  services: ServiceStatus[]
}

export const StatusButton: React.FC<Props> = ({
  connectionStatus: { url, transportType },
  services,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [appStatus, setAppStatus] = useState<ServiceConnectionStatus>()

  const toggleOpen = useCallback(
    async (event: SyntheticEvent) => {
      const isAppUrl = (element: any) => element instanceof HTMLInputElement
      if (!isAppUrl(event.target)) {
        const currWin = await fin.Window.getCurrent()
        const views = await currWin.getCurrentViews()
        if (isOpen) {
          views.forEach(v => v.show())
        } else {
          views.forEach(v => v.hide())
        }
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

  const appUrl = `${url} (${transportType})`

  return (
    <Root>
      <Button onClick={toggleOpen} data-qa="status-button__toggle-button">
        <StatusCircle status={appStatus} />
        <StatusLabel status={appStatus} />
      </Button>
      <Modal
        shouldShow={isOpen}
        onOverlayClick={toggleOpen}
        title={
          <Flex justifyContent="space-between">
            <div>Connections</div>
            <CloseButton accent="bad" onClick={toggleOpen} data-qa="openfin-chrome__close">
              <FontAwesomeIcon icon={faTimes} />
            </CloseButton>
          </Flex>
        }
      >
        <Flex direction="column">
          <ServiceList>
            <AppUrl
              title={appUrl}
              readOnly={true}
              value={appUrl}
              onFocus={selectAll}
              onClick={selectAll}
            />
            {services.map(service => (
              <Service key={service.serviceType} service={service} />
            ))}
            <FooterVersion />
          </ServiceList>
        </Flex>
      </Modal>
    </Root>
  )
}
