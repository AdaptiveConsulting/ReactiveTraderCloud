import { GridApi } from 'ag-grid'
import classNames from 'classnames'
import React, { Component } from 'react'
import { columnDefinitions } from './blotterUtils'
import BlotterToolbar from './toolbar/BlotterToolbar'

interface BlotterHeaderProps {
  canPopout: boolean
  onPopoutClick: () => void
  gridApi: GridApi
}

interface BlotterHeaderState {
  quickFilterText: string
}

export default class BlotterHeader extends Component<BlotterHeaderProps, BlotterHeaderState> {
  state = {
    quickFilterText: null
  }

  render() {
    const { canPopout, onPopoutClick } = this.props
    const { quickFilterText } = this.state

    const newWindowClassName = classNames('glyphicon glyphicon-new-window', {
      'blotter__controls--hidden': canPopout
    })
    return (
      <React.Fragment>
        <div className="rt-blotter__controls popout__controls">
          <i className={newWindowClassName} onClick={onPopoutClick} />
        </div>
        <BlotterToolbar
          isQuickFilterApplied={quickFilterText && quickFilterText.length !== 0}
          quickFilterChangeHandler={this.quickFilterChangeHandler}
          removeQuickFilter={this.removeQuickFilter}
          removeAllFilters={this.removeAllFilters}
          removeFilter={this.removeFilter}
          filterModel={this.props.gridApi ? this.props.gridApi.getFilterModel() : null}
          columnDefinitions={columnDefinitions}
        />
      </React.Fragment>
    )
  }

  private quickFilterChangeHandler = (event: React.FormEvent<any>) => {
    const target = event.target as HTMLInputElement
    this.setState({ quickFilterText: target.value })
    this.props.gridApi.setQuickFilter(target.value)
  }

  private removeQuickFilter = () => {
    this.props.gridApi.setQuickFilter(null)
    this.props.gridApi.onFilterChanged()
    this.setState({ quickFilterText: null })
  }

  private removeAllFilters = () => this.props.gridApi.setFilterModel(null)

  private removeFilter = (key: string) => this.props.gridApi.destroyFilter(key)
}
