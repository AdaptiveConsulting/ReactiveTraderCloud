import numeral from 'numeral'
import React, { Component } from 'react'
import { Flex } from 'rt-components'
import { CurrencyPair } from 'rt-types'
import { styled } from 'rt-util'
import { convertNotionalShorthandToNumericValue, hasShorthandInput } from './notional/utils'

const NUMERAL_FORMAT = '0,000,000[.]00'
const DOT = '.'
const ENTER = 'Enter'
const CHAR_CODE_DOT = 46
const CHAR_CODE_0 = 48
const CHAR_CODE_9 = 57
const CHAR_CODE_UNIT_SEP = 31
const SHORTCUT_CHAR_CODES = [75, 77, 107, 109]
const MAX_NOTIONAL_VALUE = 1000000000

const CurrencyPair = styled('div')`
  color: ${({ theme: { text } }) => text.textMeta};
  font-size: 10px;
  padding-right: 6px;
`

//Todo hover border from parent
const Input = styled('input')`
  color: ${({ theme: { text } }) => text.textPrimary};
  border: none;
  border-bottom: 1px solid rgba(0, 0, 0, 0);
  outline: none;
  font-size: 12px;
  width: 70px;
  border-bottom: 1px solid ${({ theme: { text } }) => text.textMeta};

  &:focus {
    border-color: ${({ theme: { palette } }) => palette.accentPrimary.normal};
  }
`

interface Props {
  currencyPair: CurrencyPair
}

interface State {
  notional: string
}

export default class NotionalInput extends Component<Props, State> {
  state = {
    notional: '1000000'
  }

  render() {
    const { currencyPair } = this.props
    const { notional } = this.state
    console.log(notional)
    const formattedSize = numeral(notional).format(NUMERAL_FORMAT)
    return (
      <Flex alignItems="center" justifyContent="center">
        <CurrencyPair>{currencyPair.base}</CurrencyPair>
        <Input
          defaultValue={formattedSize}
          onChange={this.handleInputChange}
          onBlur={this.processNotional}
          onKeyPress={this.handleKeyPressNotionalInput}
        />
      </Flex>
    )
  }

  handleKeyPressNotionalInput = (event: React.KeyboardEvent<HTMLInputElement>) => {
    const charCode = event.charCode

    if (event.key === ENTER) {
      this.processNotional(event)
    } else if (charCode === CHAR_CODE_DOT) {
      // only allow one dot
      if (event.currentTarget.value.match(/\./g)) {
        event.nativeEvent.stopImmediatePropagation()
        event.preventDefault()
      }
    } else if (!this.inputIsAllowed(charCode)) {
      event.nativeEvent.stopImmediatePropagation()
      event.preventDefault()
    }
  }

  processNotional = (event: React.FormEvent<HTMLInputElement>) => {
    const inputValue = event.currentTarget.value
    const inputValueTrimmed = inputValue.trim()
    let notional: any = convertNotionalShorthandToNumericValue(inputValueTrimmed)
    if (notional >= MAX_NOTIONAL_VALUE) {
      notional = 0
    }
    if (!isNaN(notional)) {
      // user may be trying to enter decimals. restore BACK into input
      if (inputValueTrimmed.indexOf(DOT) === inputValueTrimmed.length - 1) {
        notional = notional + DOT
      }
      // propagate change back to dom node's value
      this.setState({
        notional: numeral(notional).format(NUMERAL_FORMAT)
      })
    }
  }

  handleInputChange = (event: React.FormEvent<HTMLInputElement>) => {
    const rawValue = event.currentTarget.value.trim()
    // check for a shortcut input
    if (hasShorthandInput(rawValue)) {
      this.processNotional(event)
    }
  }

  inputIsAllowed = (charCode: number) => {
    // allow charcter codes before the Unit Separator to catch Shift, Backspace, etc
    if (charCode <= CHAR_CODE_UNIT_SEP) {
      return true
    }

    // allow shortcut values
    if (SHORTCUT_CHAR_CODES.indexOf(charCode) !== -1) {
      return true
    }

    // allow numeric values:
    if (charCode >= CHAR_CODE_0 && charCode <= CHAR_CODE_9) {
      return true
    }
    return false
  }
}
