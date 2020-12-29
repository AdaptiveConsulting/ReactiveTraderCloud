import styled from "styled-components/macro"
import { ExcelButton } from "./ExcelButton"
import { AppliedFilters } from "./AppliedFilters"
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

export const TradesHeader: React.FC = () => (
  <TradesHeaderStyle>
    <HeaderLeftGroup>Trades</HeaderLeftGroup>
    <HeaderRightGroup>
      <ExcelButton />
      <HeaderToolbar>
        <AppliedFilters />
        <QuickFilter />
      </HeaderToolbar>
      <Fill />
    </HeaderRightGroup>
  </TradesHeaderStyle>
)
