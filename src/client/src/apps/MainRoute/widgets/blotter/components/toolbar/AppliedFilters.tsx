import { ColDef } from 'ag-grid-community'
import React from 'react'
import { styled } from 'rt-theme'

interface AppliedFiltersProps {
  filterModel: any
  columnDefinitions: ColDef[]
  removeAllFilters: () => void
  removeFilter: (key: string) => void
}

const FilterButton = styled('button')`
  opacity: 0.59;
`

const FilterField = styled('div')`
  display: flex;
  align-items: center;
  font-size: 0.6875rem;
  text-transform: uppercase;
  background-color: ${({ theme }) => theme.core.lightBackground};
  margin-left: 0.5rem;
  border-radius: 0.25rem;
  height: 1.25rem;
  padding: 0 0.375rem;
  cursor: default;

  &:hover {
    background-color: ${({ theme }) => theme.core.alternateBackground};
    ${FilterButton} {
      opacity: 1;
    }
  }
`

const FilterName = styled('div')`
  padding-right: 0.625rem;
`

const FilterIcon = styled('i')`
  line-height: 1rem;
`

const AppliedFilters: React.FC<AppliedFiltersProps> = ({
  filterModel,
  columnDefinitions,
  removeFilter,
}) => {
  const getAppliedFilters = () => {
    if (filterModel && columnDefinitions) {
      const filteredColDefs = columnDefinitions.filter((colDef: any) => {
        return filterModel.hasOwnProperty(colDef.field)
      })
      return filteredColDefs.map(colDef => {
        return (
          <FilterField key={colDef.field}>
            <FilterName>{colDef.headerName}</FilterName>
            <FilterButton>
              <FilterIcon
                className="fas fa-times"
                onClick={() => removeFilter(colDef.field || '')}
                data-qa="applied-filters___remove-filter-button"
              />
            </FilterButton>
          </FilterField>
        )
      })
    }
    return []
  }

  return <React.Fragment>{getAppliedFilters()}</React.Fragment>
}

export default AppliedFilters
