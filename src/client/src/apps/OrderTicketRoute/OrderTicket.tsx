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

import { Chrome } from './Chrome'
import { OrderForm, OrderFormFields } from './OrderForm'
import { OrderStatus } from './OrderStatus'

import { Notification } from './Notification'
import { Timer } from 'rt-components'

interface State {
  executed?: boolean
  requestExecution?: boolean
  requestQuote: boolean
  requestSession: boolean
  sessionActive: boolean
  sessionResult?: VoiceInputResult
  query: Partial<OrderFormFields>
  source: 'microphone' | 'sample'
  features: any
}

interface Props {
  showChrome: boolean
  reset: () => void
}

export class OrderTicket extends PureComponent<Props, State> {
  static defaultProps = {
    showChrome: true,
  }
  state: State = {
    requestSession: false,
    requestQuote: false,
    sessionActive: false,
    sessionResult: null,
    source: 'microphone',
    query: {},
    features: {},
    ...(process.env.NODE_ENV === 'development' &&
      {
        // requestSession: true,
        // requestQuote: true,
        // source: 'sample',
      }),
  }

  viewportRef = React.createRef<any>()

  hotkeys = {
    keyMap: {
      escape: ['esc'],
      submit: ['enter'],
      buy: ['alt+b'],
      sell: ['alt+s'],
      toggle: ['alt+o', 'alt+shift+o', 'alt+0', 'alt+shift+0'],
      toggleSource: ['alt+i', 'alt+shift+i'],
      toggleNext: ['alt+n'],
    },
    handlers: {
      submit: () => this.onSubmit(),
      buy: () => this.onBuy(),
      sell: () => this.onSell(),

      escape: () => this.onCancel(),

      toggle: () =>
        this.setState(({ requestSession }) => ({
          requestSession: !requestSession,
        })),

      toggleSource: () =>
        this.setState(({ source }) => ({
          source: source === 'sample' ? 'microphone' : 'sample',
        })),

      toggleNext: () =>
        this.setState(({ features }) => ({
          features: { ...features, useNext: !features.useNext },
        })),
    },
  }

  componentDidMount = () => {
    const { current } = this.viewportRef

    const node = ReactDOM.findDOMNode(current) as HTMLElement

    if (node) {
      node.focus()
    }
  }

  onSessionStart = () => {
    this.setState({
      requestSession: true,
      requestQuote: false,
      sessionActive: true,
      sessionResult: null,
      query: {
        product: '',
        client: '',
        notional: '',
      },
    })
  }

  onSessionResult = (sessionResult: VoiceInputResult) => {
    if (!this.state.sessionActive) {
      console.error('OrderTicket.onSessionResult called while not sessionActive === false')
      return
    }

    const {
      data: { result: { intents = [] } = {} },
    } = sessionResult

    const { entities = [] } = _.find(intents, { label: 'corporate_bonds' }) || {}

    // Select highest probable match by field within result.intents
    const [product, client, notional] = ['product', 'client', 'quantity']
      .map(label => _.find(entities, { label }))
      .map(value => _.get(value, ['matches', 0]))
      .map(matches => _.sortBy(matches, v => 1 - v.probability)[0])
      .map(match => _.get(match, ['value']))

    this.setState({
      sessionResult,
      query: {
        product,
        client,
        notional,
      },
    })
  }

  onSessionEnd = () => {
    // const { query, sessionResult } = this.state

    this.setState({
      requestSession: false,
      sessionActive: false,
      // requestQuote: _.get(sessionResult, 'data.result.final') && Object.keys(query).length >= 3,
    })
  }

  onOrderFormChange = ({ currentTarget: { name, value } }: React.FormEvent<HTMLInputElement>) => {
    this.setState(({ query }) => ({ query: { ...query, [name]: value } }))
  }

  onSubmit = () => {
    if (_.filter(this.state.query).length >= 3) {
      this.setState({
        requestQuote: true,
      })
    }
  }

  onCancel = () => {
    this.setState({
      requestSession: false,
      requestQuote: false,
      sessionActive: false,
      sessionResult: null,
      requestExecution: false,
      executed: null,
      query: _.mapValues(this.state.query, () => ''),
    })
  }

  onExpire = () => {
    this.setState({
      requestQuote: false,
    })
  }

  onBuy = () => {
    this.execute()
  }

