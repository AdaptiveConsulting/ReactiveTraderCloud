import _ from 'lodash'
import { darken } from 'polished'
import React, { PureComponent } from 'react'
import ReactDOM from 'react-dom'
import { HotKeys } from 'react-hotkeys'
import { rules } from 'rt-styleguide'
import { styled } from 'rt-theme'
import { Block, Text } from '../StyleguideRoute/styled'

import { DrawerMenu } from './DrawerMenu'
import { VoiceInput, VoiceInputResult } from './VoiceInput'
import { WindowControls } from './WindowControls'

import { OrderForm, OrderFormProps } from './OrderForm'
import { OrderStatus, OrderStatusProps } from './OrderStatus'

let TEST_QUOTE: boolean = true

interface State {
  requestQuote: boolean
  requestSession: boolean
  listening: boolean
  result?: VoiceInputResult
  query: Partial<OrderFormProps>
  source: 'microphone' | 'sample'
}
export class OrderTicket extends PureComponent<{ reset: () => any }, State> {
  state: State = {
    ...{
      requestSession: false,
      requestQuote: false,
      listening: false,
      result: null,
      source: 'microphone',
      query: {},
    },
    ...(process.env.NODE_ENV === 'development' && {
      requestSession: true,
      // requestQuote: true,
      source: 'sample',
    }),
  }

  hotkeys = {
    keyMap: {
      toggle: ['alt+o', 'alt+shift+o', 'alt+0', 'alt+shift+0'],
    },
    handlers: {
      toggle: () =>
        this.setState(({ requestSession, listening }) => {
          requestSession = !listening

          return { requestSession, source: requestSession ? 'microphone' : 'sample' }
        }),
    },
  }

  focus = (ref: any) => {
    if (ref) {
      const node = ReactDOM.findDOMNode(ref) as any
      if (node) {
        node.focus()
      }
    }
  }

  onVoiceStart = () => {
    this.setState({
      requestQuote: false,
      listening: true,
      result: null,
      query: {
        product: '',
        client: '',
        notional: '',
      },
    })
  }

  onVoiceResult = ({ result = {} }: any = {}) => {
    const { entities }: any = _.find(result.intents, { label: 'corporate_bonds' }) || {}

    // Select highest probable match by field within result.intents
    const [product, client, notional] = ['product', 'client', 'quantity']
      .map(label => _.find(entities, { label }))
      .map(value => _.get(value, ['matches', 0]))
      .map(matches => _.sortBy(matches, v => 1 - v.probability)[0])
      .map(match => _.get(match, ['value']))

    this.setState({
      result,
      query: {
        product,
        client,
        notional,
      },
    })
  }

  onVoiceEnd = () => {
    const { query, result } = this.state

    this.setState({
      requestQuote: result && result.final && Object.keys(query).length >= 3,
      requestSession: false,
      listening: false,
      // source: this.state.source === 'sample' ? 'microphone' : 'sample',
    })
  }

  onSubmit = () => {
    this.setState({
      requestQuote: true,
    })
  }

  onCancel = () => {
    this.setState({
      requestQuote: false,
      requestSession: false,
      result: null,
      query: _.mapValues(this.state.query, _.constant('')),
    })
  }

  render() {
    const { requestQuote, requestSession, query = {} } = this.state

    return (
      <Viewport bg="shell.backgroundColor" fg="shell.textColor" {...this.hotkeys} ref={this.focus}>
        <AppLayout bg="shell.backgroundColor">
          <ChromeLayout bg="primary.base">
            <WindowControls />
            <Text letterSpacing="1px" fontSize="0.625rem" fontWeight={300}>
              Order Ticket
            </Text>
          </ChromeLayout>
          <DrawerLayout bg="primary.4" fg="primary.2">
            <DrawerMenu onClick={this.props.reset} />
          </DrawerLayout>
          <VoiceLayout>
            <VoiceInput
              source={this.state.source}
              onStart={this.onVoiceStart}
              onResult={this.onVoiceResult}
              onEnd={this.onVoiceEnd}
              requestSession={requestSession}
            />
          </VoiceLayout>
          <FormLayout>
            <OrderForm {...query} />
          </FormLayout>
          <StatusLayout>
            <OrderStatus
              query={query}
              ready={!!query.product && !!query.notional}
              requestQuote={TEST_QUOTE ? (!!query.product && !!query.notional) || requestQuote : requestQuote}
              onSubmit={this.onSubmit}
              onCancel={this.onCancel}
            />
          </StatusLayout>
          <InfoLayout fg="muteColor">Bond Info</InfoLayout>
        </AppLayout>
      </Viewport>
    )
  }
}

const Viewport = styled(Block.withComponent(HotKeys))`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100%;
  height: 100%;

  font-size: 0.75rem;
`

const AppLayout = styled(Block)`
  display: grid;
  min-width: 42rem;
  max-width: 42rem;
  min-height: 22rem;

  border-radius: 0.5rem;
  overflow: hidden;

  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.05),
    0 1rem 2.5rem -1.25rem ${({ theme }) => darken(0.1, theme.overlay.backgroundColor)};

  grid-template-columns: 4rem 8rem 8rem 11rem 11rem;
  grid-template-rows: 2rem 5rem 7rem 7rem 3rem;
  grid-template-areas:
    'chrome chrome chrome chrome chrome '
    'drawer voice  voice  voice  voice  '
    'drawer form   form   status status '
    'drawer form   form   status status '
    'drawer info   info   info   info   ';
`

const ChromeLayout = styled(Block)`
  grid-area: chrome;
  display: grid;
  grid-template-rows: auto;
  grid-template-columns: min-content 1fr auto;
  align-items: center;
  grid-gap: 1rem;
  padding: 0 1rem;

  height: 2rem;

  ${rules.appRegionDrag};
`

const DrawerLayout = styled(Block)`
  grid-area: drawer;
  width: 4rem;

  line-height: 1.25rem;
  font-size: 1.25rem;
  padding: 0.5rem 0;
  display: grid;
  grid-template-columns: min-content;
  grid-template-rows: 3rem 3rem 3rem 1fr 3rem 3rem;
  align-items: center;
  justify-content: center;
  align-content: center;
  justify-items: center;

  ${rules.appRegionDrag};
`

const VoiceLayout = styled(Block)`
  grid-area: voice;
  height: 5rem;
  box-shadow: 0 1px 0 ${props => props.theme.ruleColor};

  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 1rem;

  max-width: 100%;

  ${rules.appRegionNoDrag};
`
const FormLayout = styled(Block)`
  grid-area: form;
  height: 14rem;
  box-shadow: -1px 0 0 ${props => props.theme.ruleColor} inset;

  display: flex;
  align-items: center;
  justify-content: center;

  ${rules.appRegionNoDrag};
`

const StatusLayout = styled(Block)`
  grid-area: status;
  height: 14rem;

  ${rules.appRegionNoDrag};
`

const InfoLayout = styled(Block)`
  grid-area: info;
  height: 3rem;

  display: flex;
  align-items: center;

  padding: 0 1rem;

  box-shadow: 0 1px 0 ${props => props.theme.ruleColor} inset;

  ${rules.appRegionDrag};
`

export default OrderTicket
