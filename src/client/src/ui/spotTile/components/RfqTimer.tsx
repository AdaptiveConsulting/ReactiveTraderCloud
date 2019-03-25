import React, { PureComponent } from 'react'
import { RfqState } from './types'
import styled from 'styled-components'

interface RfqTimerProps {
  rfqState: RfqState
  timeout: number
}

interface RfqTimerState {
  timeLeft: number
}

const TimeLeft = styled.div`
  /* background-color: yellow; */
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
`

class RfqTimer extends PureComponent<RfqTimerProps, RfqTimerState> {
  intervalId = 0

  static defaultProps = {
    timeout: 60, // This value must come from service
  }

  state = {
    timeLeft: this.props.timeout,
  }

  componentDidMount() {
    this.intervalId = setInterval(this.updateTimeLeft, 1000)
  }

  componentWillUnmount() {
    clearInterval(this.intervalId)
  }

  handleRejectQuote = () => {
    console.log('Reject Quote!')
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
    const { rfqState } = this.props
    const { timeLeft } = this.state

    if (timeLeft === 0) {
      console.log('timeLeft', timeLeft)
    }

    if (rfqState === 'received' && timeLeft > 0) {
      const percentageLeft = (timeLeft * 100) / 60
      return (
        <TimerWrapper>
          <TimeLeft>{timeLeft} secs</TimeLeft>
          <ProgressBarWrapper>
            <ProgressBar style={{ width: `${percentageLeft}%` }} />
          </ProgressBarWrapper>
          <RejectQuoteButton onClick={this.handleRejectQuote}>Reject</RejectQuoteButton>
        </TimerWrapper>
      )
    }

    return null
  }
}

export default RfqTimer
