import React from 'react'

import { TickCross } from 'rt-components'
import { styled } from 'rt-util'
import { ServiceConnectionInfo } from 'system'

const StyledServiceStatus = styled('div')`
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
`

interface ServiceItemProps {
  order: number
  isConnected: boolean
}
const ServiceItem = styled('div')<ServiceItemProps>`
  height: 100%;
  flex: 1;
  background-color: ${({ theme, isConnected, order }) =>
    isConnected
      ? theme.footer.serviceStatus.connectedColors[order]
      : theme.footer.serviceStatus.disconnectedColors[order]};
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.footer.serviceStatus.textColor};
`

const StatusText = styled('div')`
  display: flex;
  flex-direction: column;
`

const ServiceName = styled('p')`
  margin: 0px;
  margin-bottom: 6px;
  font-size: ${({ theme }) => theme.footer.serviceStatus.fontSize};
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
  <StyledServiceStatus>
    {Object.values(serviceStatus).map((service, i) => (
      <ServiceItem isConnected={service.isConnected} order={i} key={service.serviceType}>
        <TickCross isTick={service.isConnected} />
        <StatusText>
          <ServiceName>{service.serviceType}</ServiceName>
          {!!service.connectedInstanceCount && (
            <NodeCount>{`(${service.connectedInstanceCount} Node${
              service.connectedInstanceCount !== 1 ? 's' : ''
            })`}</NodeCount>
          )}
        </StatusText>
      </ServiceItem>
    ))}
  </StyledServiceStatus>
)

export default ServiceStatus
