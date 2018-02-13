import * as React from 'react'
import './blotterControlBar.scss'


interface QuickFilterProps {
  isFilterApplied: boolean
  removeQuickFilter: () => void
  quickFilterChangeHandler: (event:React.FormEvent<any>) => void;
}

interface QuickFilterState {
  quickFilterText: string
}

export default class QuickFilter extends React.Component<QuickFilterProps, QuickFilterState> {

  private quickFilterInput:HTMLInputElement

  state = {
    quickFilterText: null
  } as QuickFilterState

  render() {
    const filterIcon = null// this.props.isFilterApplied ? filter_applied_icon : filter_icon;
    return  <div className="quick-filter-container">
      <input ref={(el:HTMLInputElement) => this.quickFilterInput = el}
             type="text"
             placeholder="Search"
             className="quick-filter-input"
             value={this.state.quickFilterText}
             onChange={(event: React.FormEvent<any>) => this.props.quickFilterChangeHandler(event)}/>
      <span className="quick-filter-icon" onClick={() => this.quickFilterInput.focus()}>{filterIcon}</span>
    </div>
  }
}
