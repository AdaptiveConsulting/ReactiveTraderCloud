import { bind } from "@react-rxjs/core"
import { format } from "date-fns"
import { forwardRef, useRef } from "react"
import { map } from "rxjs/operators"
import styled from "styled-components"

import { AdaptiveLoader } from "@/client/components/AdaptiveLoader"
import { PopInIcon } from "@/client/components/icons/PopInIcon"
import { PopOutIcon } from "@/client/components/icons/PopOutIcon"
import { Stack } from "@/client/components/Stack"
import { Typography } from "@/client/components/Typography"
import { CurrencyPair } from "@/services/currencyPairs"
import { getPrice$ } from "@/services/prices"

import { tearOut } from "../TearOut/state"
import { useTileContext } from "../Tile.context"
import { TileStates, useTileState } from "../Tile.state"

export const DeliveryDate = styled.div`
  margin-left: auto;
  transition: margin-right 0.2s;
`
const HeaderWrapper = styled(Stack)`
  position: relative;
  background-color: ${({ theme }) =>
    theme.color["Colors/Background/bg-tertiary"]};
`
export const HeaderAction = styled.button`
  position: absolute;
  right: 6px;
  top: 6px;
  opacity: 0;
  transition: opacity 0.2s;

  color: ${({ theme }) => theme.color["Colors/Foreground/fg-quinary (400)"]};
  &:hover {
    color: ${({ theme }) => theme.color["Colors/Foreground/fg-quinary_hover"]};
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
  executing?: boolean
  date: string
  onClick: () => void
}

export const HeaderInner = forwardRef<HTMLDivElement, HeaderProps>(
  function HeaderInner(
    { currencyPair, isTornOut, supportsTearOut, date, executing, onClick },
    ref,
  ) {
    const { base, terms } = currencyPair
    const canTearOut = supportsTearOut

    return (
      <HeaderWrapper
        ref={ref}
        alignItems="center"
        paddingY="md"
        paddingX="md"
        gap="md"
      >
        {executing && <AdaptiveLoader size={12} />}
        <Typography
          variant="Text sm/Regular"
          color="Colors/Text/text-tertiary (600)"
        >
          {base}/{terms}
        </Typography>
        <DeliveryDate>
          <Typography
            variant="Text sm/Regular"
            color="Colors/Text/text-tertiary (600)"
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
  const { status } = useTileState(currencyPair.symbol)

  return (
    <HeaderInner
      ref={ref}
      currencyPair={currencyPair}
      date={date}
      isTornOut={isTornOut}
      supportsTearOut={supportsTearOut}
      executing={status === TileStates.Started}
      onClick={onClick}
    />
  )
}
