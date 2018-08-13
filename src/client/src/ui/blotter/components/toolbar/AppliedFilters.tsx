import { ColDef } from 'ag-grid'
import React from 'react'
import { styled } from 'rt-util'

interface AppliedFiltersProps {
  filterModel: any
  columnDefinitions: ColDef[]
  removeAllFilters: () => void
  removeFilter: (key: string) => void
}

//TODO: Colors based on new theme format
const FilterField = styled('div')`
  display: flex;
  align-items: center;
  font-size: 0.6875rem;
  text-transform: uppercase;
  background-color: ${({ theme: { background } }) => background.backgroundSecondary};
  margin-left: 0.5rem;
  border-radius: 0.25rem;
  height: 20px;
  padding: 0 0.375rem;
  cursor: default;

  &:hover {
    background-color: ${({ theme: { background } }) => background.backgroundTertiary};
    i {
      color: ${({ theme: { text } }) => text.textPrimary};
    }
  }
`

const FilterName = styled('div')`
  padding-right: 0.625rem;
`

const FilterIcon = styled('i')`
  line-height: 1rem;
  font-size: 0.6875rem;
  height: 0.75rem;
  width: 0.6875rem;
  color: ${({ theme: { text } }) => text.textSecondary};
  cursor: pointer;
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
            <FilterIcon className="fas fa-times" onClick={() => this.props.removeFilter(colDef.field || '')} />
          </FilterField>
        )
      })
    }
    return []
  }
}
