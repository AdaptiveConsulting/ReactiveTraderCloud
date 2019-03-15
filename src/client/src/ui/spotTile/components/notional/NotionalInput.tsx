import numeral from 'numeral'
import React, { PureComponent } from 'react'
import { styled } from 'rt-theme'
import { convertNotionalShorthandToNumericValue } from './utils'

const NUMERAL_FORMAT = '0,000,000[.]00'
const DOT = '.'
const ENTER = 'Enter'
const CHAR_CODE_DOT = 46
const CHAR_CODE_0 = 48
const CHAR_CODE_9 = 57
const CHAR_CODE_UNIT_SEP = 31
const SHORTCUT_CHAR_CODES = [75, 77, 107, 109]
const MAX_NOTIONAL_VALUE = 1000000000
const RESET_NOTIONAL_VALUE = '0'
export const DEFAULT_NOTIONAL_VALUE = '1000000'

const CurrencyPairSymbol = styled('span')`
  grid-area: Currency;
  opacity: 0.59;
  font-size: 0.625rem;
  line-height: 1.2rem;
  padding-right: 0.375rem;
`

const ErrorMessagePlaceholder = styled.div`
  ${({ theme }) => `color: ${theme.template.red.normal}`};
  grid-area: Message;
  font-size: 0.6rem;
  line-height: normal;
  padding-top: 2px;
  margin-bottom: -1rem; /* Prevents the layout to change in Tile when this ErrorMessagePlaceholder is rendered */
`

const InputWrapper = styled.div`
  display: grid;
  grid-template-columns: 1auto 1auto;
  grid-template-rows: 1auto 1auto;
  grid-template-areas: 'Currency Input' '. Message';
`

export const Input = styled.input<{ inError: boolean }>`
  grid-area: Input;
  background: none;
  text-align: center;
  outline: none;
  border: none;
  font-size: 0.75rem;
  width: 80px;
  padding: 2px 0;
  ${({ inError, theme }) =>
    !inError
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
  setInErrorStatus: (inError: boolean) => void
  inError: boolean
}

export default class NotionalInput extends PureComponent<Props> {
  private inputRef = React.createRef<HTMLInputElement>()

  render() {
    const { currencyPairSymbol, notional, inError } = this.props
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
          inError={inError}
        />
        {inError && <ErrorMessagePlaceholder>Max exceeded</ErrorMessagePlaceholder>}
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
      // only allow one dot unless the existing dot is in the text selection while replacing existing text.
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
    const numericValue = convertNotionalShorthandToNumericValue(value)
    if (numericValue >= MAX_NOTIONAL_VALUE) {
      // if entered value bigger than max, show error.
      this.setInErrorStatus(true)
    } else if (this.props.inError) {
      // if in error and value entered becomes smaller, remove error.
      this.setInErrorStatus(false)
    }
    if (!isNaN(numericValue)) {
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
    this.formatAndUpdateValue(value !== DOT && value !== '' ? value : RESET_NOTIONAL_VALUE)
  }

  formatAndUpdateValue = (inputValue: string) => {
    const { updateNotional } = this.props
    const stringNotional = numeral(inputValue).format(NUMERAL_FORMAT)
    updateNotional(stringNotional)
    if (this.inputRef.current) {
      this.inputRef.current.value = stringNotional
    }
  }

  setInErrorStatus = (inError: boolean) => {
    const { setInErrorStatus } = this.props
    setInErrorStatus(inError)
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
