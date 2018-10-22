import _ from 'lodash'
import { Duration } from 'luxon'
import React from 'react'

import { Button as StyleguideButton } from 'rt-styleguide'
import { styled } from 'rt-theme'

import { Block, Text } from '../StyleguideRoute/styled'
import { LabelText } from './TextField'

import { Timer } from './Timer'

export interface Props {
  ready?: boolean
  requestQuote?: boolean
  onSubmit?: (event: any) => any
  onCancel?: (event: any) => any
  onBuy?: (event: any) => any
  onSell?: (event: any) => any
  onClick?: (event: any) => any
}

interface State extends Props {
  quote?: number
  countdown?: any
}

export { Props as OrderStatusProps }
export class OrderStatus extends React.Component<Props, State> {
  state: State = {
    countdown: Duration.fromObject({ seconds: 0 }),
  }

  onClick = (event: any) => {
    const { onClick, [`on${_.capitalize(event.target.name)}`]: onEventHandler = onClick } = this.props

    if (onEventHandler) {
      onEventHandler(event)
    }
  }

  setQuote = () => {
    this.setState({ quote: _.random(10, 500), countdown: Duration.fromObject({ seconds: 30 }) })
  }

  updateCountdown = () => {
    const { countdown } = this.state
    if (countdown.seconds) {
      this.setState({ countdown: this.state.countdown.minus({ seconds: 1 }) })
    } else {
      this.setState({
        quote: null,
      })
    }
  }

  render() {
    const { ready, requestQuote } = this.props
    const { quote, countdown } = this.state

    return (
      <React.Fragment>
        {requestQuote && <Timer duration={500} timeout={this.setQuote} />}
        {quote && <Timer key={quote} duration={1000} interval={this.updateCountdown} />}
        <StatusLayout fg="muteColor">
          <div>
            <LabelText>Status</LabelText>
            {quote ? (
              <StatusText fg="accents.aware.base">Reviewing price</StatusText>
            ) : (
              <StatusText>{ready ? 'Draft' : '— —'}</StatusText>
            )}
          </div>
          <div>
            <LabelText>Remaining</LabelText>
            {quote ? (
              <StatusText fg="accents.aware.base">{countdown.toFormat('hh:mm:ss')}</StatusText>
            ) : (
              <StatusText>— —</StatusText>
            )}
          </div>
          <Progress>
            <Block>&nbsp;</Block>
            {quote ? (
              <StatusText fg="accents.aware.base">{countdown.toFormat('ss')}</StatusText>
            ) : (
              <StatusText>— —</StatusText>
            )}
          </Progress>
        </StatusLayout>
        <ButtonLayout>
          <Button name="submit" intent={ready ? 'good' : 'mute'} disabled={!ready} onClick={this.onClick}>
            Submit
          </Button>
          <Button name="cancel" intent="mute" disabled={!ready} onClick={this.onClick}>
            Cancel
          </Button>
        </ButtonLayout>
      </React.Fragment>
    )
  }
}

const StatusLayout = styled(Block)`
  display: grid;
  grid-gap: 0.5rem;
  padding: 0 1rem;
  height: 50%;
  grid-template-columns: 1fr 1fr auto;
  grid-template-rows: auto;
  /* align-items: center; */
  /* justify-content: center; */
  align-content: center;
  box-shadow: 0 -1px 0 0 ${/* align-items: center; */
    /* justify-content: center; */
    props => props.theme.ruleColor} inset;
`

const StatusText = styled(Block)`
  line-height: 1.5rem;
`

const Progress = styled(Block)`
  position: relative;
  width: 2rem;
  margin: 0 1rem;
  display: grid;
  align-content: center;
  &::before {
    content: '';
    position: absolute;
    top: -0.75rem;
    left: -1.25rem;
    height: 4rem;
    width: 4rem;
    box-shadow: 0 0 0 0.25rem ${props => props.theme.primary.base};
    border-radius: 100%;
  }
`

const ButtonLayout = styled.div`
  display: grid;
  grid-gap: 0.5rem;
  padding: 0 1rem;
  height: 50%;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: auto;
  align-items: center;
  justify-content: center;
  align-content: center;
  justify-items: center;
`

const Button = styled(StyleguideButton)`
  min-height: 4rem;
  max-height: 4rem;
  min-width: 100%;
  max-width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 0.25rem;
`
