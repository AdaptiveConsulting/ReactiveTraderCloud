import React, { PureComponent } from 'react'

export interface TimerProps {
  name?: string
  duration: number
  timeout?: (name?: string) => any
  interval?: (name?: string) => any
  children?: (name?: string) => any
}

export class Timer extends PureComponent<TimerProps, { id: NodeJS.Timer }> {
  id = (this.props.interval ? setInterval : setTimeout)(() => {
    const { name, children, interval, timeout } = this.props

    return (children || interval || timeout)(name)
  }, this.props.duration)

  componentWillUnmount() {
    const { interval } = this.props
    ;(interval ? clearInterval : clearTimeout)(this.id)
  }

  render(): null {
    return null
  }
}

export default Timer
