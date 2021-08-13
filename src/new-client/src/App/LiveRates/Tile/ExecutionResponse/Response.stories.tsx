import React from "react"
import { storiesOf } from "@storybook/react"
import Story from "@/stories/Story"
import { StatelessExecutionResponse } from "@/App/LiveRates/Tile/ExecutionResponse/Response"
import { TileStates } from "@/App/LiveRates/Tile/Tile.state"
import { CurrencyPair } from "@/services/currencyPairs"
import { Direction } from "@/services/trades"
import { ExecutionStatus } from "@/services/executions"

const stories = storiesOf("Trade Notification", module)

const mockStyle = {
  height: "200px",
  width: "400px",
  marginLeft: "60%",
  marginTop: "10%",
}

const mockCurrencyPair: CurrencyPair = {
  symbol: "EURUSD",
  ratePrecision: 5,
  pipsPosition: 4,
  base: "EUR",
  terms: "USD",
  defaultNotional: 1000000,
}

const mockTrade = {
  currencyPair: "NZDUSD",
  dealtCurrency: "NZD",
  direction: Direction.Buy,
  notional: 10000000,
  spotRate: 0.67466,
  tradeId: 42,
  valueDate: "2021-05-07T03:48:08.5368797+00:00",
  id: "5",
}

stories.add("Executed", () => (
  <Story>
    <div style={mockStyle}>
      <StatelessExecutionResponse
        currencyPair={mockCurrencyPair}
        tileState={{
          status: TileStates.Finished,
          trade: { ...mockTrade, status: ExecutionStatus.Done },
        }}
      />
    </div>
  </Story>
))

stories.add("Rejected", () => (
  <Story>
    <div style={mockStyle}>
      <StatelessExecutionResponse
        currencyPair={mockCurrencyPair}
        tileState={{
          status: TileStates.Finished,
          trade: { ...mockTrade, status: ExecutionStatus.Rejected },
        }}
      />
    </div>
  </Story>
))

stories.add("Warning: Execution Longer", () => (
  <Story>
    <div style={mockStyle}>
      <StatelessExecutionResponse
        currencyPair={mockCurrencyPair}
        tileState={{ status: TileStates.TooLong }}
      />
    </div>
  </Story>
))

stories.add("Warning: Timeout", () => (
  <Story>
    <div style={mockStyle}>
      <StatelessExecutionResponse
        currencyPair={mockCurrencyPair}
        tileState={{ status: TileStates.Timeout }}
      />
    </div>
  </Story>
))
