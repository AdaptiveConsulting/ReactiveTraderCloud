import styled from "styled-components"

import { TileContext } from "@/client/App/LiveRates/Tile/Tile.context"
import { TileStates } from "@/client/App/LiveRates/Tile/Tile.state"
import { Box } from "@/client/components/Box"
import { Typography } from "@/client/components/Typography"
import { Direction } from "@/generated/TradingGateway"
import { ExecutionStatus, ExecutionTrade } from "@/services/executions"
import { PriceMovementType } from "@/services/prices"

import { H3 } from "../elements"
import { PATH } from "../path"
import { Separator } from "../sections/components"
import { Tile, TileProps } from "./Tile"

const Grid = styled(Box)`
  display: grid;
  grid-template-columns: 120px 270px 270px;
  grid-column-gap: 43px;
  grid-row-gap: 24px;
`
const Cell = styled.div`
  display: grid;
  grid-row-gap: 9px;
`
const FxSpot = styled.div`
  grid-row: 1 / span 4;
`
const FxRfq = styled.div`
  grid-row: 6 / span 7;
`
const GridSeparator = styled(Separator)`
  grid-column: 1 / -1;
  margin: ${({ theme }) => theme.spacing.lg} 0;
`

const currencyPair = {
  symbol: "EURUSD",
  ratePrecision: 5,
  pipsPosition: 4,
  base: "EUR",
  terms: "USD",
  defaultNotional: 1000000,
}

const BASE_FX_SPOT_PROPS = {
  currencyPair,
  isAnalytics: false,
  notional: "1,000,000",
  priceMovement: "0.8",
  priceMovementType: PriceMovementType.DOWN,
  sellPrice: 1.36269,
  buyPrice: 1.36279,
  tileState: { status: TileStates.Ready },
} as TileProps

interface TileCellProps {
  title: string
  props: TileProps
}

const FX_SPOT: TileCellProps[] = [
  {
    title: "Normal",
    props: BASE_FX_SPOT_PROPS,
  },
  {
    title: "Hover",
    props: {
      ...BASE_FX_SPOT_PROPS,
      hover: true,
    },
  },
  {
    title: "Price Unavailable",
    props: {
      ...BASE_FX_SPOT_PROPS,
      priceMovement: "--",
      priceMovementType: undefined,
      sellPrice: undefined,
      buyPrice: undefined,
      disabledNotional: true,
    },
  },
  {
    title: "Executing",
    props: {
      ...BASE_FX_SPOT_PROPS,
      tileState: { status: TileStates.Started },
      disabledNotional: true,
      priceDisabled: true,
    },
  },
  {
    title: "Success",
    props: {
      ...BASE_FX_SPOT_PROPS,
      tileState: {
        status: TileStates.Finished,
        trade: {
          direction: Direction.Buy,
          notional: 200000,
          spotRate: 1000,
          valueDate: new Date(Date.now()),
          tradeId: 12345,
          status: ExecutionStatus.Done,
        } as ExecutionTrade,
      },
    },
  },
  {
    title: "Failure",
    props: {
      ...BASE_FX_SPOT_PROPS,
      tileState: {
        status: TileStates.Finished,
        trade: {
          direction: Direction.Buy,
          notional: 200000,
          spotRate: 1000,
          valueDate: new Date(Date.now()),
          tradeId: 12345,
          status: ExecutionStatus.Rejected,
        } as ExecutionTrade,
      },
    },
  },
  {
    title: "Warning",
    props: {
      ...BASE_FX_SPOT_PROPS,
      tileState: {
        status: TileStates.TooLong,
      },
    },
  },
]

const BASE_FX_RFQ_PROPS = {
  currencyPair: currencyPair,
  isAnalytics: false,
  notional: "1,000,000",
  priceMovement: "0.8",
  priceMovementType: PriceMovementType.DOWN,
  tileState: { status: TileStates.Ready },
  sellPrice: 1.36269,
  buyPrice: 1.36279,
  isRfq: true,
} as TileProps

const NOW = new Date().getTime()

const FX_RFQ: TileCellProps[] = [
  {
    title: "Begin Price Request",
    props: {
      ...BASE_FX_RFQ_PROPS,
      rfqTextWrap: true,
      rfqButtonText: "Initiate RFQ",
    },
  },
  {
    title: "Awaiting Price",
    props: {
      ...BASE_FX_RFQ_PROPS,
      rfqTextWrap: true,
      rfqButtonText: "Cancel RFQ",
      disabledNotional: true,
    },
  },
  {
    title: "Price Announced",
    props: {
      ...BASE_FX_RFQ_PROPS,
      timerData: {
        start: NOW,
        end: NOW + 60,
      },
      staticProgressWidth: 100,
      priceButtonStatic: true,
    },
  },
  {
    title: "Priced",
    props: {
      ...BASE_FX_RFQ_PROPS,
      disabledNotional: true,
      timerData: {
        start: NOW,
        end: NOW + 49,
      },
      staticProgressWidth: 80,
    },
  },
  {
    title: "Priced Hover",
    props: {
      ...BASE_FX_RFQ_PROPS,
      disabledNotional: true,
      timerData: {
        start: NOW,
        end: NOW + 49,
      },
      staticProgressWidth: 80,
      hover: true,
    },
  },
  {
    title: "Price Expired",
    props: {
      ...BASE_FX_RFQ_PROPS,
      canResetNotional: true,
      rfqButtonText: "Requote",
      isExpired: true,
      priceDisabled: true,
    },
  },
]

const TileCell = ({
  item,
  isAnalytics,
  graphPath,
}: {
  item: TileCellProps
  isAnalytics?: boolean
  graphPath?: string
}) => (
  <Cell>
    <Typography variant="Text lg/Regular" marginBottom="sm">
      {item.title}
    </Typography>
    <TileContext.Provider
      value={{
        currencyPair,
        isTornOut: false,
        supportsTearOut: false,
        showingChart: !!isAnalytics,
      }}
    >
      <Tile {...item.props} graphPath={graphPath} />
    </TileContext.Provider>
  </Cell>
)

const SpotTilesGrid = () => (
  <>
    <H3>Trading Tiles - Horizontal</H3>
    <Grid paddingTop="xl">
      <FxSpot>FX Spot</FxSpot>
      {FX_SPOT.map((item, i) => (
        <TileCell item={item} key={i} />
      ))}
      <GridSeparator />
      <FxRfq>FX RFQ</FxRfq>
      {FX_RFQ.map((item, i) => (
        <TileCell item={item} key={i} />
      ))}
    </Grid>
    <GridSeparator />
    <H3>Trading Tiles - Vertical</H3>
    <Grid paddingTop="xl">
      <FxSpot>FX Spot</FxSpot>
      {FX_SPOT.map((item, i) => (
        <TileCell item={item} key={i} isAnalytics graphPath={PATH} />
      ))}
      <GridSeparator />
      <FxRfq>FX RFQ</FxRfq>
      {FX_RFQ.map((item, i) => (
        <TileCell item={item} key={i} isAnalytics graphPath={PATH} />
      ))}
    </Grid>
  </>
)

export default SpotTilesGrid
