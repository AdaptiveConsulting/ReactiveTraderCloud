import React from 'react'
import { StatusButton } from './StatusButton'
import { useConnectionStatus, useServiceStatus } from './statusConnectionHooks'

//TODO - revisit redux container pattern
const StatusButtonContainer: React.FC = () => {
  const connectionStatus = useConnectionStatus()
  const services = useServiceStatus()
  return <StatusButton connectionStatus={connectionStatus} services={services}></StatusButton>
}

export default StatusButtonContainer
