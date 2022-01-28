import styled from "styled-components"
import { map } from "rxjs/operators"
import { format } from "date-fns"
import { getPrice$ } from "@/services/prices"
import { bind } from "@react-rxjs/core"
import { useTileContext } from "../Tile.context"
import { PopOutIcon } from "@/components/icons/PopOutIcon"
import { tearOut } from "../TearOut/state"
import { PopInIcon } from "@/components/icons/PopInIcon"
import { forwardRef, useRef } from "react"
import { CurrencyPair } from "@/services/currencyPairs"

export const DeliveryDate = styled.div`
  color: ${({ theme }) => theme.core.textColor};
  font-size: 0.625rem;
  line-height: 1rem;
  opacity: 0.59;
  margin-left: auto;
  transition: margin-right 0.2s;
`
const HeaderWrapper = styled.div`
  display: flex;
  align-items: center;
  position: relative;
`
const TileSymbol = styled.div`
  color: ${({ theme }) => theme.core.textColor};
  font-size: 0.8125rem;
  line-height: 1rem;
`
export const HeaderAction = styled.button`
  position: absolute;
  right: -4px;
  top: -5px;
  opacity: 0;
  transition: opacity 0.2s;

  &:hover {
    .tear-out-hover-state {
      fill: #5f94f5;
    }
  }
`

export const [useDate, header$] = bind((symbol: string) =>
  getPrice$(symbol).pipe(
    map(
      ({ valueDate }) =>
        `SPT (${format(new Date(valueDate), "dd MMM").toUpperCase()})`,
    ),
  ),
)

type HeaderProps = {
  currencyPair: CurrencyPair
  isTornOut?: boolean
  supportsTearOut?: boolean
  date: string
  onClick: () => void
}

export const HeaderInner = forwardRef<HTMLDivElement, HeaderProps>(
  ({ currencyPair, isTornOut, supportsTearOut, date, onClick }, ref) => {
    const { base, terms } = currencyPair
    const canTearOut = supportsTearOut

    return (
      <HeaderWrapper ref={ref}>
        <TileSymbol data-qa="tile-header__tile-symbol">
          {base}/{terms}
        </TileSymbol>
        <DeliveryDate data-qa="tile-header__delivery-date">{date}</DeliveryDate>
        {canTearOut && (
          <HeaderAction
            onClick={onClick}
            aria-label={
              isTornOut
                ? "Return window to application"
                : "Tear out into standalone window"
            }
          >
            {isTornOut ? <PopInIcon /> : <PopOutIcon />}
          </HeaderAction>
        )}
      </HeaderWrapper>
    )
  },
)

export const Header: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null)
  const { currencyPair, isTornOut, supportsTearOut } = useTileContext()
  const date = useDate(currencyPair.symbol)
  const onClick = () => {
    tearOut(currencyPair.symbol, !isTornOut, ref.current!)
  }

  return (
    <HeaderInner
      ref={ref}
      currencyPair={currencyPair}
      date={date}
      isTornOut={isTornOut}
      supportsTearOut={supportsTearOut}
      onClick={onClick}
    />
  )
}
