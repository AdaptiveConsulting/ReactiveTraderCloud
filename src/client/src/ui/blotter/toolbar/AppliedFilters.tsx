import * as AgGrid from 'ag-grid'
import * as React from 'react'

interface AppliedFiltersProps {
  filterModel: any
  columnDefinitions: AgGrid.ColDef[]
  removeAllFilters: () => void
  removeFilter: (key: string) => void
}

export default class AppliedFilters extends React.Component<
  AppliedFiltersProps,
  any
> {
  render() {
    return (
      <div style={{ display: 'inline-block' }}>{this.getAppliedFilters()}</div>
    )
  }

  private getAppliedFilters() {
    let filterElements = []
    if (this.props.filterModel && this.props.columnDefinitions) {
      const filteredColDefs = this.props.columnDefinitions.filter(
        (colDef: any) => {
          return this.props.filterModel.hasOwnProperty(colDef.field)
        }
      )
      filterElements = filteredColDefs.map(colDef => {
        return (
          <div key={colDef.field} className="applied-filter__filter-field">
            <img style={{ height: '10px', marginRight: '5px' }} />
            {colDef.headerName}
            <i
              className="fa fa-times"
              onClick={() => this.props.removeFilter(colDef.field)}
            />
          </div>
        )
      })
    }
    return filterElements
  }
}
