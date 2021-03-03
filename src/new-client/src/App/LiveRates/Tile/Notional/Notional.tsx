import { useState } from "react"
import { formatAsWholeNumber } from "utils/formatNumber"
import { useRfqState, QuoteState } from "../Rfq"
import { useTileCurrencyPair } from "../Tile.context"
import { onChangeNotionalValue, useNotional } from "../Tile.state"
import {
  InputWrapper,
  CurrencyPairSymbol,
  Input,
  NotionalInputWrapper,
} from "./Notional.styles"
import { NotionalReset } from "./NotionalReset"

export const NotionalInput: React.FC<{ isAnalytics: boolean }> = ({
  isAnalytics,
}) => {
  const { base, symbol } = useTileCurrencyPair()
  const notional = useNotional(symbol)
  const [isFocused, setIsFocused] = useState(false)
  const { state: quoteState } = useRfqState()

  return (
    <NotionalInputWrapper isAnalyticsView={isAnalytics}>
      <InputWrapper>
        <CurrencyPairSymbol>{base}</CurrencyPairSymbol>
        <Input
          role={"input"}
          type="text"
          disabled={[QuoteState.Received, QuoteState.Requested].includes(
            quoteState,
          )}
          value={isFocused ? notional : formatAsWholeNumber(parseInt(notional))}
          onChange={({ target: { value } }) => {
            onChangeNotionalValue({ symbol, value })
          }}
          onFocus={(event) => {
            event.target.select()
            setIsFocused(true)
          }}
          onBlur={() => {
            setIsFocused(false)
          }}
        />
        <NotionalReset symbol={symbol} />
      </InputWrapper>
    </NotionalInputWrapper>
  )
}