  onSell = () => {
    this.execute()
  }

  execute = () => {
    if (this.state.requestQuote) {
      this.setState({
        requestExecution: true,
        executed: null,
      })
    }
  }

  tryGetSessionResultTranscript() {
    try {
      return this.state.sessionResult.transcripts[0][0].transcript
    } catch {}
    return undefined
  }

  render() {
    const { executed, requestExecution, requestQuote, requestSession, query = {} } = this.state

    return (
      <Viewport bg={t => t.core.darkBackground} fg={t => t.core.textColor}>
        <StyledHotKeys {...this.hotkeys} ref={this.viewportRef}>
          <AppLayout bg={t => t.core.darkBackground}>
            {this.props.showChrome && <Chrome />}

            <DrawerLayout bg={t => t.primary[4]} fg={t => t.primary[2]}>
              <DrawerMenu onClick={this.props.reset} />
            </DrawerLayout>

            <VoiceLayout>
              <VoiceInput
                value={this.tryGetSessionResultTranscript()}
                source={this.state.source}
                onStart={this.onSessionStart}
                onResult={this.onSessionResult}
                onEnd={this.onSessionEnd}
                requestSession={requestSession}
                // testing
                features={this.state.features}
              />
            </VoiceLayout>

            <FormLayout>
              <OrderForm fields={query} onChange={this.onOrderFormChange} />
            </FormLayout>

            <StatusLayout>
              <OrderStatus
                ready={!!query.product && !!query.notional && !!query.client}
                query={query}
                requestQuote={requestQuote}
                onSubmit={this.onSubmit}
                onCancel={this.onCancel}
                onExpire={this.onExpire}
                onBuy={this.onBuy}
                onSell={this.onBuy}
              />
            </StatusLayout>

            <InfoLayout fg={t => t.secondary[3]}>
              Bond Info
              {
                <React.Fragment>
                  {requestExecution && (
                    <Timer
                      duration={100 + Math.random() * 200}
                      timeout={() =>
                        this.setState({
                          requestQuote: false,
                          executed: Math.random() < 0.8,
                        })
                      }
                    />
                  )}
                  {executed != null && (
                    <Notification
                      position="bottom"
                      duration={2500}
                      intent={executed ? 'good' : 'bad'}
                      onEnd={() =>
                        executed && !this.state.requestQuote
                          ? this.onCancel()
                          : this.setState({
                              requestExecution: false,
                              executed: null,
                            })
                      }
                    >
                      <Block fontSize={0.875}>
                        {executed ? (
                          <Text fontWeight="bold">Order Succeeded</Text>
                        ) : (
                          <Text fontWeight="bold">Order Failed</Text>
                        )}
                      </Block>
                    </Notification>
                  )}
                </React.Fragment>
              }
            </InfoLayout>
          </AppLayout>
        </StyledHotKeys>
      </Viewport>
    )
  }
}

const StyledHotKeys = styled(HotKeys)`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100%;
  height: 100%;
  width: 100%;
`

const Viewport = styled(Block)`
  display: flex;
  align-items: center;
  min-height: 100%;
  height: 100%;

  font-size: 0.75rem;
`

const AppLayout = styled(Block)<{ showChrome?: boolean }>`
  display: grid;
  min-width: 42rem;
  max-width: 42rem;
  min-height: 22rem;

  border-radius: 0.5rem;
  overflow: hidden;

  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.05),
    0 1rem 2.5rem -1.25rem ${({ theme }) => darken(0.1, theme.overlay.backgroundColor)};

  grid-template-columns: 4rem 8rem 8rem 11rem 11rem;
  grid-template-rows: ${({ showChrome }) => (showChrome ? 2 : 0)}rem 5rem 7rem 7rem 3rem;
  grid-template-areas:
    'chrome chrome chrome chrome chrome '
    'drawer voice  voice  voice  voice  '
    'drawer form   form   status status '
    'drawer form   form   status status '
    'drawer info   info   info   info   ';

  position: relative;
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
  box-shadow: 0 1px 0 ${props => props.theme.primary.base};

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
  box-shadow: -1px 0 0 ${props => props.theme.primary.base} inset;

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

  box-shadow: 0 1px 0 ${props => props.theme.primary.base} inset;

  ${rules.appRegionDrag};

  position: relative;
`

export default OrderTicket
