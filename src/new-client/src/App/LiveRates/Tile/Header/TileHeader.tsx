import styled from "styled-components"
import { map } from "rxjs/operators"
import { format } from "date-fns"
import { getPrice$ } from "@/services/prices"
import { bind } from "@react-rxjs/core"
import { useTileContext } from "../Tile.context"
import { PopOutIcon } from "@/components/icons/PopOutIcon"
import { tearOut } from "../TearOut/state"
import { PopInIcon } from "@/components/icons/PopInIcon"

export const DeliveryDate = styled.div`
  color: ${({ theme }) => theme.core.textColor};
  font-size: 0.625rem;
  line-height: 1rem;
  opacity: 0.59;
  margin-left: auto;
  transition: margin-right 0.2s;
`
const HeaderWrapper = styled.div<{ supportsTearOut?: boolean }>`
  display: flex;
  align-items: center;
  position: relative;
  margin-right: ${({ supportsTearOut }) => (supportsTearOut ? "1.3rem" : "")};
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

const PopOutIconContainer = styled.div`
  position: absolute;
  right: -25px;
  top: -5px;
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
  const {
    currencyPair: { base, terms, symbol },
    isTornOut,
    supportsTearOut,
  } = useTileContext()
  const date = useDate(symbol)
  const canTearOut = supportsTearOut

  return (
    <HeaderWrapper>
      <TileSymbol data-qa="tile-header__tile-symbol">
        {base}/{terms}
      </TileSymbol>
      <DeliveryDate data-qa="tile-header__delivery-date">{date}</DeliveryDate>
      {canTearOut && (
        <HeaderAction
          onClick={() => {
            tearOut(symbol, !isTornOut)
          }}
        >
          {isTornOut ? <PopInIcon /> : <PopOutIcon />}
        </HeaderAction>
      )}
    </HeaderWrapper>
  )
}

export const HeaderComponent: React.FC<{
  supportsTearOut: boolean
  currencyPair: any
}> = ({ currencyPair, supportsTearOut }) => {
  const dateVal = `SPT (${format(new Date("08/04"), "dd MMM").toUpperCase()})`
  return (
    <HeaderWrapper supportsTearOut={supportsTearOut}>
      <TileSymbol data-qa="tile-header__tile-symbol">
        {currencyPair.base}/{currencyPair.terms}
      </TileSymbol>
      <DeliveryDate data-qa="tile-header__delivery-date">
        {dateVal}
      </DeliveryDate>
      {supportsTearOut && (
        <PopOutIconContainer>
          <PopOutIcon />
        </PopOutIconContainer>
      )}
    </HeaderWrapper>
  )
}
