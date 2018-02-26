import * as React from 'react'
import './blotterToolbar.scss'
import QuickFilter from './QuickFilter'
import * as AgGrid from 'ag-grid'

interface BlotterToolbarProps {
  isQuickFilterApplied: boolean
  removeQuickFilter: () => void
  quickFilterChangeHandler: (event:React.FormEvent<any>) => void
  filterModel:any
  columnDefinitions: AgGrid.ColDef[]
}

interface BlotterToobarState {
  themeName: string
}

export default class BlotterToolbar extends React.Component<BlotterToolbarProps, BlotterToobarState> {
  render() {
    return (
      <div className="blotter-toolbar">

        <div className="blotter-toolbar__left-controls">
          <QuickFilter isFilterApplied={this.props.isQuickFilterApplied}
                       removeQuickFilter={this.props.removeQuickFilter}
                       quickFilterChangeHandler={this.props.quickFilterChangeHandler}/>
        </div>
        <div className="blotter-toolbar__right-controls"></div>
      </div>
    )
  }
}
