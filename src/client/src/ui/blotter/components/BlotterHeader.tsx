import { GridApi } from 'ag-grid'
import React, { Component } from 'react'
import { flexStyle } from 'rt-components'
import { styled } from 'rt-util'
import { columnDefinitions } from './blotterUtils'
import BlotterToolbar from './toolbar/BlotterToolbar'

interface Props {
  canPopout: boolean
  onPopoutClick: () => void
  gridApi: GridApi | null
}

interface State {
  quickFilterText: string
}

const BlotterHeaderStyle = styled('div')`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 8px 16px 20px;
`

const BlotterControls = styled('div')`
  cursor: pointer;
  color: ${({ theme: { text } }) => text.textSecondary};
`

const BlotterRight = styled('div')`
  ${flexStyle({ alignItems: 'center' })};
`

const BlotterLeft = styled('div')`
  font-size: 15px;
`

export default class BlotterHeader extends Component<Props, State> {
  state = {
    quickFilterText: ''
  }

  render() {
    const { canPopout, onPopoutClick } = this.props
    const { quickFilterText } = this.state

    return (
      <BlotterHeaderStyle>
        <BlotterLeft>Executed Trades</BlotterLeft>
        <BlotterRight>
          <BlotterToolbar
            isQuickFilterApplied={quickFilterText.length !== 0}
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

  private quickFilterChangeHandler = (event: React.FormEvent<HTMLInputElement>) => {
    const { gridApi } = this.props
    const { value } = event.currentTarget
    this.setState({ quickFilterText: value })
    return gridApi && gridApi.setQuickFilter(value)
  }

  private removeQuickFilter = () => {
    const { gridApi } = this.props
    if (!gridApi) {
      return
    }
    gridApi.setQuickFilter(null)
    gridApi.onFilterChanged()
    this.setState({ quickFilterText: '' })
  }

  private removeAllFilters = () => {
    const { gridApi } = this.props
    return gridApi && gridApi.setFilterModel(null)
  }

  private removeFilter = (key: string) => {
    const { gridApi } = this.props
    return gridApi && gridApi.destroyFilter(key)
  }
}
