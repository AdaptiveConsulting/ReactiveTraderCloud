import React from 'react'
import styled from 'react-emotion'

import { Flex, TickCross } from 'rt-components'
import { ServiceConnectionInfo } from 'system'

interface Props {
  serviceStatus: ServiceConnectionInfo
}

const ServiceStatus: React.SFC<Props> = ({ serviceStatus }) => (
  <React.Fragment>
    {Object.values(serviceStatus).map((service, i) => (
      <ServiceItem key={service.serviceType}>
        <TickCross isTick={service.isConnected} />
        <Flex direction="column">
          <ServiceName>{service.serviceType}</ServiceName>
          {!!service.connectedInstanceCount && (
            <NodeCount>
              ({service.connectedInstanceCount} Node{service.connectedInstanceCount !== 1
                ? 's'
                : ''})
            </NodeCount>
          )}
        </Flex>
      </ServiceItem>
    ))}
  </React.Fragment>
)

const ServiceItem = styled('div')`
  display: flex;
  flex: 1;
  height: 100%;
  padding: 0 1rem;

  background-color: ${props => props.theme.backgroundColor};
  color: ${props => props.theme.color};
`

const ServiceName = styled('div')`
  text-transform: capitalize;
  font-size: 1.25rem;
`

const NodeCount = styled('div')`
  opacity: 0.75;
`

export default ServiceStatus
