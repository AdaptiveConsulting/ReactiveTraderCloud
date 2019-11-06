import { PureComponent } from 'react'
import { RequireOnlyOne } from 'rt-util'

interface Props {
  duration: number
  immediate?: boolean
  timeout: () => unknown
  interval: () => unknown
}

export type TimerProps = RequireOnlyOne<Props, 'timeout' | 'interval'>

export class Timer extends PureComponent<TimerProps> {
  id?: number

  componentDidMount() {
    const { interval, timeout, duration, immediate } = this.props

    this.id = interval
      ? window.setInterval(interval, duration)
      : timeout && window.setTimeout(timeout, duration)

    if (immediate) {
      const intervalOrTimeout = interval || timeout
      intervalOrTimeout && intervalOrTimeout()
    }
  }

  componentWillUnmount() {
    const clearFn = this.props.interval ? clearInterval : clearTimeout
    clearFn(this.id)
  }

  render(): null {
    return null
  }
}

export default Timer
