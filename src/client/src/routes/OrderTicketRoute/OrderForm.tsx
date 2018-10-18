import _ from 'lodash'
import React from 'react'
import { styled } from 'rt-theme'

import { TextField } from './TextField'

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
  prev: Props | null
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
    prev: null,
  }

  static getDerivedStateFromProps(props: Props, state: State) {
    let next: any

    if (!_.isMatch(props, state.prev)) {
      next = {
        fields: {
          ...state.fields,
          ..._.pick(props, Object.keys(state.fields)),
        },
      }
    }

    return { ...next, prev: props }
  }

  onChange = (event: React.FormEvent<HTMLInputElement>) => {
    const {
      target: { name, value },
    } = event as any

    this.setState(({ fields }) => ({ fields: { ...fields, [name]: value } }))
  }

  render() {
    const { fields } = this.state

    return (
      <Layout>
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
