import React, { PureComponent } from 'react'
import {
  InputWrapper,
  CurrencyPairSymbol,
  Input,
  ResetInputValue,
  MessagePlaceholder,
} from './styled'
import { ValidationMessage } from './types'

interface Props {
  currencyPairBase: string
  currencyPairSymbol: string
  notional: number
  updateNotional: (notional: number) => void
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

  handleResetNotional = () => {
    this.props.resetNotional()
  }

  render() {
    const {
      currencyPairSymbol,
      currencyPairBase,
      notional,
      updateNotional,
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
          numericValue={notional}
          onFocus={this.handleFocus}
          onNumericValueChange={updateNotional}
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
