import styled from "styled-components"
import { map } from "rxjs/operators"
import { format } from "date-fns"
import { getPrice$ } from "@/services/prices"
import { bind } from "@react-rxjs/core"
import { useTileContext } from "../Tile.context"
import { PopOutIcon } from "@/components/icons/PopOutIcon"
import { tearOut } from "../TearOut/state"
import { PopInIcon } from "@/components/icons/PopInIcon"
import { useRef } from "react"

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

export const Header: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null)
  const {
    currencyPair: { base, terms, symbol },
    isTornOut,
    supportsTearOut,
  } = useTileContext()
  const date = useDate(symbol)
  const canTearOut = supportsTearOut

  return (
    <HeaderWrapper ref={ref}>
      <TileSymbol data-qa="tile-header__tile-symbol">
        {base}/{terms}
      </TileSymbol>
      <DeliveryDate data-qa="tile-header__delivery-date">{date}</DeliveryDate>
      {canTearOut && (
        <HeaderAction
          onClick={() => {
            tearOut(symbol, !isTornOut, ref.current!)
          }}
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
}
