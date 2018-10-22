import _ from 'lodash'
import { DateTime } from 'luxon'
import React from 'react'

import { styled } from 'rt-theme'

import { TextField } from './TextField'
import { Timer } from './Timer'

export interface Fields {
  product: string
  client: string
  direction: string
  notional: string
  settlement: string
}

export interface Props extends Partial<Fields> {}

interface State extends Props {
  fields: Fields
  props: Props | null
}

export { Props as OrderFormProps }
export class OrderForm extends React.Component<Props, State> {
  state: State = {
    fields: {
      product: '',
      client: '',
      direction: '',
      notional: '',
      settlement: '',
    },
    props: null,
  }

  static getDerivedStateFromProps(props: Props, state: State) {
    let fields: any = state.fields

    if (!_.isMatch(props, state.props)) {
      fields = {
        ...state.fields,
        ..._.pick(props, Object.keys(state.fields)),
      }

      if (!fields.product) {
        fields.direction = fields.settlement = ''
      }
    }

    return { fields, props }
  }

  onChange = (event: React.FormEvent<HTMLInputElement>) => {
    const {
      target: { name, value },
    } = event as any

    this.setState(({ fields }) => ({ fields: { ...fields, [name]: value } }))
  }

  setRemainingFields = () => {
    let { fields } = this.state

    fields = {
      ...fields,
      direction: fields.product ? 'Two Way' : '',
      settlement: fields.product
        ? DateTime.local()
            .plus({ days: 1 } as any)
            .toISODate()
        : '',
    }

    this.setState({ fields })
  }

  render() {
    const { fields, props: prevProps } = this.state

    return (
      <Layout>
        <Timer key={fields.product + fields.notional} duration={500} timeout={this.setRemainingFields} />
        {_.map(fields as any, (value: any, name) => (
          <TextField key={name} name={name} value={value} onChange={this.onChange} />
        ))}
      </Layout>
    )
  }
}

const Layout = styled.div`
  display: grid;
  grid-gap: 0.5rem;
  grid-row-gap: 0.5rem;
  padding: 1rem 0.5rem;
  height: 100%;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 2.5rem 1fr 2.5rem 1fr 2.5rem 1fr;
  grid-template-areas:
    'product product'
    '. .'
    'client direction'
    '. .'
    'notional settlement'
    '. .';
`
