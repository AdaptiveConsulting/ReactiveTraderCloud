import numeral from 'numeral'
import React, { PureComponent } from 'react'
import { styled } from 'rt-theme'
import { convertNotionalShorthandToNumericValue } from './utils'

const NUMERAL_FORMAT = '0,000,000[.]00'
const ENTER = 'Enter'
const CHAR_CODE_DOT = 46
const CHAR_CODE_0 = 48
const CHAR_CODE_9 = 57
const CHAR_CODE_UNIT_SEP = 31
const SHORTCUT_CHAR_CODES = [75, 77, 107, 109]
const MAX_NOTIONAL_VALUE = 1000000000
export const DEFAULT_NOTIONAL_VALUE = '1000000'

const CurrencyPairSymbol = styled('span')`
  opacity: 0.59;
  font-size: 0.625rem;
  line-height: 1.2rem;
  padding-right: 0.375rem;
`

const InputWrapper = styled.div`
  display: flex;
`

export const Input = styled.input<{ inputIsValid: boolean }>`
  background: none;
  text-align: center;
  outline: none;
  border: none;
  font-size: 0.75rem;
  width: 85px;
  transition: box-shadow 0.2s ease;
  padding: 2px 0;
  ${({ inputIsValid, theme }) =>
    inputIsValid
      ? `
  .spot-tile:hover & {
    box-shadow: 0px 1px 0px ${theme.core.textColor};
  }

  .spot-tile:hover &:focus,
  &:focus {
    box-shadow: 0px 1px 0px ${theme.template.blue.normal};
  }
  `
      : `
  box-shadow: 0px 1px 0px ${theme.template.red.normal}
  `};
`

interface Props {
  currencyPairSymbol: string
  notional: string
  updateNotional: (notional: string) => void
}

export default class NotionalInput extends PureComponent<Props> {
  private inputRef = React.createRef<HTMLInputElement>()

  state = {
    inputIsValid: true,
  }

  render() {
    const { currencyPairSymbol, notional } = this.props
    const { inputIsValid } = this.state
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
          onBlur={this.handleUpdateCausedByEvent}
          onKeyPress={this.handleKeyPressNotionalInput}
          inputIsValid={inputIsValid}
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
      this.handleUpdateCausedByEvent(event)
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

  handleInputChange = (event: React.FormEvent<HTMLInputElement>) => {
    // If user deletes all chars, set value back to DEFAULT_NOTIONAL_VALUE instead of empty string
    let value = event.currentTarget.value.trim() || DEFAULT_NOTIONAL_VALUE
    const numericValue = convertNotionalShorthandToNumericValue(value)
    if (numericValue >= MAX_NOTIONAL_VALUE) {
      value = DEFAULT_NOTIONAL_VALUE
      this.triggerInputWarningMessage()
    }

    if (!isNaN(numericValue)) {
      // user may be trying to enter decimals. In that case, format and update only when completed.
      const lastTwoChars = value.substr(-2)
      if (lastTwoChars.indexOf('.') === -1) {
        // propagate change back to dom node's value
        this.formatAndUpdateValue(value)
      }
    }
  }

  handleUpdateCausedByEvent = (event: React.FormEvent<HTMLInputElement>) => {
    const { value } = event.currentTarget
    this.formatAndUpdateValue(value !== '.' ? value : DEFAULT_NOTIONAL_VALUE)
  }

  formatAndUpdateValue = (inputValue: string) => {
    const { updateNotional } = this.props
    const stringNotional = numeral(inputValue).format(NUMERAL_FORMAT)
    updateNotional(stringNotional)
    if (this.inputRef.current) {
      this.inputRef.current.value = stringNotional
    }
  }

  // Temporary, need to validate UI and bahaviour
  triggerInputWarningMessage = () => {
    this.setState({
      inputIsValid: false,
    })
    setTimeout(() => {
      this.setState({
        inputIsValid: true,
      })
    }, 2000)
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
