import React, { PureComponent } from 'react'
import styled from 'styled-components'

interface RfqTimerProps {
  onRejected: () => void
  timeout: number
}

interface RfqTimerState {
  timeLeft: number
}

const TimeLeft = styled.div`
  font-size: 10px;
  opacity: 0.6;
`

const ProgressBarWrapper = styled.div`
  background-color: ${({ theme }) => theme.core.darkBackground};
  height: 6px;
  width: 100%;
`

const ProgressBar = styled.div`
  background-color: ${({ theme }) => theme.template.blue.normal};
  border-radius: 3px;
  transition: width 1.67s linear;
  height: 100%;
`

const RejectQuoteButton = styled.button`
  background-color: ${({ theme }) => `${theme.core.lightBackground}`};
  border: ${({ theme }) => `2px solid ${theme.core.darkBackground}`};
  border-radius: 3px;
  font-size: 12px;
  padding: 4px 5px;
  margin-left: 3px;
`

const TimerWrapper = styled.div`
  display: grid;
  align-items: center;
  grid-template-columns: 35px auto 55px;
  grid-template-rows: auto;
  grid-template-areas: 'TimeLeft ProgressBar RejectQuoteButton';
  margin-bottom: -12px;
`

class RfqTimer extends PureComponent<RfqTimerProps, RfqTimerState> {
  intervalId = 0

  static defaultProps = {
    timeout: 60000,
  }

  state = {
    timeLeft: this.props.timeout / 1000,
  }

  componentDidMount() {
    this.intervalId = setInterval(this.updateTimeLeft, 1000)
  }

  componentWillUnmount() {
    clearInterval(this.intervalId)
  }

  updateTimeLeft = () => {
    this.setState(prevState => {
      if (prevState.timeLeft > 0) {
        return {
          timeLeft: prevState.timeLeft - 1,
        }
      }
      clearInterval(this.intervalId)
      return prevState
    })
  }

  render() {
    const { timeout, onRejected } = this.props
    const { timeLeft } = this.state
    const percentageLeft = (timeLeft * 100) / (timeout / 1000)

    return (
      <TimerWrapper>
        <TimeLeft>
          {timeLeft} sec{timeLeft > 1 ? 's' : ''}
        </TimeLeft>
        <ProgressBarWrapper>
          <ProgressBar style={{ width: `${percentageLeft}%` }} />
        </ProgressBarWrapper>
        <RejectQuoteButton onClick={onRejected}>Reject</RejectQuoteButton>
      </TimerWrapper>
    )
  }
}

export default RfqTimer
