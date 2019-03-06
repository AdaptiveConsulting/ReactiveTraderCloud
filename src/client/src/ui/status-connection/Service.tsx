import React from 'react'

import { ServiceConnectionStatus, ServiceStatus } from 'rt-types'
import { StatusCircle, NodeCount, ServiceName, ServiceRoot } from './styled'

const Service: React.FC<{ service: ServiceStatus }> = ({
  service: { serviceType, connectionStatus, connectedInstanceCount },
}) => (
  <ServiceRoot>
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <StatusCircle status={connectionStatus} />
      <ServiceName>{serviceType}</ServiceName>
    </div>

    {connectionStatus === ServiceConnectionStatus.CONNECTED && (
      <NodeCount>
        ({connectedInstanceCount} {connectedInstanceCount !== 1 ? 'Nodes' : 'Node'})
      </NodeCount>
    )}
  </ServiceRoot>
)
export default Service
