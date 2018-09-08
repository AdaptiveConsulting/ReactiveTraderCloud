import React from 'react'
import { css, styled } from 'rt-theme'
import Portal, { PortalProps } from './Portal'

interface TearOffContainerHeight {
  height: number
}

const tearStyle = ({ height }: TearOffContainerHeight) =>
  css`
    height: ${height};
  `

export const TearOffContainer = styled.div`
  width: 100%;
  height: ${tearStyle};
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
          <TearOffContainer height={portalProps.config.height - 24}>{render(this.popOut, tornOff)}</TearOffContainer>
        </Portal>
      )
    }
    return render(this.popOut, tornOff)
  }
}
