import React, { useState, useCallback, useEffect } from 'react'

import { ConnectionInfo } from 'rt-system'
import { ServiceConnectionStatus, ServiceStatus } from 'rt-types'
import { createOpenFinPopup, Offset, showOpenFinPopup } from '../utils'
import { Button, StatusCircle, StatusLabel, Root } from './styled'

interface Props {
  connectionStatus: ConnectionInfo
  services: ServiceStatus[]
}

export const StatusButton: React.FC<Props> = ({ services }) => {
  const [appStatus, setAppStatus] = useState<ServiceConnectionStatus>()
  const [showing, setShowing] = React.useState(false);

  const baseWin = { name: 'openfin-status-popup', height: 350, width: 260 }
  const offset: Offset = [10, 40];
  const URL = '/status';

  const showPopup = useCallback(() => {
    if (!showing) {
      setShowing(true)
      showOpenFinPopup(baseWin, offset)
    }
  }, [baseWin, offset, showing])

  React.useEffect(() => { createOpenFinPopup(baseWin, URL, () => setShowing(false)) }, [baseWin]);

  useEffect(() => {
    if (services.every(s => s.connectionStatus === ServiceConnectionStatus.CONNECTED)) {
      setAppStatus(ServiceConnectionStatus.CONNECTED)
    } else if (services.some(s => s.connectionStatus === ServiceConnectionStatus.CONNECTING)) {
      setAppStatus(ServiceConnectionStatus.CONNECTING)
    } else {
      setAppStatus(ServiceConnectionStatus.DISCONNECTED)
    }
  }, [services])

  return (
    <Root>
      <Button onMouseDown={showPopup} data-qa="status-button__toggle-button">
        <StatusCircle status={appStatus} />
        <StatusLabel status={appStatus} />
      </Button>
    </Root>
  )
}
