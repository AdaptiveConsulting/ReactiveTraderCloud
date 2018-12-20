import { ColDef } from 'ag-grid'
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

export default class AppliedFilters extends React.Component<AppliedFiltersProps, any> {
  render() {
    return <React.Fragment>{this.getAppliedFilters()}</React.Fragment>
  }

  private getAppliedFilters() {
    if (this.props.filterModel && this.props.columnDefinitions) {
      const filteredColDefs = this.props.columnDefinitions.filter((colDef: any) => {
        return this.props.filterModel.hasOwnProperty(colDef.field)
      })
      return filteredColDefs.map(colDef => {
        return (
          <FilterField key={colDef.field}>
            <FilterName>{colDef.headerName}</FilterName>
            <FilterButton>
              <FilterIcon className="fas fa-times" onClick={() => this.props.removeFilter(colDef.field || '')} />
            </FilterButton>
          </FilterField>
        )
      })
    }
    return []
  }
}
