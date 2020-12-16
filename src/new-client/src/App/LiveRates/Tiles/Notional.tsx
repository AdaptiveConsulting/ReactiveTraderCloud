import React from "react"
import { CurrencyPairSymbol, Input, ResetInputValue } from "./styled"
import { InputWrapper } from "./responsiveWrappers"
import { formatAsWholeNumber } from "utils/formatNumber"
interface Props {
  currencyPairBase: string
  currencyPairSymbol: string
  notional: number
}

export const NotionalInput: React.FC<Props> = ({
  currencyPairBase,
  currencyPairSymbol,
  notional,
}) => {
  const showResetButton = false
  const handleFocus = (event: React.FocusEvent<HTMLInputElement>) => {
    event.target.select()
  }

  const handleResetNotional = () => {}

  //const updateNotional = () => {}

  return (
    <InputWrapper>
      <CurrencyPairSymbol data-qa="notional-input__currency-pair-symbol">
        {currencyPairBase}
      </CurrencyPairSymbol>
      <Input
        type="text"
        value={formatAsWholeNumber(notional)}
        onChange={() => {}}
        onFocus={handleFocus}
        data-qa-id={`notional-input__input-${currencyPairSymbol.toLowerCase()}`}
      />
      {showResetButton && (
        <ResetInputValue
          onClick={handleResetNotional}
          data-qa="notional-input__reset-input-value"
        >
          <i className="fas fa-redo fa-flip-horizontal" />
        </ResetInputValue>
      )}
    </InputWrapper>
  )
}
