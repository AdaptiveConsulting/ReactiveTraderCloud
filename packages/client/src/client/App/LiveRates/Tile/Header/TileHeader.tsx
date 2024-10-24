import { bind } from "@react-rxjs/core"
import { format } from "date-fns"
import { forwardRef, useRef } from "react"
import { map } from "rxjs/operators"
import styled from "styled-components"

import { PopInIcon } from "@/client/components/icons/PopInIcon"
import { PopOutIcon } from "@/client/components/icons/PopOutIcon"
import { CurrencyPair } from "@/services/currencyPairs"
import { getPrice$ } from "@/services/prices"

import { tearOut } from "../TearOut/state"
import { useTileContext } from "../Tile.context"

export const DeliveryDate = styled.div`
  line-height: 1rem;
  margin-left: auto;
  transition: margin-right 0.2s;
`
const HeaderWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  position: relative;
  background-color: ${({ theme }) =>
    theme.newTheme.color["Colors/Background/bg-tertiary"]};
  padding: ${({ theme }) =>
    `${theme.newTheme.spacing.md} ${theme.newTheme.spacing["3xl"]}`};
  font-size: 11px;
  color: ${({ theme }) =>
    theme.newTheme.color["Colors/Text/text-tertiary (600)"]};
`
export const HeaderAction = styled.button`
  position: absolute;
  right: 6px;
  top: 8px;
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
  function HeaderInner(
    { currencyPair, isTornOut, supportsTearOut, date, onClick },
    ref,
  ) {
    const { base, terms } = currencyPair
    const canTearOut = supportsTearOut

    return (
      <HeaderWrapper ref={ref}>
        <div data-qa="tile-header__tile-symbol">
          {base}/{terms}
        </div>
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

export const Header = () => {
  const ref = useRef<HTMLDivElement>(null)
  const { currencyPair, isTornOut, supportsTearOut } = useTileContext()
  const date = useDate(currencyPair.symbol)
  const onClick = () => {
    ref.current && tearOut(currencyPair.symbol, !isTornOut, ref.current)
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
