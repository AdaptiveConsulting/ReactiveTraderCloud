import React from "react"

import { ServiceConnectionStatus } from "services/connection"
import { ServiceInstanceStatus } from "services/status"
import { StatusCircle, NodeCount, ServiceName, ServiceRoot } from "./styled"

const Service: React.FC<{ service: ServiceInstanceStatus }> = ({
  service: { serviceType, serviceLoad },
}) => (
  <ServiceRoot>
    <div style={{ display: "flex", alignItems: "center" }}>
      <StatusCircle
        status={
          serviceLoad > 0
            ? ServiceConnectionStatus.CONNECTED
            : ServiceConnectionStatus.DISCONNECTED
        }
      />
      <ServiceName>{serviceType}</ServiceName>
    </div>

    <NodeCount>
      ({serviceLoad} {serviceLoad !== 1 ? "Nodes" : "Node"})
    </NodeCount>
  </ServiceRoot>
)
export default Service
