import { ComponentMeta } from "@storybook/react"
import styled from "styled-components"
import { PnLInner } from "./PnL"

export default {
  title: "Analytics/PnL",
  component: PnLInner,
} as ComponentMeta<typeof PnLInner>

const data = [
  {
    key: "NZDUSD",
    symbol: "NZDUSD",
    basePnl: -849.4217864553628,
    maxVal: 1785.9428620191757,
  },
  {
    key: "USDJPY",
    symbol: "USDJPY",
    basePnl: -782.8171632662416,
    maxVal: 1785.9428620191757,
  },
  {
    key: "GBPJPY",
    symbol: "GBPJPY",
    basePnl: 0,
    maxVal: 1785.9428620191757,
  },
  {
    key: "EURJPY",
    symbol: "EURJPY",
    basePnl: 165.24650467711035,
    maxVal: 1785.9428620191757,
  },
  {
    key: "EURCAD",
    symbol: "EURCAD",
    basePnl: 0,
    maxVal: 1785.9428620191757,
  },
  {
    key: "EURUSD",
    symbol: "EURUSD",
    basePnl: 0,
    maxVal: 1785.9428620191757,
  },
  {
    key: "EURAUD",
    symbol: "EURAUD",
    basePnl: 0,
    maxVal: 1785.9428620191757,
  },
  {
    key: "GBPUSD",
    symbol: "GBPUSD",
    basePnl: -1785.9428620191757,
    maxVal: 1785.9428620191757,
  },
  {
    key: "AUDUSD",
    symbol: "AUDUSD",
    basePnl: 0,
    maxVal: 1785.9428620191757,
  },
]

const Container = styled.div`
  width: 320px;
`

export const PnL = () => (
  <Container>
    <PnLInner data={data} />
  </Container>
)
PnL.storyName = "PnL"
