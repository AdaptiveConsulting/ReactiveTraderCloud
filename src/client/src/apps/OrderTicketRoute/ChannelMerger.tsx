import { isEqual } from 'lodash'
import { PureComponent } from 'react'

export type Source = 'microphone' | 'sample'

interface Props {
  context: AudioContext
  children: (state: State) => React.ReactNode
  inputs: AudioNode[]
  outputs: AudioDestinationNode[]
}

interface State {
  destination: AudioDestinationNode | ChannelMergerNode
  inputs: AudioNode[]
  outputs: AudioNode[]
}

class ChannelMerger extends PureComponent<Props, State> {
  static defaultProps: Partial<Props> = {
    inputs: [],
    outputs: [],
    children: (): null => null,
  }

  state: State = {
    destination: this.props.context.createChannelMerger(1),
    inputs: [],
    outputs: [],
  }

  static getDerivedStateFromProps({ inputs, outputs }: Props, current: State) {
    let next: State = { inputs: [], outputs: [], destination: current.destination }

    if (!isEqual(inputs, current.inputs)) {
      current.inputs.map((input: AudioNode) => input && input.disconnect(current.destination))
      inputs.map((input: AudioNode) => input && input.connect(current.destination))

      next = { ...next, inputs }
    }

    if (!isEqual(outputs, current.outputs)) {
      current.outputs.map((output: AudioNode) => output && current.destination.disconnect(output))
      outputs.map((output: AudioNode) => output && current.destination.connect(output))

      next = { ...next, outputs }
    }
    return next
  }

  componentWillUnmount() {
    const { destination, inputs, outputs } = this.state
    inputs.map(input => input.disconnect(destination))
    outputs.map(output => destination.disconnect(output))
  }

  render() {
    const { children } = this.props

    return children(this.state)
  }
}

export default ChannelMerger
export { ChannelMerger }
