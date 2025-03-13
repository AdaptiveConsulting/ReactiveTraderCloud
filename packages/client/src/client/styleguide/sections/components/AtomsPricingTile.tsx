import {
  PriceButtonInner,
  PriceButtonProps,
} from "@/client/App/LiveRates/Tile/PriceButton"
import { Direction } from "@/generated/TradingGateway"

import { PricingTileStates } from "../atomStates"

const values: PriceButtonProps = {
  currencyPair: {
    symbol: "EURUSD",
    ratePrecision: 5,
    pipsPosition: 4,
    base: "EUR",
    terms: "USD",
    defaultNotional: 1000000,
  },
  direction: Direction.Buy,
  disabled: false,
  isExpired: false,
  onClick: () => null,
  price: 0.45123,
  priceAnnounced: false,
}

interface Props {
  state: PricingTileStates
  direction: Direction
}

export const AtomsPricingTile = ({ state, direction }: Props) => {
  let priceAnnounced: boolean = false
  let disabled: boolean = false
  let isExpired: boolean = false

  switch (state) {
    case PricingTileStates.Priced:
      break

    case PricingTileStates.Announced:
      priceAnnounced = true
      break

    case PricingTileStates.Disabled:
    case PricingTileStates.Executing:
      disabled = true
      break

    case PricingTileStates.Expired:
      disabled = true
      isExpired = true
  }

  return (
    <PriceButtonInner
      {...values}
      priceAnnounced={priceAnnounced}
      direction={direction}
      isExpired={isExpired}
      disabled={disabled}
    />
  )
}
