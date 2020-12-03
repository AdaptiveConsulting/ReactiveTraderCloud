import React, { useState, useCallback, useEffect, useMemo } from 'react'

import { ConnectionInfo } from 'rt-system'
import { ServiceConnectionStatus, ServiceStatus } from 'rt-types'
import { createOpenFinPopup, showOpenFinPopup } from '../utils'
import { Button, StatusCircle, StatusLabel, Root } from './styled'

interface Props {
  connectionStatus: ConnectionInfo
  services: ServiceStatus[]
}

const OpenFinStatusButton: React.FC<Props> = ({ services }) => {
  const [appStatus, setAppStatus] = useState<ServiceConnectionStatus>()
  const [showing, setShowing] = React.useState(false)

  const baseWin = useMemo(() => ({ name: 'status', height: 350, width: 260 }), [])
  const pathname = '/status'

  const showPopup = useCallback(() => {
    if (!showing) {
      setShowing(true)
      showOpenFinPopup(baseWin, [10, 40])
    }
  }, [baseWin, showing])

  React.useEffect(() => {
    createOpenFinPopup(baseWin, pathname, () => setShowing(false))
  }, [baseWin])

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

export default OpenFinStatusButton
