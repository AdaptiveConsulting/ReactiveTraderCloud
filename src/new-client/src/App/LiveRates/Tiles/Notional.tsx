import styled from "styled-components/macro"
import { map } from "rxjs/operators"
import { bind } from "@react-rxjs/core"
import { getCurrencyPair$ } from "services/currencyPairs"
import { formatAsWholeNumber } from "utils/formatNumber"
import { InputWrapper } from "./responsiveWrappers"
import { SymbolContext } from "./Tile"
import { useContext } from "react"

export const Input = styled.input`
  grid-area: Input;
  background: none;
  text-align: center;
  outline: none;
  border: none;
  font-size: 0.75rem;
  width: 80px;
  padding: 2px 0;
  color: ${({ theme }) => theme.core.textColor};
  border-bottom: 1.5px solid ${({ theme }) => theme.primary[5]};
  caret-color: ${({ theme }) => theme.primary.base};
  &:focus {
    outline: none !important;
    border-color: ${({ theme }) => theme.accents.primary.base};
  }
`

export const CurrencyPairSymbol = styled("span")`
  grid-area: Currency;
  opacity: 0.59;
  font-size: 0.625rem;
  line-height: 1.2rem;
`

const [useBase, notionalInput$] = bind((symbol: string) =>
  getCurrencyPair$(symbol).pipe(map(({ base }) => base)),
)

const notional = 100_000

export { notionalInput$ }
export const NotionalInput: React.FC = () => {
  const symbol = useContext(SymbolContext)
  const base = useBase(symbol)
  return (
    <InputWrapper>
      <CurrencyPairSymbol data-qa="notional-input__currency-pair-symbol">
        {base}
      </CurrencyPairSymbol>
      <Input
        type="text"
        value={formatAsWholeNumber(notional)}
        onChange={() => {}}
        onFocus={(event) => event.target.select()}
        data-qa-id={`notional-input__input-${symbol.toLowerCase()}`}
      />
    </InputWrapper>
  )
}
