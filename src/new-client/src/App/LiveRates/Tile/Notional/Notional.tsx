import { useState } from "react"
import styled from "styled-components"
import { FaRedo } from "react-icons/fa"
import { formatAsWholeNumber } from "@/utils/formatNumber"
import { useRfqState, QuoteState } from "../Rfq"
import { useTileCurrencyPair } from "../Tile.context"
import {
  defaultNotional$,
  getNotional$,
  onChangeNotionalValue,
  useDefaultNotional,
  useNotional,
} from "../Tile.state"
import {
  InputWrapper,
  CurrencyPairSymbol,
  Input,
  NotionalInputWrapper,
} from "./Notional.styles"
import { merge } from "rxjs"

const ResetInputValue = styled.button<{ isVisible: boolean }>`
  background-color: ${({ theme }) => theme.core.lightBackground};
  border: 2px solid ${({ theme }) => theme.core.darkBackground};
  display: ${({ isVisible }) => (isVisible ? "inline" : "none")};
  border-radius: 3px;
  margin-left: 8px;
  grid-area: ResetInputValue;
  cursor: pointer;
  font-size: 0.625rem;
  line-height: 1.2rem;
  .flipHorizontal {
    transform: scaleX(-1);
  }
`

export const notionalInput$ = (symbol: string) =>
  merge(...[defaultNotional$, getNotional$].map((fn) => fn(symbol)))

export const NotionalInput: React.FC<{ isAnalytics: boolean }> = ({
  isAnalytics,
}) => {
  const { base, symbol } = useTileCurrencyPair()
  const notional = useNotional()
  const defaultNotional = useDefaultNotional()
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
          value={isFocused ? notional : formatAsWholeNumber(notional)}
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
        <ResetInputValue
          isVisible={notional !== defaultNotional}
          onClick={() => {
            onChangeNotionalValue({
              symbol,
              value: defaultNotional.toString(),
            })
          }}
        >
          <FaRedo className="flipHorizontal" />
        </ResetInputValue>
      </InputWrapper>
    </NotionalInputWrapper>
  )
}
