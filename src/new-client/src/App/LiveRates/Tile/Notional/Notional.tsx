import { useState } from "react"
import { useTileCurrencyPair } from "../Tile.context"
import { onChangeNotionalValue, useNotional } from "../Tile.state"
import {
  InputWrapper,
  CurrencyPairSymbol,
  Input,
  NotionalInputWrapper,
} from "./Notional.styles"
import { formatAsWholeNumber } from "utils/formatNumber"

export const NotionalInput: React.FC<{ isAnalytics: boolean }> = ({
  isAnalytics,
}) => {
  const { base, symbol } = useTileCurrencyPair()
  const notional = useNotional(symbol)
  const [isFocused, setIsFocused] = useState(false)

  return (
    <NotionalInputWrapper isAnalyticsView={isAnalytics}>
      <InputWrapper>
        <CurrencyPairSymbol>{base}</CurrencyPairSymbol>
        <Input
          role={"input"}
          type="text"
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
      </InputWrapper>
    </NotionalInputWrapper>
  )
}
