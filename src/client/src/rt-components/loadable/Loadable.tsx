import React, { Component } from 'react'
import { styled } from 'rt-theme'
import { ServiceConnectionStatus } from 'rt-types'
import DisconnectIcon from '../icons/DisconnectIcon'
import { AdaptiveLoader } from 'rt-components'

const LoadableStyle = styled.div<{ minWidth?: string }>`
  width: 100%;
  min-width: ${({ minWidth = '100%' }) => minWidth};
  height: 100%;
  border-radius: 0.1875rem;
  background-color: ${({ theme }) => theme.component.backgroundColor};
  color: ${({ theme }) => theme.component.textColor};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  opacity: 0.59;
  fill: ${({ theme }) => theme.component.textColor};
`

const Content = styled.div<{ minWidth?: string }>`
  height: 100%;
  width: 100%;
  min-width: ${({ minWidth = '100%' }) => minWidth};
`

interface Props {
  status: ServiceConnectionStatus
  render: () => JSX.Element
  onMount?: () => void
  message?: string
  minWidth?: number
}

export default class Loadable extends Component<Props> {
  componentDidMount = () => this.props.onMount && this.props.onMount()

  render() {
    const { status, render, message = 'Disconnected', minWidth } = this.props

    if (status === ServiceConnectionStatus.CONNECTED) {
      return <Content minWidth={`${minWidth}rem`}>{render()}</Content>
    }

    return (
      <LoadableStyle minWidth={`${minWidth}rem`}>
        {status === ServiceConnectionStatus.CONNECTING ? (
          <AdaptiveLoader size={50} speed={1.4} />
        ) : (
          <React.Fragment>
            <div>
              <DisconnectIcon width={2.75} height={3} />
            </div>
            <div>{message}</div>
          </React.Fragment>
        )}
      </LoadableStyle>
    )
  }
}
