import { useTileCurrencyPair } from "../Tile.context"
import { onChangeNotionalValue, useNotional } from "../Tile.state"
import {
  InputWrapper,
  CurrencyPairSymbol,
  Input,
  NotionalInputWrapper,
} from "./Notional.styles"

export const NotionalInput: React.FC<{ isAnalytics: boolean }> = ({
  isAnalytics,
}) => {
  const { base, symbol } = useTileCurrencyPair()
  const notional = useNotional(symbol)

  return (
    <NotionalInputWrapper isAnalyticsView={isAnalytics}>
      <InputWrapper>
        <CurrencyPairSymbol>{base}</CurrencyPairSymbol>
        <Input
          type="text"
          value={notional}
          onChange={({ target: { value } }) => {
            onChangeNotionalValue({ symbol, value })
          }}
          onFocus={(event) => event.target.select()}
        />
      </InputWrapper>
    </NotionalInputWrapper>
  )
}
