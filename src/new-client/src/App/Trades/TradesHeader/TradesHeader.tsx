import styled from "styled-components"
import { ExcelButton } from "./ExcelButton"
import { AppliedFilters } from "./AppliedFilters"
import { QuickFilter } from "./QuickFilter"

import { PopOutIcon } from "@/components/icons/PopOutIcon"
import { tearOutTrades, tearOutEntryTrades$ } from "@/Web/tearoutSections"
import { useObservableSubscription } from "@/utils/useObservableSubscription"
import { openWindow } from "@/Web/utils/window"
import { constructUrl } from "@/utils/url"
import {
  useTearOutTileState,
  useTearOutAnalyticsState,
} from "@/Web/tearoutSections"
export const HeaderAction = styled.button`
  &:hover {
    .tear-out-hover-state {
      fill: #5f94f5;
    }
  }
`

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
  const tearOutTileState = useTearOutTileState("Tiles")
  const tearOutAnalyticsState = useTearOutAnalyticsState("Analytics")
  useObservableSubscription(
    tearOutEntryTrades$.subscribe(async ([tornOut]) => {
      if (tornOut && !isTornOut) {
        isTornOut = true
        openWindow(
          {
            url: constructUrl("/trades"),
            width: window.innerWidth * 0.85,
            name: "",
            height: window.innerHeight * 0.25,
          },
          () => {
            isTornOut = false
            tearOutTrades(false)
          },
        )
      }
    }),
  )
  return (
    <TradesHeaderStyle>
      <HeaderLeftGroup>Trades</HeaderLeftGroup>
      <HeaderRightGroup>
        <ExcelButton />
        <HeaderToolbar>
          <AppliedFilters />
          <QuickFilter />
        </HeaderToolbar>
        {!isTornOut && !(tearOutTileState && tearOutAnalyticsState) && (
          <HeaderAction
            onClick={() => {
              tearOutTrades(true)
            }}
          >
            <PopOutIcon />
          </HeaderAction>
        )}
        <Fill />
      </HeaderRightGroup>
    </TradesHeaderStyle>
  )
}
