import React, { Component } from 'react'
import Ink from 'react-ink'

import { Environment, withEnvironment } from 'rt-components'
import { Flex, TickCross } from 'rt-components'
import { styled } from 'rt-util'
import { ConnectionType, ServiceConnectionInfo } from 'system'

import ServiceStatus from './ServiceStatus'

// const ADAPTIVE_URL: string = 'http://www.weareadaptive.com'
// const OPENFIN_URL: string = 'http://openfin.co'

interface IsExpandedProps {
  isExpanded: boolean
}
const FooterContainer = styled('div')<IsExpandedProps>`
  position: relative;
  width: 100%;
  transition: transform ${({ theme }) => theme.animationSpeed.slow};
  transform: translate(
    0px,
    ${({ isExpanded, theme }) => (isExpanded ? '-' + theme.footer.serviceStatus.height : '0px')}
  );
  will-change: transform;
`

interface IsConnectedProps {
  isConnected: boolean
}
const StyledFooter = styled(Flex)<IsConnectedProps>`
  position: relative;
  height: ${({ theme: { footer } }) => footer.bar.height};
  max-height: ${({ theme: { footer } }) => footer.bar.height};
  color: ${({ theme: { footer } }) => footer.text.color};
  background-color: ${({ theme: { footer }, isConnected }) =>
    isConnected ? footer.bar.colorConnected : footer.bar.colorDisconnected};
  padding-left: ${({ theme: { footer } }) => footer.bar.sidePadding};
  padding-right: ${({ theme: { footer } }) => footer.bar.sidePadding};
  cursor: pointer;
`

const FooterText = styled('p')`
  font-size: ${({ theme: { footer } }) => footer.text.fontSize};
  margin: 0px;
`

interface IsExpandedProps {
  isExpanded: boolean
}
const ExpandIcon = styled('i')<IsExpandedProps>`
  transform: rotate(${({ isExpanded }) => (isExpanded ? 180 : 0)}deg);
  transition: transform ${({ theme }) => theme.animationSpeed.slow};
  will-change: transform;
`

const Padding = styled('div')`
  flex: 1;
`

const ServiceStatusContainer = styled('div')<IsExpandedProps>`
  position: absolute;
  top: 100%;
  height: ${({ theme: { footer } }) => footer.serviceStatus.height};
  width: 100%;
`

export interface FooterProps {
  url: string
  isConnected: boolean
  transportType: ConnectionType
  serviceStatus: ServiceConnectionInfo
}
interface PropsWithEnvironment extends FooterProps {
  environment: Environment
}

interface State {
  isExpanded: boolean
}
const initialState = {
  isExpanded: false
}

class Footer extends Component<PropsWithEnvironment, State> {
  constructor(props: PropsWithEnvironment) {
    super(props)
    this.state = initialState

    this.toggleExpand = this.toggleExpand.bind(this)
  }

  toggleExpand() {
    const { isExpanded } = this.state
    this.setState({
      isExpanded: !isExpanded
    })
  }

  render() {
    const { url, isConnected, serviceStatus, transportType } = this.props
    const { isExpanded } = this.state

    return (
      <FooterContainer isExpanded={isExpanded}>
        <StyledFooter direction="row" alignItems="center" isConnected={isConnected} onClick={this.toggleExpand}>
          <Ink />
          <TickCross isTick={isConnected} />
          <FooterText>{isConnected ? `Connected to ${url} (${transportType})` : 'Disconnected'}</FooterText>
          <Padding />
          <ExpandIcon className="fas fa-chevron-up" isExpanded={isExpanded} />
        </StyledFooter>
        <ServiceStatusContainer isExpanded={isExpanded}>
          <ServiceStatus serviceStatus={serviceStatus} />
        </ServiceStatusContainer>
      </FooterContainer>
    )
  }
}

export default withEnvironment(Footer)
