import * as React from 'react'
import * as AgGrid from 'ag-grid'
import * as _ from 'lodash'

interface AppliedFiltersProps {
  filterModel:any
  columnDefinitions: AgGrid.ColDef[]
  removeAllFilters: () => void
  removeFilter: (key:string) => void
}

export default class AppliedFilters extends React.Component<AppliedFiltersProps, any> {

  render() {
    return <div style={{ display: 'inline-block' }}>
      {this.getAppliedFilters()}
    </div>
  }

  private getAppliedFilters() {
    let filterElements = []

    console.log(' *** render AppliedFilters, filterModel : ', this.props.filterModel)
    if (this.props.filterModel && this.props.columnDefinitions) {
      const filteredColDefs = _.filter(this.props.columnDefinitions, (colDef: any) => {
        console.log(' ------------------- colDef.field : ', colDef.field)
        return this.props.filterModel.hasOwnProperty(colDef.field)
      })

      console.log(' --- filteredColDefs : ', filteredColDefs)
      filterElements = filteredColDefs.map((colDef) => {
        return (
          <div key={colDef.field} className="filter-controls__filter-field">
            <img style={{ height: '10px', marginRight: '5px' }} />
            {colDef.headerName}
            <i className="fa fa-times" onClick={() => this.props.removeFilter(colDef.field)}></i>
          </div>
        )
      })
    }

    console.log(' ---- filterElements : ', filterElements)
    return filterElements
  }
}
