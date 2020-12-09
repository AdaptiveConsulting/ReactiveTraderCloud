import styled from 'styled-components/macro'
import { Subscribe } from '@react-rxjs/core'
import { ExcelButton } from './ExcelButton'
import { AppliedFilters } from './AppliedFilters'
import { QuickFilter } from './QuickFilter'
import { gridApi$ } from '../BlotterGrid'

const BlotterHeaderStyle = styled('div')`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 0.5rem;
  height: 2.5rem;
  background-color: ${({ theme }) => theme.core.darkBackground};
`
const BlotterRight = styled('div')`
  display: flex;
  align-items: center;
`

const BlotterLeft = styled('div')`
  font-size: 0.9375rem;
`

const Fill = styled.div`
  width: 1rem;
  height: 1rem;
`

const BlotterToolbarStyle = styled('div')`
  display: flex;
  align-items: center;
  justifyContent: flex-end;
`

export const BlotterHeader: React.FC = () => (
  <BlotterHeaderStyle>
    <BlotterLeft>Trades</BlotterLeft>
    <Subscribe source$={gridApi$}>
      <BlotterRight>
        <ExcelButton />
        <BlotterToolbarStyle>
          <AppliedFilters />
          <QuickFilter />
        </BlotterToolbarStyle>
        <Fill />
      </BlotterRight>
    </Subscribe>
  </BlotterHeaderStyle>
)
