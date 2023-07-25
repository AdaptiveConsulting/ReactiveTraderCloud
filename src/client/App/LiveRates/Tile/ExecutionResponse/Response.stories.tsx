import { Meta } from "@storybook/react"
import { ExecutionStatus } from "services/executions"
import styled from "styled-components"

import { TileStates } from "../Tile.state"
import { StatelessExecutionResponse } from "./Response"

const mockTrade = {
  id: "1111111111",
  tradeId: 1111111111,
  traderName: "LMO",
  currencyPair: "GBPUSD",
  notional: 1_000_000,
  dealtCurrency: "GBP",
  direction: "Buy",
  spotRate: 1.36665,
  tradeDate: new Date(),
  valueDate: new Date(),
  status: ExecutionStatus.Done,
}

const TileContainer = styled.div`
  width: 360px;
  height: 180px;
  position: relative;
`

export default {
  title: "LiveRates/ExecutionResponse",
  component: StatelessExecutionResponse,
  args: {
    currencyPair: {
      symbol: "EURUSD",
      ratePrecision: 5,
      pipsPosition: 4,
      base: "EUR",
      terms: "USD",
      defaultNotional: 1000000,
    },
  },
  decorators: [
    (Story) => (
      <TileContainer>
        <Story />
      </TileContainer>
    ),
  ],
} as Meta<typeof StatelessExecutionResponse>

export const Pending = {
  args: {
    tileState: {
      status: TileStates.Started,
    },
  },
}

export const Executed = {
  args: {
    tileState: {
      status: TileStates.Finished,
      trade: mockTrade,
    },
  },
}

export const TooLong = {
  args: {
    tileState: {
      status: TileStates.TooLong,
    },
  },
}

export const Timeout = {
  args: {
    tileState: {
      status: TileStates.Timeout,
    },
  },
}

export const Rejected = {
  args: {
    tileState: {
      status: TileStates.Finished,
      trade: {
        ...mockTrade,
        status: ExecutionStatus.Rejected,
      },
    },
  },
}

export const CreditExceeded = {
  args: {
    tileState: {
      status: TileStates.CreditExceeded,
    },
  },
}
