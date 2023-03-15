import { Subscribe } from "@react-rxjs/core"
import styled from "styled-components"

import { Loader } from "@/components/Loader"
import Logo from "@/components/Logo"
import { Direction } from "@/generated/TradingGateway"

import { SellSideQuoteState } from "../sellSideState"
import { SellSideGridHeader } from "./SellSideGridHeader"
import { RfqGridInner } from "./SellSideRfqGridInner"

export interface RfqRow {
  id: number
  status: SellSideQuoteState
  direction: Direction
  cpy: string
  security: string
  quantity: number
  price: number
  timer: number | undefined
}

export type RfqRowKey = keyof RfqRow

const SellSideGridWrapper = styled.div`
  min-height: 100px;
`

const GridStyle = styled.div`
  height: 100%;
  width: 100%;
  color: ${({ theme }) => theme.core.textColor};
  font-size: 0.8125rem;
`
const Banner = styled.div`
  display: flex;
  align-items: center;
  padding: 8px;
  gap: 8px;
  background-color: ${({ theme }) => theme.core.darkBackground};
  color: ${({ theme }) => theme.textColor};
  font-size: 11px;
  line-height: 16px;
  font-weight: 500;
  height: 24px;
`

export const SellSideRfqGrid = () => {
  return (
    <Subscribe fallback={<Loader ariaLabel="Loading RFQ queue.." />}>
      <SellSideGridWrapper>
        <Banner>
          <Logo withText={false} size={1} /> RT Credit - Sell Side
        </Banner>
        <SellSideGridHeader />
        <GridStyle role="region" aria-labelledby="rfq-quote-table-heading">
          <RfqGridInner caption="Reactive Trader Sell-Side RFQ Queue Table" />
        </GridStyle>
      </SellSideGridWrapper>
    </Subscribe>
  )
}

export default SellSideRfqGrid
