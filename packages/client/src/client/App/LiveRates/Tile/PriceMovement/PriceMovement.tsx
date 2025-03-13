import { PropsWithChildren } from "react"
import { distinctUntilChanged, map } from "rxjs/operators"

import { Line } from "@/client/components/Line"
import { Typography } from "@/client/components/Typography"
import { equals } from "@/client/utils/equals"
import { getPrice$, PriceMovementType } from "@/services/prices"

import { useRfqPayload } from "../Rfq/Rfq.state"
import { symbolBind } from "../Tile.context"
import {
  MovementIconDown,
  MovementIconUP,
  MovementValue,
  PriceMovementStyle,
} from "./PriceMovement.styles"

const [usePriceMovementData, priceMovement$] = symbolBind((symbol: string) =>
  getPrice$(symbol).pipe(
    map(({ spread, movementType, symbol }) => {
      return { spread, movementType, symbol }
    }),
    distinctUntilChanged(equals),
  ),
)
export { priceMovement$ }

const MovementTypography = ({ children }: PropsWithChildren) => (
  <MovementValue>
    <Typography
      variant="Text sm/Regular"
      color="Colors/Text/text-tertiary (600)"
    >
      {children}
    </Typography>
  </MovementValue>
)

export const PriceFromQuoteInner = ({
  isAnalytics,
  spread,
}: {
  isAnalytics: boolean
  spread: string
}) => (
  <PriceMovementStyle isAnalyticsView={isAnalytics}>
    <MovementTypography>{spread}</MovementTypography>
  </PriceMovementStyle>
)

export const PriceMovementInner = ({
  spread,
  movementType,
  isAnalyticsView,
}: {
  spread: string
  movementType?: PriceMovementType
  isAnalyticsView?: boolean
}) => (
  <PriceMovementStyle isAnalyticsView={isAnalyticsView}>
    <Line height={isAnalyticsView ? "3xl" : "lg"} />
    <MovementIconUP
      $show={movementType === PriceMovementType.UP}
      aria-hidden="true"
    />
    <MovementTypography>{spread}</MovementTypography>
    <MovementIconDown
      $show={movementType === PriceMovementType.DOWN}
      aria-hidden="true"
    />
    <Line height={isAnalyticsView ? "3xl" : "lg"} />
  </PriceMovementStyle>
)

export const PriceMovement = ({
  isAnalyticsView,
}: {
  isAnalyticsView: boolean
}) => {
  const payload = useRfqPayload()
  const { spread, movementType } = usePriceMovementData()

  return (
    <PriceMovementInner
      isAnalyticsView={isAnalyticsView}
      spread={payload?.rfqResponse.price.spread || spread}
      movementType={payload ? PriceMovementType.NONE : movementType}
    />
  )
}
