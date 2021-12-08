import { ExecutionStatus } from "@/services/executions"
import { ComponentStory, ComponentMeta } from "@storybook/react"
import styled from "styled-components"
import { TileStates } from "../Tile.state"
import { StatelessExecutionResponse } from "./Response"

const mockTrade = {
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
} as ComponentMeta<typeof StatelessExecutionResponse>

const TileContainer = styled.div`
  width: 360px;
  height: 180px;
  position: relative;
`

const Template: ComponentStory<typeof StatelessExecutionResponse> = (args) => (
  <TileContainer>
    <StatelessExecutionResponse {...args} />
  </TileContainer>
)

export const Pending = Template.bind({})
Pending.args = {
  tileState: {
    status: TileStates.Started,
  } as any,
}

export const Executed = Template.bind({})
Executed.args = {
  tileState: {
    status: TileStates.Finished,
    trade: mockTrade,
  } as any,
}

export const TooLong = Template.bind({})
TooLong.args = {
  tileState: {
    status: TileStates.TooLong,
  },
}

export const Timeout = Template.bind({})
Timeout.args = {
  tileState: {
    status: TileStates.Timeout,
  },
}

export const Rejected = Template.bind({})
Rejected.args = {
  tileState: {
    status: TileStates.Finished,
    trade: {
      ...mockTrade,
      status: ExecutionStatus.Rejected,
    },
  } as any,
}

export const CreditExceeded = Template.bind({})
CreditExceeded.args = {
  tileState: {
    status: TileStates.CreditExceeded,
  },
}
