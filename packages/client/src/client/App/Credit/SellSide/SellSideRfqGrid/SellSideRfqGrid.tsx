import styled from "styled-components"

import { Region } from "@/client/components/layout/Region"
import { Loader } from "@/client/components/Loader"
import Logo from "@/client/components/logos/AdaptiveLogo"
import { Stack } from "@/client/components/Stack"
import { TabBar } from "@/client/components/TabBar"
import { Typography } from "@/client/components/Typography"
import { Direction } from "@/generated/TradingGateway"

import {
  SELLSIDE_RFQS_TABS,
  SellSideQuoteState,
  setQuotesFilter,
  useSellSideQuotesFilter,
} from "../sellSideState"
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

const Banner = styled(Stack)`
  background-color: ${({ theme }) =>
    theme.color["Colors/Background/bg-secondary"]};
  height: 24px;
`

export const SellSideRfqGrid = () => {
  const rfqState = useSellSideQuotesFilter()
  const items = SELLSIDE_RFQS_TABS.map((rfqStateOption) => rfqStateOption)
  return (
    <Region
      fallback={<Loader ariaLabel="Loading RFQ queue.." />}
      Header={
        <>
          <Banner padding="md" gap="md">
            <Logo withText={false} size={1} />
            <Typography
              variant="Text sm/Regular"
              color="Colors/Text/text-primary (900)"
            >
              RT Credit - Sell Side
            </Typography>
          </Banner>
          <TabBar
            items={items}
            handleItemOnClick={(item) => setQuotesFilter(item)}
            activeItem={rfqState}
            doNotShowDropdown
          />
        </>
      }
      Body={
        <RfqGridInner caption="Reactive Trader Sell-Side RFQ Queue Table" />
      }
    />
  )
}
