import { GridApi } from 'ag-grid'
import { AgGridReact } from 'ag-grid-react'
import 'ag-grid/dist/styles/ag-grid.css'
import React from 'react'
import { Trade, TradeStatus } from 'rt-types'
import { styled } from 'rt-util'
import BlotterHeader from './BlotterHeader'
import { columnDefinitions, DEFAULT_COLUMN_DEFINITION } from './blotterUtils'

export interface BlotterProps {
  rows: Trade[]
  canPopout: boolean
  onPopoutClick: () => void
}

interface BlotterState {
  displayedRows: number
}

const BlotterStyle = styled('div')`
  height: 100%;
  width: 100%;
  min-height: 20px;
  background-color: ${({ theme: { palette } }) => palette.backgroundPrimary};
  color: ${({ theme: { palette } }) => palette.textPrimary};
  font-size: 13px;
`

const BlotterGrid = styled('div')`
  height: calc(100% - 70px);
  background-color: ${({ theme: { palette } }) => palette.backgroundSecondary};
  border-radius: 3px;

  .ag-header {
    border-bottom: 2px solid ${({ theme: { palette } }) => palette.backgroundPrimary};
    font-size: 11px;
    text-transform: uppercase;
  }

  .ag-header-container {
    margin-top: 12px;
  }

  .ag-row-odd {
    background-color: ${({ theme: { palette } }) => palette.backgroundPrimary};
  }

  .ag-row-odd:hover {
    background-color: ${({ theme: { palette } }) => palette.backgroundTertiary};
  }

  .ag-row-even:hover {
    background-color: ${({ theme: { palette } }) => palette.backgroundTertiary};
  }

  .rt-blotter__row-pending {
    background-color: ${({ theme: { palette } }) => palette.backgroundExtra};
  }

  .rt-blotter__status-indicator--done {
    width: 5px !important;
    padding: 0;
    margin: 0;
    background-color: ${({ theme: { palette } }) => palette.accentGood.normal};
  }

  .rt-blotter__status-indicator--rejected {
    width: 5px !important;
    padding: 0;
    margin: 0;
    background-color: ${({ theme: { palette } }) => palette.accentBad.normal};
  }

  .rt-blotter__cell-rejected,
  .rt-blotter__cell-done,
  .rt-blotter__cell-pending {
    text-transform: capitalize;
  }

  .rt-blotter__row-rejected:before {
    content: '';
    position: absolute;
    top: 50%;
    left: 0;
    border-bottom: 1px solid ${({ theme: { palette } }) => palette.accentBad.normal};
    width: 100%;
  }

  .ag-row {
    transition: none;
  }

  .ag-cell {
    display: flex;
    align-items: center;
  }

  .ag-icon-filter {
    color: ${({ theme: { palette } }) => palette.textSecondary};
  }

  .ag-header-cell-label {
    display: flex;
    align-items: center;
  }

  .ag-header-cell-label i {
    color: ${({ theme: { palette } }) => palette.textPrimary};
    padding: 0px 4px;
  }

  .ag-menu {
    background-color: ${({ theme: { palette } }) => palette.backgroundPrimary};
    box-shadow: 0 0 0.5px 0 ${({ theme: { palette } }) => palette.textPrimary};
    border-radius: 3px;

    .filter-container__checkbox-container {
      display: flex;
      align-items: center;
      padding: 4px 10px;

      &:hover {
        background-color: ${({ theme: { palette } }) => palette.backgroundTertiary};
      }
    }

    .filter_container__select-all-option-container {
      border-bottom: 2px solid ${({ theme: { palette } }) => palette.textMeta};
    }

    input,
    select {
      margin: 10px;
      font-size: 11px;
      padding: 6px;
      color: ${({ theme: { palette } }) => palette.textPrimary};
      background-color: ${({ theme: { palette } }) => palette.backgroundPrimary};
      border: none;
      border-bottom: 1px solid ${({ theme: { palette } }) => palette.textMeta};
      width: auto;
      outline: none;

      &:focus {
        border-bottom: 1px solid ${({ theme: { palette } }) => palette.accentPrimary.normal};
      }
    }

    input[type='checkbox' i] {
      margin: 0px 4px;
      cursor: pointer;
    }

    label {
      text-transform: capitalize;
    }
  }
`

const BlotterStatus = styled('div')`
  height: 30px;
  color: ${({ theme: { palette } }) => palette.textMeta};
  font-size: 10px;
  display: flex;
  align-items: center;
`

const icons = {
  menu: '<i class="fa fa-filter" aria-hidden="true" />',
  filter: '<i class="fa fa-filter" aria-hidden="true" />',
  sortAscending: '<i class="fa fa-long-arrow-down" aria-hidden="true" />',
  sortDescending: '<i class="fa fa-long-arrow-up" aria-hidden="true" />'
}

export default class Blotter extends React.Component<BlotterProps, BlotterState> {
  private gridApi: GridApi | null = null

  state = {
    displayedRows: 0
  }

  render() {
    const { canPopout, rows, onPopoutClick } = this.props
    const { displayedRows } = this.state

    return (
      <BlotterStyle>
        <BlotterHeader canPopout={canPopout} onPopoutClick={onPopoutClick} gridApi={this.gridApi} />
        <BlotterGrid>
          <AgGridReact
            columnDefs={columnDefinitions}
            defaultColDef={DEFAULT_COLUMN_DEFINITION}
            rowData={rows}
            enableColResize={true}
            suppressMovableColumns={true}
            enableSorting={true}
            enableFilter={true}
            rowSelection="multiple"
            suppressDragLeaveHidesColumns={true}
            getRowClass={this.getRowClass}
            headerHeight={38}
            rowHeight={28}
            onModelUpdated={this.onModelUpdated}
            onGridReady={this.onGridReady}
            icons={icons}
          />
        </BlotterGrid>
        <BlotterStatus>{`Displaying rows ${displayedRows} of ${rows.length}`}</BlotterStatus>
      </BlotterStyle>
    )
  }

  private onGridReady = ({ api }: { api: GridApi }) => {
    this.gridApi = api
    this.onModelUpdated()
    api.sizeColumnsToFit()
  }

  private onModelUpdated = () => this.gridApi && this.setState({ displayedRows: this.gridApi.getDisplayedRowCount() })

  private getRowClass({ data }: { data: Trade }) {
    if (data.status === TradeStatus.Rejected) {
      return 'rt-blotter__row-rejected'
    } else if (data.status === TradeStatus.Pending) {
      return 'rt-blotter__row-pending'
    }
    return ''
  }
}
