import numeral from 'numeral'
import React, { PureComponent } from 'react'
import { styled } from 'rt-theme'
import { convertNotionalShorthandToNumericValue, hasShorthandInput } from './utils'

let foo: number = 123;
foo = null;
console.log(foo)

const NUMERAL_FORMAT = '0,000,000[.]00'
const DOT = '.'
const ENTER = 'Enter'
const CHAR_CODE_DOT = 46
const CHAR_CODE_0 = 48
const CHAR_CODE_9 = 57
const CHAR_CODE_UNIT_SEP = 31
const SHORTCUT_CHAR_CODES = [75, 77, 107, 109]
const MAX_NOTIONAL_VALUE = 1000000000

const CurrencyPairSymbol = styled.div`
  opacity: 0.59;
  font-size: 0.625rem;
  line-height: 1rem;
  padding-right: 0.375rem;
`

const InputWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`

export const Input = styled.input`
  background: none;
  outline: none;
  border: none;
  font-size: 0.75rem;
  width: 70px;
  transition: box-shadow 0.2s ease;
  padding: 2px 0;

  .spot-tile:hover & {
    box-shadow: 0px 1px 0px ${({ theme }) => theme.core.textColor};
  }

  .spot-tile:hover &:focus,
  &:focus {
    box-shadow: 0px 1px 0px ${({ theme }) => theme.template.blue.normal};
  }
`

interface Props {
  currencyPairSymbol: string
  notional: string
  updateNotional: (notional: string) => void
}

export default class NotionalInput extends PureComponent<Props> {
  private inputRef = React.createRef<HTMLInputElement>()

  render() {
    const { currencyPairSymbol, notional } = this.props
    const formattedSize = numeral(notional).format(NUMERAL_FORMAT)
    return (
      <InputWrapper>
        <CurrencyPairSymbol>{currencyPairSymbol}</CurrencyPairSymbol>
        <Input
          type="text"
          ref={this.inputRef}
          defaultValue={formattedSize}
          onFocus={this.handleFocus}
          onChange={this.handleInputChange}
          onBlur={event => this.processNotional(event.currentTarget.value)}
          onKeyPress={this.handleKeyPressNotionalInput}
        />
      </InputWrapper>
    )
  }

  handleFocus = (event: React.FocusEvent<HTMLInputElement>) => {
    event.target.select()
  }

  handleKeyPressNotionalInput = (event: React.KeyboardEvent<HTMLInputElement>) => {
    const charCode = event.charCode

    if (event.key === ENTER) {
      this.processNotional(event.currentTarget.value)
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

  processNotional = (inputValue: string) => {
    const { updateNotional } = this.props
    const inputValueTrimmed = inputValue.trim()
    let notional = convertNotionalShorthandToNumericValue(inputValueTrimmed)
    if (notional >= MAX_NOTIONAL_VALUE) {
      notional = 0
    }
    if (!isNaN(notional)) {
      updateNotional(notional.toString())
      // user may be trying to enter decimals. restore BACK into input
      let stringNotional = notional.toString()
      if (inputValueTrimmed.indexOf(DOT) === inputValueTrimmed.length - 1) {
        stringNotional += DOT
      }
      // propagate change back to dom node's value
      stringNotional = numeral(stringNotional).format(NUMERAL_FORMAT)
      updateNotional(stringNotional)
      if (this.inputRef.current) {
        this.inputRef.current.value = stringNotional
      }
    }
  }

  handleInputChange = (event: React.FormEvent<HTMLInputElement>) => {
    const rawValue = ((this.inputRef.current && this.inputRef.current.value) || event.currentTarget.value).trim()
    // check for a shortcut input
    if (hasShorthandInput(rawValue)) {
      this.processNotional(rawValue)
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
