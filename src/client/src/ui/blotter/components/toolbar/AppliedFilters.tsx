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
  display: flex;
  align-items: center;
  font-size: 10px;
  text-transform: uppercase;
  background-color: #abb2b9;
  margin-left: 8px;
  border-radius: 3px;
  overflow: hidden;

  &:hover {
    background-color: #808b96;

    i {
      background-color: #21618c;
    }
  }
`

const FilterName = styled('div')`
  padding: 0px 8px;
`

const FilterIcon = styled('i')`
  padding: 4px;
  background-color: #aeb6bf;
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
            <FilterIcon className="fa fa-times" onClick={() => this.props.removeFilter(colDef.field || '')} />
          </FilterField>
        )
      })
    }
    return []
  }
}
