import _ from 'lodash'
import { DateTime, Duration } from 'luxon'
import React from 'react'

import { Button as StyleguideButton, ButtonGroup } from 'rt-styleguide'
import { styled } from 'rt-theme'

import { Block, Text } from '../StyleguideRoute/styled'
import { LabelText } from './TextField'

import { Timer } from './Timer'

export interface Props {
  ready?: boolean
  requestQuote?: boolean
  query?: any
  onSubmit?: (event: any) => any
  onCancel?: (event: any) => any
  onBuy?: (event: any) => any
  onSell?: (event: any) => any
  onClick?: (event: any) => any
}

interface State extends Props {
  countdown?: any
  quote?: {
    bid: number
    ask: number
    expiry?: any
  }
  query?: any
}

export { Props as OrderStatusProps }
export class OrderStatus extends React.Component<Props, State> {
  state: State = {
    countdown: null,
    quote: null,
  }

  static getDerivedStateFromProps(props: Props, state: State) {
    let next: State = null

    if (!props.requestQuote && state.quote != null) {
      next = {
        countdown: null,
        quote: null,
      }
    }

    return next
  }

  onClick = (event: any) => {
    const { onClick, [`on${_.capitalize(event.target.name)}`]: onEventHandler = onClick } = this.props

    if (onEventHandler) {
      onEventHandler(event)
    }
  }

  setQuote = () => {
    let bid = _.random(10.17, 500.39)
    let ask = bid - _.random(0.33, bid * 0.1)
    let countdown = Duration.fromObject({ seconds: 10 })

    this.setState({
      quote: { bid, ask, exipry: DateTime.local().plus(countdown) },
      countdown,
    })
  }

  updateCountdown = () => {
    const { countdown } = this.state
    if (countdown.seconds > 1) {
      this.setState({ countdown: this.state.countdown.minus({ seconds: 1 }) })
    } else {
      this.setState({
        query: null,
        countdown: null,
        quote: null,
      })
    }
  }

  render() {
    const { ready, requestQuote } = this.props
    const { quote, countdown } = this.state

    return (
      <React.Fragment>
        {requestQuote && <Timer duration={0} timeout={this.setQuote} />}
        {quote && <Timer key={quote.expiry} duration={1000} interval={this.updateCountdown} />}
        <StatusLayout fg="muteColor">
          <StatusBox>
            <LabelText>Status</LabelText>
            {quote ? (
              <StatusText fg="accents.aware.base">Reviewing Price</StatusText>
            ) : (
              <StatusText>{ready ? 'Draft' : '— —'}</StatusText>
            )}
          </StatusBox>
          <StatusBox>
            <LabelText>Remaining</LabelText>
            {quote ? (
              <StatusText fg="accents.aware.base">{countdown.toFormat('hh:mm:ss')}</StatusText>
            ) : (
              <StatusText>— —</StatusText>
            )}
          </StatusBox>
          <Progress>
            {quote ? (
              <StatusText fg="accents.aware.base" fontSize={2}>
                {countdown.toFormat('ss')}
              </StatusText>
            ) : (
              <React.Fragment>
                <Block>&nbsp;</Block>
                <StatusText>— —</StatusText>
              </React.Fragment>
            )}
          </Progress>
        </StatusLayout>
        {quote ? (
          <ButtonLayout key="execute">
            <Button name="buy" intent="primary" onClick={this.onClick}>
              <LabelText>Buy</LabelText>
              <StatusText fontSize={1.15}>{quote.bid.toFixed(2)}</StatusText>
            </Button>

            <Button name="self" intent="bad" onClick={this.onClick}>
              <LabelText>Sell</LabelText>
              <StatusText fontSize={1.15}>{quote.ask.toFixed(2)}</StatusText>
            </Button>

            <Button name="cancel" intent="mute" onClick={this.onClick}>
              Cancel
            </Button>
          </ButtonLayout>
        ) : (
          <ButtonLayout key="submit">
            <Button name="submit" intent={ready ? 'good' : 'mute'} disabled={!ready} onClick={this.onClick}>
              Submit
            </Button>
            <Button name="cancel" intent="mute" disabled={!ready} onClick={this.onClick}>
              Cancel
            </Button>
          </ButtonLayout>
        )}
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

const StatusBox = styled(Block)`
  min-width: 4rem;
  height: 4rem;
  display: grid;
  grid-template-columns: auto;
  grid-template-rows: 1.5rem 2.5rem;
  align-items: center;
  line-height: 1.5rem;
  line-height-step: 1rem;

  ${LabelText} {
    align-self: flex-end;
  }
  /* justify-content: center; */
`

const Progress = styled(Block)`
  position: relative;
  width: 4rem;
  height: 4rem;
  display: grid;
  align-content: center;
  justify-content: center;
  box-shadow: 0 0 0 0.25rem ${props => props.theme.primary.base};
  margin-right: 0.25rem;
  border-radius: 100%;
`

const ButtonLayout = styled.div`
  display: grid;
  grid-gap: 0.5rem;
  padding: 0 1rem;
  height: 50%;
  grid-template-columns: repeat(${(props: any) => props.children.length}, 1fr);
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
