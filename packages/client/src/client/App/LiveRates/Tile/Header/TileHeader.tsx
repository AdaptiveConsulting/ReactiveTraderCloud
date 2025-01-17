import { bind } from "@react-rxjs/core"
import { format } from "date-fns"
import { forwardRef, useRef } from "react"
import { map } from "rxjs/operators"
import styled from "styled-components"

import { FlexBox } from "@/client/components/FlexBox"
import { PopInIcon } from "@/client/components/icons/PopInIcon"
import { PopOutIcon } from "@/client/components/icons/PopOutIcon"
import { Typography } from "@/client/components/Typography"
import { CurrencyPair } from "@/services/currencyPairs"
import { getPrice$ } from "@/services/prices"

import { tearOut } from "../TearOut/state"
import { useTileContext } from "../Tile.context"

export const DeliveryDate = styled.div`
  transition: margin-right 0.2s;
`
const HeaderWrapper = styled(FlexBox)`
  position: relative;
  justify-content: space-between;
  background-color: ${({ theme }) =>
    theme.newTheme.color["Colors/Background/bg-secondary"]};
  padding: ${({ theme }) =>
    `${theme.newTheme.spacing.md} ${theme.newTheme.spacing["3xl"]} `};
  padding-left: ${({ theme }) => theme.newTheme.spacing.md};
  padding-right: ${({ theme }) => theme.newTheme.spacing.md};
`
export const HeaderAction = styled.button`
  position: absolute;
  right: 6px;
  top: 6px;
  opacity: 0;
  transition: opacity 0.2s;

  svg {
    fill: ${({ theme }) =>
      theme.newTheme.color["Colors/Foreground/fg-quinary (400)"]};
  }

  &:hover {
    svg {
      fill: ${({ theme }) =>
        theme.newTheme.color["Colors/Foreground/fg-quinary_hover"]};
    }
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
        <Typography
          variant="Text sm/Regular"
          color="Colors/Text/text-tertiary (600)"
          data-qa="tile-header__tile-symbol"
        >
          {base}/{terms}
        </Typography>
        <DeliveryDate>
          <Typography
            variant="Text sm/Regular"
            color="Colors/Text/text-tertiary (600)"
            data-qa="tile-header__delivery-date"
          >
            {date}
          </Typography>
        </DeliveryDate>
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
