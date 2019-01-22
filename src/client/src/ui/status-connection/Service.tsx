import _ from 'lodash'
import React, { SFC } from 'react'

import { ServiceConnectionStatus, ServiceStatus } from 'rt-types'
import { StatusCircle, NodeCount, ServiceName, ServiceRoot } from './styled'

const Service: SFC<{ service: ServiceStatus; index: number }> = ({
  service: { serviceType, connectionStatus, connectedInstanceCount },
  index,
}) => (
  <ServiceRoot index={index + 2}>
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
