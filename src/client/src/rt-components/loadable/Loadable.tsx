import React, { Component } from 'react'
import { styled } from 'rt-theme'
import { ServiceConnectionStatus } from 'rt-types'
import DisconnectIcon from '../icons/DisconnectIcon'

const LoadableStyle = styled.div`
  width: 100%;
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

const Spinner = styled.div`
  margin: 6.25rem auto;
  width: 3.125rem;
  height: 2.5rem;
  text-align: center;
  font-size: 0.625rem;
`

const Rect = styled.div<{ delay?: number }>`
  background-color: ${({ theme }) => theme.component.textColor};
  margin: 0 0.0625rem;
  height: 100%;
  width: 0.375rem;
  display: inline-block;

  animation: stretchdelay 1.2s infinite ease-in-out;

  animation-delay: -${({ delay }) => delay}s;

  @keyframes stretchdelay {
    0%,
    40%,
    100% {
      transform: scaleY(0.4);
    }
    20% {
      transform: scaleY(1);
    }
  }
`

interface Props {
  status: ServiceConnectionStatus
  render: () => JSX.Element
  onMount?: () => void
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
    const { status, render } = this.props

    if (status === ServiceConnectionStatus.CONNECTED) {
      return render()
    }

    if (status === ServiceConnectionStatus.CONNECTING) {
      return (
        <LoadableStyle>
          <Loader />
        </LoadableStyle>
      )
    }

    if (status === ServiceConnectionStatus.DISCONNECTED) {
      return (
        <LoadableStyle>
          <div>
            <DisconnectIcon width={2.75} height={3} />
          </div>
          <div>Disconnected</div>
        </LoadableStyle>
      )
    }

    return null
  }
}
