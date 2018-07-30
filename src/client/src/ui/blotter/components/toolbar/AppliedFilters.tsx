import { ColDef } from 'ag-grid'
import React from 'react'
import { styled } from 'rt-util'

interface AppliedFiltersProps {
  filterModel: any
  columnDefinitions: ColDef[]
  removeAllFilters: () => void
  removeFilter: (key: string) => void
}

const FilterField = styled('div')`
  font-size: 10px;
  text-transform: uppercase;
  background-color: ${({ theme: { palette } }) => palette.backgroundSecondary};
  border: 1px solid ${({ theme: { palette } }) => palette.textPrimary};
  margin-left: 8px;
  padding: 2px;

  & i {
    padding-left: 4px;
    cursor: pointer;
  }

  &:hover {
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
  }
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
            {colDef.headerName}
            <i className="fa fa-times" onClick={() => this.props.removeFilter(colDef.field || '')} />
          </FilterField>
        )
      })
    }
    return []
  }
}
