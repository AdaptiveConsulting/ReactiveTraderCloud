import React, { Component } from 'react'
import { keyframes, styled } from 'rt-theme'
import { ServiceConnectionStatus } from 'rt-types'
import DisconnectIcon from '../icons/DisconnectIcon'

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

const Spinner = styled.div`
  margin: 6.25rem auto;
  width: 3.125rem;
  height: 2.5rem;
  text-align: center;
  font-size: 0.625rem;
`

const stretch = keyframes`
    0%, 40%, 100% {
      transform: scaleY(0.4);
    }
    20% {
      transform: scaleY(1);
    }
`

const Rect = styled.div<{ delay?: number }>`
  background-color: ${({ theme }) => theme.component.textColor};
  margin: 0 0.0625rem;
  height: 100%;
  width: 0.375rem;
  display: inline-block;

  animation: ${stretch} 1.2s infinite ease-in-out;

  animation-delay: -${({ delay }) => delay}s;
`

interface Props {
  status: ServiceConnectionStatus
  render: () => JSX.Element
  onMount?: () => void
  message?: string
  minWidth?: number
}

const Loader = () => (
  <Spinner>
    <Rect />
    <Rect delay={1.1} />
    <Rect delay={1} />
    <Rect delay={0.9} />
    <Rect delay={0.8} />
  </Spinner>
)

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
          <Loader />
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
