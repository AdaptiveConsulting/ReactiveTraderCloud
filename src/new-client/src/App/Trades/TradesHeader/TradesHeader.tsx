import styled from "styled-components"
import { ExcelButton } from "./ExcelButton"
import { AppliedFilters } from "./AppliedFilters"
import { QuickFilter } from "./QuickFilter"

import { PopOutIcon } from "@/components/icons/PopOutIcon"

import { tearOutSection } from "@/Web/TearOutSection/state"
import { supportsTearOut } from "@/Web/TearOutSection/supportsTearOut"
import { PopInIcon } from "@/components/icons/PopInIcon"
import { useTearOutSectionState$ } from "@/Web/TearOutSection/state"
import { HeaderAction } from "@/components/styled"
import { useEffect } from "react"

const TradesHeaderStyle = styled("div")`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 0.5rem;
  height: 2.5rem;
  background-color: ${({ theme }) => theme.core.darkBackground};
`
const HeaderRightGroup = styled("div")`
  display: flex;
  align-items: center;
`

const HeaderLeftGroup = styled("div")`
  font-size: 0.9375rem;
`

const Fill = styled.div`
  width: 1rem;
  height: 1rem;
`

const HeaderToolbar = styled("div")`
  display: flex;
  align-items: center;
  justify-content: flex-end;
`
var isTornOut = false
export const TradesHeader: React.FC = () => {
  const tearOutTileState = useTearOutSectionState$("liverates")
  const tearOutAnalyticsState = useTearOutSectionState$("analytics")
  const tearOutTradeState = useTearOutSectionState$("trades")

  useEffect(() => {
    console.log("trade tearout in mainroute", tearOutTradeState)
  }, [tearOutTradeState])

  return (
    <TradesHeaderStyle>
      <HeaderLeftGroup>Trades</HeaderLeftGroup>
      <HeaderRightGroup>
        <ExcelButton />
        <HeaderToolbar>
          <AppliedFilters />
          <QuickFilter />
        </HeaderToolbar>
        {supportsTearOut && !isTornOut && (
          <HeaderAction
            onClick={() => {
              tearOutSection(true, "trades")
            }}
          >
            {isTornOut ? <PopInIcon /> : <PopOutIcon />}
          </HeaderAction>
        )}
        <Fill />
      </HeaderRightGroup>
    </TradesHeaderStyle>
  )
}
