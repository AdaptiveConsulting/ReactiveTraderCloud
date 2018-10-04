import _ from 'lodash'
import React from 'react'
import { styled } from 'rt-theme'

import { TextField } from './TextField'

export interface OrderFormProps {}

export class OrderForm extends React.Component<OrderFormProps, any> {
  state = {
    product: 'ICIPLC  6.75%  2030',
    client: 'Joe Bloggs',
    direction: 'Two-way',
    notional: '25,000,000',
    settlement: '08-Mar-2017',
  }

  onChange = (event: React.FormEvent<HTMLInputElement>) => {
    const {
      target: { name, value },
    } = event as any

    this.setState({ [name]: value })
  }

  render() {
    return (
      <Layout>
        {_.map(this.state, (value, name) => (
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
