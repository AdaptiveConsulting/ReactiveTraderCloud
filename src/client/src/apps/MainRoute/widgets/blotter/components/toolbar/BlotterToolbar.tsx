import { ColDef } from 'ag-grid-community'
import React from 'react'
import { flexStyle } from 'rt-components'
import { styled } from 'rt-theme'
import AppliedFilters from './AppliedFilters'
import QuickFilter from './QuickFilter'

interface BlotterToolbarProps {
  isQuickFilterApplied: boolean
  removeQuickFilter: () => void
  quickFilterChangeHandler: (event: React.FormEvent<any>) => void
  filterModel: any
  columnDefinitions: ColDef[]
  removeAllFilters: () => void
  removeFilter: (key: string) => void
}

const BlotterToolbarStyle = styled('div')`
  ${flexStyle({ alignItems: 'center', justifyContent: 'flex-end' })};
`

const BlotterToolbar: React.FC<BlotterToolbarProps> = ({
  filterModel,
  columnDefinitions,
  removeAllFilters,
  removeFilter,
  isQuickFilterApplied,
  removeQuickFilter,
  quickFilterChangeHandler,
}) => {
  return (
    <BlotterToolbarStyle>
      <AppliedFilters
        filterModel={filterModel}
        columnDefinitions={columnDefinitions}
        removeAllFilters={removeAllFilters}
        removeFilter={removeFilter}
      />
      <QuickFilter
        isFilterApplied={isQuickFilterApplied}
        removeQuickFilter={removeQuickFilter}
        quickFilterChangeHandler={quickFilterChangeHandler}
      />
    </BlotterToolbarStyle>
  )
}

export default BlotterToolbar
