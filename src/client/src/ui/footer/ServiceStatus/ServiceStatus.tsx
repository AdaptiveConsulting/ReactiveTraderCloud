import React from 'react'

import { Flex, TickCross } from 'rt-components'
import { ServiceConnectionInfo } from 'rt-system'
import { styled } from 'rt-util'

const StyledServiceStatus = styled(Flex)`
  position: relative;
  width: 100%;
  height: 100%;
`

interface ServiceItemProps {
  order: number
  isConnected: boolean
}
const ServiceItem = styled(Flex)<ServiceItemProps>`
  height: 100%;
  flex: 1;
  background-color: ${({ theme, isConnected, order }) =>
    isConnected
      ? theme.footer.serviceStatus.connectedColors[order]
      : theme.footer.serviceStatus.disconnectedColors[order]};
  color: ${({ theme }) => theme.footer.serviceStatus.textColor};
`

const ServiceName = styled('p')`
  margin: 0px;
  margin-bottom: 6px;
  font-size: ${({ theme }) => theme.footer.serviceStatus.fontSize};
  text-transform: capitalize;
`

const NodeCount = styled('p')`
  margin: 0px;
  opacity: 0.75;
  font-size: ${({ theme }) => theme.footer.serviceStatus.nodeFontSize};
`

interface Props {
  serviceStatus: ServiceConnectionInfo
}
const ServiceStatus: React.SFC<Props> = ({ serviceStatus }: Props) => (
  <StyledServiceStatus direction="row">
    {Object.values(serviceStatus).map((service, i) => (
      <ServiceItem
        isConnected={service.isConnected}
        order={i}
        key={service.serviceType}
        direction="row"
        alignItems="center"
        justifyContent="center"
      >
        <TickCross isTick={service.isConnected} />
        <Flex direction="column">
          <ServiceName>{service.serviceType}</ServiceName>
          {!!service.connectedInstanceCount && (
            <NodeCount>{`(${service.connectedInstanceCount} Node${
              service.connectedInstanceCount !== 1 ? 's' : ''
            })`}</NodeCount>
          )}
        </Flex>
      </ServiceItem>
    ))}
  </StyledServiceStatus>
)

export default ServiceStatus
