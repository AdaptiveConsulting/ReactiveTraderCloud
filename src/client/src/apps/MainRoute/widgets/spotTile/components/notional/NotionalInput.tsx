import React, { PureComponent } from 'react'
import {
  InputWrapper,
  CurrencyPairSymbol,
  Input,
  ResetInputValue,
  MessagePlaceholder,
} from './styled'
import { NotionalUpdate } from '../../model/spotTileData'

const ENTER = 'Enter'
const CHAR_CODE_DOT = 46 // .
const CHAR_CODE_0 = 48 // 0
const CHAR_CODE_9 = 57 // 9
const CHAR_CODE_UNIT_SEP = 31 // US (unit separator)
const SHORTCUT_CHAR_CODES = [75, 77, 107, 109] // K, M, k, m

export type ValidationMessage = null | {
  type: 'warning' | 'error' | 'info'
  content: string
}

interface Props {
  currencyPairBase: string
  currencyPairSymbol: string
  notional: string
  updateNotional: (notionalUpdate: NotionalUpdate) => void
  resetNotional: () => void
  validationMessage: ValidationMessage
  showResetButton?: boolean
  disabled: boolean
}

interface State {
  showMessage: boolean
}

export default class NotionalInput extends PureComponent<Props, State> {
  private inputRef = React.createRef<HTMLInputElement>()

  handleFocus = (event: React.FocusEvent<HTMLInputElement>) => {
    event.target.select()
  }

  handleKeyPressNotionalInput = (event: React.KeyboardEvent<HTMLInputElement>) => {
    const { charCode, currentTarget, nativeEvent } = event
    if (event.key === ENTER) {
      this.handleChange(event)
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

  handleChange = (event: React.FormEvent<HTMLInputElement>) => {
    const { updateNotional } = this.props
    const { currentTarget, type: updateType } = event
    const value = currentTarget.value.trim()
    updateNotional({ value, updateType })
  }

  handleResetNotional = () => {
    this.props.resetNotional()
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

  render() {
    const {
      currencyPairSymbol,
      currencyPairBase,
      notional,
      validationMessage,
      showResetButton,
      disabled,
    } = this.props

    return (
      <InputWrapper altLayout={Boolean(validationMessage)}>
        <CurrencyPairSymbol data-qa="notional-input__currency-pair-symbol">
          {currencyPairBase}
        </CurrencyPairSymbol>
        <Input
          type="text"
          ref={this.inputRef}
          value={notional}
          onFocus={this.handleFocus}
          onChange={this.handleChange}
          onBlur={this.handleChange}
          onKeyPress={this.handleKeyPressNotionalInput}
          validationMessage={validationMessage}
          disabled={disabled}
          data-qa-id={`notional-input__input-${currencyPairSymbol.toLowerCase()}`}
        />
        {showResetButton && (
          <ResetInputValue
            onClick={this.handleResetNotional}
            data-qa="notional-input__reset-input-value"
          >
            <i className="fas fa-redo fa-flip-horizontal" />
          </ResetInputValue>
        )}
        {validationMessage && (
          <MessagePlaceholder
            validationMessageType={validationMessage.type}
            data-qa="notional-input__validation-message"
          >
            {validationMessage.content}
          </MessagePlaceholder>
        )}
      </InputWrapper>
    )
  }
}
