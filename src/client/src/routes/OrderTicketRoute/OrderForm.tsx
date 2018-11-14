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

export interface Props {
  fields: Partial<Fields>
  onChange?: (event: React.FormEvent<HTMLInputElement>) => void
}

interface State {
  fields: Fields
  props: Props | null
}

export { Fields as OrderFormFields }
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

  static getDerivedStateFromProps({ fields: props }: Props, state: State) {
    let fields = state.fields

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
      currentTarget: { name, value },
    } = event

    this.setState(({ fields }) => ({ fields: { ...fields, [name]: value } }))

    if (this.props.onChange) {
      this.props.onChange(event)
    }
  }

  setRemainingFields = () => {
    let { fields } = this.state

    fields = {
      ...fields,
      direction: fields.product ? 'Two Way' : '',
      settlement: fields.product
        ? DateTime.local()
            .plus({ days: 1 })
            .toISODate()
        : '',
    }

    this.setState({ fields })
  }

  render() {
    const { fields } = this.state
    console.log(fields)

    return (
      <Layout>
        <Timer key={fields.product + fields.notional} duration={500} timeout={this.setRemainingFields} />
        {Object.keys(fields).map(name => (
          <TextField key={name} name={name} value={fields[name]} onChange={this.onChange} />
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
