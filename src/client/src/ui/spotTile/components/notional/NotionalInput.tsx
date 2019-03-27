import numeral from 'numeral'
import React, { PureComponent } from 'react'
import { styled } from 'rt-theme'
import { NUMERAL_FORMAT } from '../TileBusinessLogic'

const DOT = '.'
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

export interface NotionalUpdate {
  value: string
  type: string
}

const CurrencyPairSymbol = styled('span')`
  grid-area: Currency;
  opacity: 0.59;
  font-size: 0.625rem;
  line-height: 1.2rem;
`

const MessagePlaceholder = styled.div<{ validationMessageType: ValidationMessage['type'] }>`
  ${({ theme, validationMessageType }) => {
    switch (validationMessageType) {
      case 'error':
        return `color: ${theme.template.red.normal}`
      case 'warning':
        return `color: ${theme.template.yellow.normal}`
      case 'info':
      default:
        return `color: ${theme.template.blue.normal}`
    }
  }};
  grid-area: Message;
  font-size: 0.6rem;
  line-height: normal;
  padding-top: 2px;
`

const InputWrapper = styled.div<{ altLayout: boolean }>`
  display: grid;
  grid-template-columns: 30px auto 30px;
  grid-template-areas: 'Currency Input ResetInputValue' '. Message .';
  align-items: center;
  ${({ altLayout }) =>
    altLayout
      ? `
  grid-template-rows: 23px 13px;
  margin-bottom: -0.5rem;
  `
      : `
  grid-template-rows: 23px 0;
  `};
`

export const Input = styled.input<{
  validationMessage: ValidationMessage
}>`
  grid-area: Input;
  background: none;
  text-align: center;
  outline: none;
  border: none;
  font-size: 0.75rem;
  width: 80px;
  padding: 2px 0;
  ${({ disabled }) => disabled && 'opacity: 0.3;'}
  ${({ theme, validationMessage }) =>
    !validationMessage
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

const ResetInputValue = styled.button`
  background-color: ${({ theme }) => theme.core.lightBackground};
  border: 2px solid ${({ theme }) => theme.core.darkBackground};
  border-radius: 3px;
  margin-left: 8px;
  grid-area: ResetInputValue;
  font-size: 0.625rem;
  line-height: 1.2rem;
`

interface Props {
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
    const { currentTarget, type } = event
    const inputValue = currentTarget.value.trim()
    const value = this.formatNotional(inputValue)
    updateNotional({ value, type })
  }

  handleResetNotional = () => {
    this.props.resetNotional()
  }

  formatNotional = (notional: string) => {
    // user may be trying to enter decimals or
    // user may be deleting previous entry (empty string)
    // in those cases, format and update only when completed.
    if (notional === '.') {
      return '0.'
    }
    const lastTwoChars = notional.substr(-2)
    return notional !== '' && lastTwoChars.indexOf(DOT) === -1
      ? numeral(notional).format(NUMERAL_FORMAT)
      : notional
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
      notional,
      validationMessage,
      showResetButton,
      disabled,
    } = this.props
    const stringNotional = this.formatNotional(notional)

    return (
      <InputWrapper altLayout={Boolean(validationMessage)}>
        <CurrencyPairSymbol>{currencyPairSymbol}</CurrencyPairSymbol>
        <Input
          type="text"
          ref={this.inputRef}
          value={stringNotional}
          onFocus={this.handleFocus}
          onChange={this.handleChange}
          onBlur={this.handleChange}
          onKeyPress={this.handleKeyPressNotionalInput}
          validationMessage={validationMessage}
          disabled={disabled}
        />
        {showResetButton && (
          <ResetInputValue onClick={this.handleResetNotional}>
            <i className="fas fa-redo fa-flip-horizontal" />
          </ResetInputValue>
        )}
        {validationMessage && (
          <MessagePlaceholder validationMessageType={validationMessage.type}>
            {validationMessage.content}
          </MessagePlaceholder>
        )}
      </InputWrapper>
    )
  }
}
