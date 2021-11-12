import styled from "styled-components"
import { ExcelButton } from "./ExcelButton"
import { AppliedFilters } from "./AppliedFilters"
import { QuickFilter } from "./QuickFilter"

import { PopOutIcon } from "@/components/icons/PopOutIcon"

import { tearOutSection } from "@/Web/TearOutSection/state"

import { constructUrl } from "@/utils/url"
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
  return (
    <TradesHeaderStyle>
      <HeaderLeftGroup>Trades</HeaderLeftGroup>
      <HeaderRightGroup>
        <ExcelButton />
        <HeaderToolbar>
          <AppliedFilters />
          <QuickFilter />
        </HeaderToolbar>
        {!isTornOut && (
          <HeaderAction
            onClick={() => {
              tearOutSection(true, "trades")
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
