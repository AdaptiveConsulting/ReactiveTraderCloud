import { ColDef } from 'ag-grid'
import React from 'react'
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

interface BlotterToobarState {
  themeName: string
}

export default class BlotterToolbar extends React.Component<BlotterToolbarProps, BlotterToobarState> {
  render() {
    return (
      <React.Fragment>
        <QuickFilter
          isFilterApplied={this.props.isQuickFilterApplied}
          removeQuickFilter={this.props.removeQuickFilter}
          quickFilterChangeHandler={this.props.quickFilterChangeHandler}
        />
        <AppliedFilters
          filterModel={this.props.filterModel}
          columnDefinitions={this.props.columnDefinitions}
          removeAllFilters={this.props.removeAllFilters}
          removeFilter={this.props.removeFilter}
        />
      </React.Fragment>
    )
  }
}
