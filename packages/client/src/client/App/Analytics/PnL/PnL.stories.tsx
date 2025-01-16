import { Meta } from "@storybook/react"
import styled from "styled-components"

import { PnLInner } from "./PnL"
import { PNLBarProps } from "./PNLBar"

export default {
  title: "Analytics/PnL",
  component: PnLInner,
} as Meta<typeof PnLInner>

const data: (PNLBarProps & { key: string })[] = [
  {
    key: "NZDUSD",
    symbol: "NZDUSD",
    profitOrLossValue: -849.4217864553628,
    largetProfitOrLossValue: 1785.9428620191757,
  },
  {
    key: "USDJPY",
    symbol: "USDJPY",
    profitOrLossValue: -782.8171632662416,
    largetProfitOrLossValue: 1785.9428620191757,
  },
  {
    key: "GBPJPY",
    symbol: "GBPJPY",
    profitOrLossValue: 0,
    largetProfitOrLossValue: 1785.9428620191757,
  },
  {
    key: "EURJPY",
    symbol: "EURJPY",
    profitOrLossValue: 165.24650467711035,
    largetProfitOrLossValue: 1785.9428620191757,
  },
  {
    key: "EURCAD",
    symbol: "EURCAD",
    profitOrLossValue: 0,
    largetProfitOrLossValue: 1785.9428620191757,
  },
  {
    key: "EURUSD",
    symbol: "EURUSD",
    profitOrLossValue: 0,
    largetProfitOrLossValue: 1785.9428620191757,
  },
  {
    key: "EURAUD",
    symbol: "EURAUD",
    profitOrLossValue: 0,
    largetProfitOrLossValue: 1785.9428620191757,
  },
  {
    key: "GBPUSD",
    symbol: "GBPUSD",
    profitOrLossValue: -1785.9428620191757,
    largetProfitOrLossValue: 1785.9428620191757,
  },
  {
    key: "AUDUSD",
    symbol: "AUDUSD",
    profitOrLossValue: 0,
    largetProfitOrLossValue: 1785.9428620191757,
  },
]

const Container = styled.div`
  width: 320px;
`

export const PnL = {
  render: () => (
    <Container>
      <PnLInner data={data} />
    </Container>
  ),

  name: "PnL",
}
