import { Section } from "@/App/TearOutSection/state"
import { supportsTearOut } from "@/App/TearOutSection/supportsTearOut"
import { TearOutComponent } from "@/App/TearOutSection/TearOutComponent"
import styled from "styled-components"
import { AppliedFilters } from "./AppliedFilters"
import { ExcelButton } from "./ExcelButton"
import { QuickFilter } from "./QuickFilter"

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
export const TradesHeader: React.FC<{ section: Section }> = ({ section }) => {
  return (
    <TradesHeaderStyle>
      <HeaderLeftGroup>Trades</HeaderLeftGroup>
      <HeaderRightGroup>
        <ExcelButton />
        <HeaderToolbar>
          <AppliedFilters />
          <QuickFilter />
        </HeaderToolbar>
        {supportsTearOut && <TearOutComponent section={section} />}
        <Fill />
      </HeaderRightGroup>
    </TradesHeaderStyle>
  )
}
