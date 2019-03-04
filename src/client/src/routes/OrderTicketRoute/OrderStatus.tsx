import _ from 'lodash'
import { DateTime, Duration } from 'luxon'
import React from 'react'

import { Button as StyleguideButton } from 'rt-styleguide'
import { styled } from 'rt-theme'

import { Block } from '../StyleguideRoute/styled'
import { LabelText } from './TextField'

import { Timer } from 'rt-components'

interface OrderStatusButtonClickHandler {
  onSubmit?: () => void
  onCancel?: () => void
  onBuy?: () => void
  onSell?: () => void
}
type OrderStatusButtonClickHandlerType = keyof OrderStatusButtonClickHandler

interface Props extends OrderStatusButtonClickHandler {
  ready?: boolean
  requestQuote?: boolean
  query?: any
  onClick?: () => void
  onExpire?: () => void
}

interface State extends Props {
  countdown?: Duration
  quote?: {
    bid: number
    ask: number
    expiry?: DateTime
  }
  query?: any
}

export type OrderStatusProps = Props
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

  clickHandler = (handlerName: OrderStatusButtonClickHandlerType) => () => {
    const onEventHandler = this.props[handlerName] || this.props.onClick

    if (onEventHandler) {
      onEventHandler()
    }
  }

  setQuote = () => {
    const bid = _.random(10.5, 500.5)
    const ask = bid - _.random(0.1, bid * 0.1)
    const countdown = Duration.fromObject({ seconds: 10 })

    this.setState({
      quote: { bid, ask, expiry: DateTime.local().plus(countdown) },
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

      if (this.props.onExpire) {
        this.props.onExpire()
      }
    }
  }

  render() {
    const { ready, requestQuote } = this.props
    const { quote, countdown } = this.state

    return (
      <React.Fragment>
        {requestQuote && <Timer duration={0} timeout={this.setQuote} />}
        {quote && (
          <Timer key={quote.expiry && quote.expiry.toString()} duration={1000} interval={this.updateCountdown} />
        )}
        <StatusLayout fg={t => t.muteColor}>
          <StatusBox>
            <LabelText>Status</LabelText>
            {quote ? (
              <StatusText fg={t => t.accents.aware.base}>Reviewing Price</StatusText>
            ) : (
              <StatusText>{ready ? 'Draft' : '— —'}</StatusText>
            )}
          </StatusBox>
          <StatusBox>
            <LabelText>Remaining</LabelText>
            {quote ? (
              <StatusText fg={t => t.accents.aware.base}>{countdown.toFormat('hh:mm:ss')}</StatusText>
            ) : (
              <StatusText>— —</StatusText>
            )}
          </StatusBox>
          <Progress>
            {quote ? (
              <StatusText fg={t => t.accents.aware.base} fontSize={2}>
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
            <Button intent="primary" onClick={this.clickHandler('onBuy')}>
              <LabelText>Buy</LabelText>
              <StatusText fontSize={1.125}>{quote.bid.toFixed(2)}</StatusText>
            </Button>

            <Button intent="bad" onClick={this.clickHandler('onSell')}>
              <LabelText>Sell</LabelText>
              <StatusText fontSize={1.125}>{quote.ask.toFixed(2)}</StatusText>
            </Button>

            <Button intent="mute" onClick={this.clickHandler('onCancel')}>
              Cancel
            </Button>
          </ButtonLayout>
        ) : (
          <ButtonLayout key="submit">
            <Button intent={ready ? 'good' : 'mute'} disabled={!ready} onClick={this.clickHandler('onSubmit')}>
              Submit
            </Button>
            <Button intent="mute" disabled={!ready} onClick={this.clickHandler('onCancel')}>
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
