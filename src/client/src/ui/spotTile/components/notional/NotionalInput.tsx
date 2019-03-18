import numeral from 'numeral'
import React, { PureComponent } from 'react'
import { styled } from 'rt-theme'
import { convertNotionalShorthandToNumericValue } from './utils'

const NUMERAL_FORMAT = '0,000,000[.]00'
const DOT = '.'
const ENTER = 'Enter'
const CHAR_CODE_DOT = 46 // .
const CHAR_CODE_0 = 48 // 0
const CHAR_CODE_9 = 57 // 9
const CHAR_CODE_UNIT_SEP = 31 // US (unit separator)
const SHORTCUT_CHAR_CODES = [75, 77, 107, 109] // K, M, k, m
const MAX_NOTIONAL_VALUE = 1000000000
export const DEFAULT_NOTIONAL_VALUE = '1000000'
const RESET_NOTIONAL_VALUE = DEFAULT_NOTIONAL_VALUE

const CurrencyPairSymbol = styled('span')`
  grid-area: Currency;
  opacity: 0.59;
  font-size: 0.625rem;
  line-height: 1.2rem;
  padding-right: 0.375rem;
`

const MessagePlaceholder = styled.div`
  ${({ theme }) => `color: ${theme.template.red.normal}`};
  grid-area: Message;
  font-size: 0.6rem;
  line-height: normal;
  padding-top: 2px;
  margin-bottom: -1rem; /* Prevents the layout from changing in Tile when this MessagePlaceholder is rendered */
`

const InputWrapper = styled.div`
  display: grid;
  grid-template-columns: 1auto 1auto;
  grid-template-rows: 1auto 1auto;
  grid-template-areas: 'Currency Input' '. Message';
`

export const Input = styled.input<{ showMessage: boolean }>`
  grid-area: Input;
  background: none;
  text-align: center;
  outline: none;
  border: none;
  font-size: 0.75rem;
  width: 80px;
  padding: 2px 0;
  ${({ showMessage, theme }) =>
    !showMessage
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
  setDisabledTradingState: (disableTrading: boolean) => void
  disabled: boolean
}

interface State {
  showMessage: boolean
}

export default class NotionalInput extends PureComponent<Props, State> {
  private inputRef = React.createRef<HTMLInputElement>()

  state = {
    showMessage: false, // TODO Add support for other errors and warnings.
  }

  render() {
    const { currencyPairSymbol, notional } = this.props
    const { showMessage } = this.state
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
          showMessage={showMessage}
        />
        {showMessage && <MessagePlaceholder>Max exceeded</MessagePlaceholder>}
      </InputWrapper>
    )
  }

  handleFocus = (event: React.FocusEvent<HTMLInputElement>) => {
    event.target.select()
  }

  handleKeyPressNotionalInput = (event: React.KeyboardEvent<HTMLInputElement>) => {
    const { charCode, currentTarget, nativeEvent } = event
    if (event.key === ENTER) {
      this.handleUpdateCausedByEvent(event)
    } else if (charCode === CHAR_CODE_DOT) {
      // only allow one dot unless the existing dot is in the current
      // text selection while replacing existing text.
      const { value, selectionStart, selectionEnd } = currentTarget
      const textWithoutSelection = value.replace(value.substring(selectionStart, selectionEnd), '')
      if (textWithoutSelection.match(/\./g)) {
        nativeEvent.stopImmediatePropagation()
        event.preventDefault()
      }
    } else if (!this.inputIsAllowed(charCode)) {
      nativeEvent.stopImmediatePropagation()
      event.preventDefault()
    }
  }

  handleInputChange = (event: React.FormEvent<HTMLInputElement>) => {
    const value = event.currentTarget.value.trim()
    this.checkStatus(value)
    if (!isNaN(convertNotionalShorthandToNumericValue(value))) {
      // user may be trying to enter decimals or
      // user may be deleting previous entry (empty string)
      // in those cases, format and update only when completed.
      const lastTwoChars = value.substr(-2)
      if (value !== '' && lastTwoChars.indexOf(DOT) === -1) {
        // propagate change back
        this.formatAndUpdateValue(value)
      }
    }
  }

  handleUpdateCausedByEvent = (event: React.FormEvent<HTMLInputElement>) => {
    const { value } = event.currentTarget
    const valueToFormatAndUpdate = this.isInvalidTradingValue(value) ? RESET_NOTIONAL_VALUE : value
    const callback = (newValue: string) => this.checkStatus(newValue)
    this.formatAndUpdateValue(valueToFormatAndUpdate, callback)
  }

  isInvalidTradingValue = (value: string) => value === DOT || value === '0' || value === '' || value === 'Infinity'

  formatAndUpdateValue = (inputValue: string, callback?: (newValue: string) => void) => {
    const { updateNotional } = this.props
    const stringNotional = numeral(inputValue).format(NUMERAL_FORMAT)
    updateNotional(stringNotional)
    if (this.inputRef.current) {
      this.inputRef.current.value = stringNotional
      if (callback) {
        callback(stringNotional)
      }
    }
  }

  checkStatus = (value: string) => {
    const { disabled } = this.props
    const { showMessage } = this.state
    const numericValue = convertNotionalShorthandToNumericValue(value)
    if (this.isInvalidTradingValue(value)) {
      // if entered value is invalid trading value, disable Buy/Sell buttons.
      // not showing message error since the user could be in the process
      // of entering a valid value
      this.updateStatus(true, false)
    } else if (numericValue >= MAX_NOTIONAL_VALUE) {
      // if entered value bigger than max, show message error.
      this.updateStatus(true, true)
    } else if (showMessage || disabled) {
      // all value checks have passed
      // if Buy/Sell buttons are disabled and/or error message is shown from previous check
      // enable buttons and remove message error.
      this.updateStatus(false, false)
    }
  }

  updateStatus = (disableTrading: boolean, showMessage: boolean) => {
    const { setDisabledTradingState } = this.props
    this.setState({ showMessage })
    setDisabledTradingState(disableTrading)
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
