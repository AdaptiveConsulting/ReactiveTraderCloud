import React from 'react'
import { styled } from 'rt-theme'
import Portal, { PortalProps } from './Portal'

export const TearOffContainer = styled.div`
  width: 100%;
  height: 100%;
`

type RenderCB = (popOut: () => void, tornOff: boolean) => JSX.Element

interface Props {
  id: string
  render: RenderCB
  portalProps: Partial<PortalProps>
}

interface State {
  tornOff: boolean
}

export default class TearOff extends React.PureComponent<Props, State> {
  state = { tornOff: false }

  popOut = () => {
    this.setState({ tornOff: true })
  }

  popIn = () => {
    this.setState({ tornOff: false })
  }

  render() {
    const { render, portalProps } = this.props
    const { tornOff } = this.state
    if (tornOff) {
      return (
        <Portal onUnload={this.popIn} {...portalProps}>
          <TearOffContainer>{render(this.popOut, tornOff)}</TearOffContainer>
        </Portal>
      )
    }
    return render(this.popOut, tornOff)
  }
}
