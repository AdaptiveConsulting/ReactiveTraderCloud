import { PureComponent } from 'react'

export interface TimerProps {
  name?: string
  duration: number
  immediate?: boolean
  timeout?: (name?: string) => void
  interval?: (name?: string) => unknown
  children?: (name?: string) => React.ReactNode
}

export class Timer extends PureComponent<TimerProps> {
  id: NodeJS.Timer

  callback = () => {
    const { name, children, interval, timeout } = this.props

    return (children || interval || timeout)(name)
  }

  componentDidMount() {
    const { interval, duration, immediate } = this.props

    this.id = (interval ? setInterval : setTimeout)(this.callback, duration)

    if (immediate) {
      this.callback()
    }
  }

  componentWillUnmount() {
    const { interval } = this.props
    ;(interval ? clearInterval : clearTimeout)(this.id)
  }

  render(): null {
    return null
  }
}

export default Timer
