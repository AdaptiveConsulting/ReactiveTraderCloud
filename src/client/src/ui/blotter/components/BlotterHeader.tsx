import { GridApi } from 'ag-grid'
import React, { Component } from 'react'
import { styled } from 'rt-util'
import { columnDefinitions } from './blotterUtils'
import BlotterToolbar from './toolbar/BlotterToolbar'

interface BlotterHeaderProps {
  canPopout: boolean
  onPopoutClick: () => void
  gridApi: GridApi | null
}

interface BlotterHeaderState {
  quickFilterText: string | null
}

const BlotterHeaderStyle = styled('div')`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 10px 16px 10px;
`

const BlotterControls = styled('div')`
  cursor: pointer;
  color: ${({ theme: { palette } }) => palette.textSecondary};
`

const BlotterRight = styled('div')`
  display: flex;
  align-items: center;
`

const BlotterLeft = styled('div')`
  font-size: 15px;
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
        <BlotterLeft>Executed Trades</BlotterLeft>
        <BlotterRight>
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
            <BlotterControls>
              <i className="glyphicon glyphicon-new-window" onClick={onPopoutClick} />
            </BlotterControls>
          )}
        </BlotterRight>
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
