import * as React from 'react'
import * as classNames from 'classnames'
import './blotterToolbar.scss'


interface QuickFilterProps {
  isFilterApplied: boolean
  removeQuickFilter: () => void
  quickFilterChangeHandler: (event:React.FormEvent<any>) => void
}

interface QuickFilterState {
  quickFilterText: string
}

export default class QuickFilter extends React.Component<QuickFilterProps, QuickFilterState> {

  private quickFilterInput:HTMLInputElement

  state = {
    quickFilterText: ''
  } as QuickFilterState

  render() {
    const filterIconClassName = classNames('fa fa-filter', {
      'filter-icon--empty': !this.props.isFilterApplied,
      'filter-icon--applied': this.props.isFilterApplied
    })
    const filterIcon = <i className={filterIconClassName} />
    return  <div className="quick-filter-container">
      <input ref={(el:HTMLInputElement) => this.quickFilterInput = el}
             type="text"
             placeholder="Search"
             className="quick-filter-input"
             value={this.state.quickFilterText}
             onChange={(event: React.FormEvent<any>) => this.quickFilterChangeHandler(event)}/>
      <span className="quick-filter-icon" onClick={() => this.quickFilterInput.focus()}>{filterIcon}</span>
      {this.props.isFilterApplied && <span className="quick-filter-clear-icon" onClick={this.removeQuickFilter}>
                  <i className="fa fa-times" />
                </span>}
    </div>
  }

  private quickFilterChangeHandler = (event:React.FormEvent<any>) => {
    const target = event.target as HTMLInputElement
    this.setState({ quickFilterText: target.value })
    this.props.quickFilterChangeHandler(event)
  }

  private removeQuickFilter = () => {
    this.setState({ quickFilterText: '' })
    this.props.removeQuickFilter()
  }

}
