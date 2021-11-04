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
const HeaderWrapper = styled.div<{ tearOutMock?: boolean }>`
  display: flex;
  align-items: center;
  position: relative;
  margin-right: ${({ tearOutMock }) => (tearOutMock ? "1.3rem" : "")};
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
  const onClick = () => {
    tearOut(symbol, !isTornOut)
  }
  return (
    <HeaderComponent
      canTearOut={canTearOut}
      date={date}
      base={base}
      terms={terms}
      isTornOut={isTornOut}
      onClick={onClick}
    />
  )
}

export const HeaderComponent: React.FC<{
  canTearOut?: boolean
  date: any
  base: any
  terms: any
  isTornOut?: boolean
  onClick?: () => void
  tearOutMock?: boolean
}> = ({
  canTearOut,
  base,
  terms,
  date,
  isTornOut,
  onClick,
  tearOutMock = false,
}) => {
  return (
    <HeaderWrapper tearOutMock={tearOutMock}>
      <TileSymbol data-qa="tile-header__tile-symbol">
        {base}/{terms}
      </TileSymbol>
      <DeliveryDate data-qa="tile-header__delivery-date">{date}</DeliveryDate>
      {canTearOut && !tearOutMock && (
        <HeaderAction onClick={onClick ? onClick : () => {}}>
          {isTornOut ? <PopInIcon /> : <PopOutIcon />}
        </HeaderAction>
      )}
      {tearOutMock && (
        <PopOutIconContainer>
          <PopOutIcon />
        </PopOutIconContainer>
      )}
    </HeaderWrapper>
  )
}
