import React from 'react'
import ExternalWindow, { ExternalWindowProps } from './ExternalWindow'

type RenderCB = (popOut: () => void, tornOff: boolean) => JSX.Element

interface Props {
  id: string
  render: RenderCB
  externalWindowProps: Partial<ExternalWindowProps>
  popIn?: () => void
  popOut?: () => void
}

interface State {
  tornOff: boolean
}

export default class TearOff extends React.PureComponent<Props, State> {
  state = { tornOff: false }

  popOut = () => {
    if (this.props.popOut) {
      this.props.popOut()
    }
    this.setState({ tornOff: true })
  }

  popIn = () => {
    if (this.props.popIn) {
      this.props.popIn()
    }
    this.setState({ tornOff: false })
  }

  render() {
    const { render, externalWindowProps } = this.props
    const { tornOff } = this.state
    if (tornOff) {
      return <ExternalWindow onUnload={this.popIn} {...externalWindowProps} />
    }
    return render(this.popOut, tornOff)
  }
}
