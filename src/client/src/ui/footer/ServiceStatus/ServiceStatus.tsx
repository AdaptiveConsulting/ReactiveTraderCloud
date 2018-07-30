import React from 'react'

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
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.footer.serviceStatus.textColor};
  p {
    margin: 3px;
    font-size: ${({ theme }) => theme.footer.serviceStatus.fontSize};
  }
`

interface Props {
  serviceStatus: ServiceConnectionInfo
}
const ServiceStatus: React.SFC<Props> = ({ serviceStatus }: Props) => (
  <StyledServiceStatus>
    {Object.entries(serviceStatus).map(([service, data], i) => (
      <ServiceItem isConnected={data.isConnected} order={i} key={data.serviceType}>
        <p>{data.serviceType}</p>
        <p>{`(${data.connectedInstanceCount} node${data.connectedInstanceCount !== 1 ? 's' : ''})`}</p>
      </ServiceItem>
    ))}
  </StyledServiceStatus>
)

export default ServiceStatus
