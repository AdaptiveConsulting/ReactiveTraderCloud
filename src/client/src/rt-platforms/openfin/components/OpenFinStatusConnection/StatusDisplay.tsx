import React, { useCallback, SyntheticEvent } from 'react'
import { Flex, FooterVersion } from 'rt-components'
import { ConnectionInfo } from 'rt-system'
import { ServiceStatus } from 'rt-types'
import Service from './Service'
import { AppUrl, ServiceList, Background, Header } from './styled'

interface Props {
  connectionStatus: ConnectionInfo
  services: ServiceStatus[]
}

const StatusDisplay: React.FC<Props> = ({ connectionStatus: { url }, services }) => {
  const selectAll = useCallback((event: SyntheticEvent) => {
    const input = event.target as HTMLInputElement
    input.select()
  }, [])

  const appUrl = `${url}`

  return (
    <Background>
      <Header>Connections</Header>
      <Flex direction="column">
        <ServiceList>
          <AppUrl
            title={appUrl}
            readOnly={true}
            value={appUrl}
            onFocus={selectAll}
            onClick={selectAll}
          />
          {services.map(service => (
            <Service key={service.serviceType} service={service} />
          ))}
        </ServiceList>
        <FooterVersion />
      </Flex>
    </Background>
  )
}

export default StatusDisplay
