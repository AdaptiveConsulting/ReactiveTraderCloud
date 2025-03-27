import { createKeyedSignal } from "@react-rxjs/utils"
import { concat, merge, pipe } from "rxjs"
import { filter, map, take } from "rxjs/operators"

import { RefreshIcon } from "@/client/components/icons/RefreshIcon"
import { Typography } from "@/client/components/Typography"
import { formatNotional } from "@/client/utils/formatNotional"
import { currencyPairs$ } from "@/services/currencyPairs"

import { QuoteStateStage, useRfqState } from "../Rfq"
import { symbolBind, useTileCurrencyPair } from "../Tile.context"
import {
  ErrorMessage,
  Input,
  InputWrapper,
  ResetInputValue,
} from "./Notional.styles"

const [rawNotional$, onChangeNotionalValue] = createKeyedSignal(
  (x) => x.symbol,
  (symbol: string, rawVal: string) => ({ symbol, rawVal }),
)
export { onChangeNotionalValue }

export const [useNotional, getNotional$] = symbolBind((symbol) =>
  concat(
    currencyPairs$.pipe(
      take(1),
      map((ccPairs) => ({
        symbol,
        rawVal: ccPairs[symbol].defaultNotional.toString(),
      })),
    ),
    rawNotional$(symbol),
  ).pipe(
    map(({ rawVal }) => formatNotional(rawVal, ["k", "m"])),
    filter(([value]) => !Number.isNaN(value)),
  ),
)
export const [, getNotionalValue$] = symbolBind(
  pipe(
    getNotional$,
    map(([value]) => value),
  ),
)

export const [useIsNotionalValid] = symbolBind(
  pipe(
    getNotionalValue$,
    map((value) => value <= MAX_NOTIONAL),
  ),
  true,
)

const [useDefaultNotional, defaultNotional$] = symbolBind((symbol) =>
  currencyPairs$.pipe(map((pairs) => pairs[symbol].defaultNotional)),
)

export const notionalInput$ = (symbol: string) =>
  merge(...[defaultNotional$, getNotional$].map((fn) => fn(symbol)))

const MAX_NOTIONAL = 1_000_000_000

type Props = {
  id: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  base: string
  valid: boolean
  disabled: boolean
  canReset: boolean
  onReset: () => void
}

export const NotionalInputInner = ({
  id,
  base,
  valid,
  disabled,
  value,
  onChange,
  canReset,
  onReset,
}: Props) => (
  <InputWrapper>
    <Typography
      as="label"
      variant="Text sm/Regular"
      color="Colors/Text/text-tertiary (600)"
      htmlFor={id}
    >
      {base}
    </Typography>
    <Input
      type="text"
      id={id}
      className={!valid ? `is-invalid` : undefined}
      disabled={disabled}
      value={value}
      onChange={onChange}
      onFocus={(event) => {
        event.target.select()
      }}
    />
    <ResetInputValue isVisible={canReset} onClick={onReset}>
      <RefreshIcon width={14} height={14} />
    </ResetInputValue>
    {!valid && <ErrorMessage>Max exceeded</ErrorMessage>}
  </InputWrapper>
)

export const NotionalInput = () => {
  const { base, symbol } = useTileCurrencyPair()
  const defaultNotional = useDefaultNotional()
  const [value, inputValue] = useNotional()
  const valid = useIsNotionalValid()
  const { stage: quoteStage } = useRfqState()
  const id = `notional-input-${symbol}`

  return (
    <NotionalInputInner
      id={id}
      base={base}
      valid={valid}
      disabled={[QuoteStateStage.Received, QuoteStateStage.Requested].includes(
        quoteStage,
      )}
      value={inputValue}
      onChange={(e) => {
        onChangeNotionalValue(symbol, e.target.value)
      }}
      canReset={value !== defaultNotional}
      onReset={() => {
        onChangeNotionalValue(symbol, defaultNotional.toString(10))
      }}
    />
  )
}
