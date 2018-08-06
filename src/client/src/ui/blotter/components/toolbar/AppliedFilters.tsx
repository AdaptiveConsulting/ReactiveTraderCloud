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
  font-size: 11px;
  text-transform: uppercase;
  background-color: ${({ theme: { background } }) => background.backgroundSecondary};
  margin-left: 8px;
  border-radius: 3px;
  height: 20px;
  padding: 0px 6px;
  cursor: default;

  &:hover {
    background-color: ${({ theme: { text } }) => text.textMeta};
  }
`

const FilterName = styled('div')`
  padding-right: 10px;
`

const FilterIcon = styled('i')`
  height: 12px;
  width: 11px;
  color: ${({ theme: { text } }) => text.textPrimary};
  cursor: pointer;

  &:hover {
    color: ${({ theme: { text } }) => text.textSecondary};
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
            <FilterName>{colDef.headerName}</FilterName>
            <FilterIcon className="fa fa-times" onClick={() => this.props.removeFilter(colDef.field || '')} />
          </FilterField>
        )
      })
    }
    return []
  }
}
