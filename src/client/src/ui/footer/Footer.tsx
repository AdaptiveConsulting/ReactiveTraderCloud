import React, { Component } from 'react'
import Ink from 'react-ink'

import { Environment, withEnvironment } from 'rt-components'
import { styled } from 'rt-util'
import { ConnectionType, ServiceConnectionInfo } from 'system'

import ServiceStatus from './ServiceStatus'

// const ADAPTIVE_URL: string = 'http://www.weareadaptive.com'
// const OPENFIN_URL: string = 'http://openfin.co'

const FooterContainer = styled('div')`
  position: relative;
  width: 100%;
`

interface IsConnectedProps {
  isConnected: boolean
}
const StyledFooter = styled('div')<IsConnectedProps>`
  position: relative;
  height: ${({ theme: { footer } }) => footer.bar.height};
  max-height: ${({ theme: { footer } }) => footer.bar.height};
  width: 100%;
  color: ${({ theme: { footer } }) => footer.text.color};
  background-color: ${({ theme: { footer }, isConnected }) =>
    isConnected ? footer.bar.colorConnected : footer.bar.colorDisconnected};
  padding-left: ${({ theme: { footer } }) => footer.bar.sidePadding};
  padding-right: ${({ theme: { footer } }) => footer.bar.sidePadding};
  display: flex;
  flex-direction: row;
  align-items: center;
  cursor: pointer;
`

const FooterText = styled('p')`
  font-size: ${({ theme: { footer } }) => footer.text.fontSize};
  margin: 0px;
`

const FooterIcon = styled('div')<IsConnectedProps>`
  width: ${({ theme: { footer } }) => footer.icon.size};
  height: ${({ theme: { footer } }) => footer.icon.size};
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme: { footer }, isConnected }) =>
    isConnected ? footer.icon.backgroundColorConnected : footer.icon.backgroundColorDisonnected};
  border-radius: 50%;
  margin-right: 20px;
`

interface IsExpandedProps {
  isExpanded: boolean
}
const ExpandIcon = styled('i')<IsExpandedProps>`
  transform: rotate(${({ isExpanded }) => (isExpanded ? 180 : 0)}deg);
  transition: transform 0.5s;
  will-change: transform;
`

const Padding = styled('div')`
  flex: 1;
`

const ServiceStatusContainer = styled('div')<IsExpandedProps>`
  position: absolute;
  bottom: 100%;
  left: 0px;
  color: black;
  transform: translate(0px, ${({ isExpanded }) => (isExpanded ? '0%' : '100%')});
  opacity: ${({ isExpanded }) => (isExpanded ? 1 : 0)};
  will-change: transform, opacity;
  transition: transform 0.5s, opacity 0.5s;
  height: 200px;
  max-height: 200px;
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
      <FooterContainer>
        <ServiceStatusContainer isExpanded={isExpanded}>
          <ServiceStatus serviceStatus={serviceStatus} />
        </ServiceStatusContainer>
        <StyledFooter isConnected={isConnected} onClick={this.toggleExpand}>
          <Ink />
          <FooterIcon isConnected={isConnected}>
            <i className={`fas fa-${isConnected ? 'check' : 'times'}`} />
          </FooterIcon>
          <FooterText>{isConnected ? `Connected to ${url} (${transportType})` : 'Disconnected'}</FooterText>
          <Padding />
          <ExpandIcon className="fas fa-chevron-up" isExpanded={isExpanded} />
        </StyledFooter>
      </FooterContainer>
    )
  }
}

export default withEnvironment(Footer)
