import styled from "styled-components"
import { FaRedo } from "react-icons/fa"
import { useRfqState, QuoteState } from "../Rfq"
import { symbolBind, useTileCurrencyPair } from "../Tile.context"
import {
  InputWrapper,
  CurrencyPairSymbol,
  Input,
  NotionalInputWrapper,
} from "./Notional.styles"
import { merge, pipe } from "rxjs"
import { currencyPairs$ } from "@/services/currencyPairs"
import { filter, map, mergeMap, pluck } from "rxjs/operators"
import {
  collect,
  createListener,
  getGroupedObservable,
  split,
} from "@react-rxjs/utils"

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

const [rawNotional$, onChangeNotionalValue] = createListener<{
  symbol: string
  rawVal: string
}>()
export { onChangeNotionalValue }

const initialNotionals$ = currencyPairs$.pipe(
  mergeMap((pairs) =>
    Object.values(pairs).map(({ symbol, defaultNotional: value }) => ({
      symbol,
      rawVal: value.toString(10),
    })),
  ),
)

const multipliers: Record<string, number> = {
  k: 1_000,
  m: 1_000_000,
}
const formatter = new Intl.NumberFormat("default")

const mapNotionals$ = merge(rawNotional$, initialNotionals$).pipe(
  split(
    (e) => e.symbol,
    (rawNotional$) =>
      rawNotional$.pipe(
        map(({ rawVal }) => {
          const lastChar = rawVal.slice(-1).toLowerCase()
          const value =
            Number(rawVal.replace(/,|k$|m$|K$|M$/g, "")) *
            (multipliers[lastChar] || 1)
          return {
            value,
            inputValue: formatter.format(value) + (lastChar === "." ? "." : ""),
          }
        }),
        filter(({ value }) => !Number.isNaN(value)),
      ),
  ),
  collect(),
)

const [useNotional, getNotional$] = symbolBind((symbol) =>
  getGroupedObservable(mapNotionals$, symbol),
)
export const [, getNotionalValue$] = symbolBind(
  pipe(getNotional$, pluck("value")),
)

const [useDefaultNotional, defaultNotional$] = symbolBind((symbol) =>
  currencyPairs$.pipe(map((pairs) => pairs[symbol].defaultNotional)),
)

export const notionalInput$ = (symbol: string) =>
  merge(...[defaultNotional$, getNotional$].map((fn) => fn(symbol)))

export const NotionalInput: React.FC<{ isAnalytics: boolean }> = ({
  isAnalytics,
}) => {
  const { base, symbol } = useTileCurrencyPair()
  const defaultNotional = useDefaultNotional()
  const notional = useNotional()
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
          value={notional.inputValue}
          onChange={(e) => {
            onChangeNotionalValue({ symbol, rawVal: e.target.value })
          }}
          onFocus={(event) => {
            event.target.select()
          }}
        />
        <ResetInputValue
          isVisible={notional.value !== defaultNotional}
          onClick={() => {
            onChangeNotionalValue({
              symbol,
              rawVal: defaultNotional.toString(10),
            })
          }}
        >
          <FaRedo className="flipHorizontal" />
        </ResetInputValue>
      </InputWrapper>
    </NotionalInputWrapper>
  )
}
