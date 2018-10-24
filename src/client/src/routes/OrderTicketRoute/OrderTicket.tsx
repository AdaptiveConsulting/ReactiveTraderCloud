import _ from 'lodash'
import { darken } from 'polished'
import React, { PureComponent } from 'react'
import ReactDOM from 'react-dom'
import { HotKeys } from 'react-hotkeys'
import { rules } from 'rt-styleguide'
import { styled } from 'rt-theme'
import { Block, Text } from '../StyleguideRoute/styled'

import AudioContext from './AudioContext'
import { DrawerMenu } from './DrawerMenu'
import { VoiceInput, VoiceInputResult } from './VoiceInput'
import { WindowControls } from './WindowControls'

import { OrderForm, OrderFormProps } from './OrderForm'
import { OrderStatus, OrderStatusProps } from './OrderStatus'
import { Timer } from './Timer'

interface State {
  requestQuote: boolean
  requestSession: boolean
  result?: VoiceInputResult
  data: Partial<OrderFormProps>
  source: 'microphone' | 'sample'
}
export class OrderTicket extends PureComponent<{}, State> {
  state: State = {
    requestQuote: false,
    requestSession: false,
    result: null,
    // source: 'sample',
    source: 'microphone',
    data: {},
  }

  hotkeys = {
    keyMap: {
      toggle: ['alt+o', 'alt+shift+o', 'alt+0', 'alt+shift+0'],
    },
    handlers: {
      toggle: () => this.setState(({ requestSession }) => ({ requestSession: !requestSession })),
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
      result: null,
      data: {
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
      data: {
        product,
        client,
        notional,
      },
    })
  }

  onVoiceEnd = () => {
    this.setState({
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
      data: _.mapValues(this.state.data, _.constant('')),
    })
  }

  render() {
    const { requestQuote, requestSession, data = {} } = this.state

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
            <DrawerMenu />
          </DrawerLayout>
          <VoiceLayout>
            <VoiceInput
              source={this.state.source}
              requestSession={requestSession}
              onStart={this.onVoiceStart}
              onResult={this.onVoiceResult}
              onEnd={this.onVoiceEnd}
            />
          </VoiceLayout>
          <FormLayout>
            <OrderForm {...data} />
          </FormLayout>
          <StatusLayout>
            <OrderStatus
              ready={!!data.product && !!data.notional}
              onSubmit={this.onSubmit}
              onCancel={this.onCancel}
              requestQuote={requestQuote}
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
