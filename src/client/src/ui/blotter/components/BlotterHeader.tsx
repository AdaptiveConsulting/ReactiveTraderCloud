import { GridApi } from 'ag-grid'
import React, { Component } from 'react'
import { styled } from 'rt-util'
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

const BlotterHeaderStyle = styled('div')`
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const BlotterControlsStyle = styled('div')`
  cursor: pointer;
  color: ${({ theme: { palette } }) => palette.textSecondary};
`

export default class BlotterHeader extends Component<BlotterHeaderProps, BlotterHeaderState> {
  state = {
    quickFilterText: null
  }

  render() {
    const { canPopout, onPopoutClick } = this.props
    const { quickFilterText } = this.state

    return (
      <BlotterHeaderStyle>
        <BlotterToolbar
          isQuickFilterApplied={quickFilterText && quickFilterText.length !== 0}
          quickFilterChangeHandler={this.quickFilterChangeHandler}
          removeQuickFilter={this.removeQuickFilter}
          removeAllFilters={this.removeAllFilters}
          removeFilter={this.removeFilter}
          filterModel={this.props.gridApi ? this.props.gridApi.getFilterModel() : null}
          columnDefinitions={columnDefinitions}
        />
        {canPopout && (
          <BlotterControlsStyle>
            <i className="glyphicon glyphicon-new-window" onClick={onPopoutClick} />
          </BlotterControlsStyle>
        )}
      </BlotterHeaderStyle>
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
