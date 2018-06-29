import * as React from 'react'
import Portal, { PortalProps } from './Portal'

type RenderCB = () => JSX.Element

export class TearOff extends React.PureComponent<{
  tornOff: boolean
  render: RenderCB
  portalProps: Partial<PortalProps>
}> {
  render() {
    const { render, tornOff, portalProps } = this.props
    if (tornOff) {
      return <Portal {...portalProps}>{render()}</Portal>
    }
    return render()
  }
}
