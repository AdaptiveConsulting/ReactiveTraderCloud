import { GridApi } from 'ag-grid'
import { AgGridReact } from 'ag-grid-react'
// tslint:disable-next-line:no-submodule-imports
import 'ag-grid/dist/styles/ag-grid.css'
import React from 'react'
import { styled } from 'rt-theme'
import { Trade, TradeStatus } from 'rt-types'
import BlotterGrid from './BlotterGrid'
import BlotterHeader from './BlotterHeader'
import { columnDefinitions, DEFAULT_COLUMN_DEFINITION, csvExportSettings } from './blotterUtils'

export interface BlotterProps {
  rows: Trade[]
  canPopout: boolean
  onPopoutClick?: () => void
}

interface BlotterState {
  displayedRows: number
}

const BlotterStyle = styled('div')`
  height: 100%;
  width: 100%;
  min-height: 1.25rem;
  color: ${({ theme }) => theme.core.textColor};
  font-size: 0.8125rem;
`

const BlotterStatus = styled('div')`
  height: 2rem;
  padding: 0.5rem 0 0.5rem 0.75rem;
  font-size: 0.625rem;
  line-height: 1rem;
  display: flex;
  align-items: center;
  color: ${({ theme }) => theme.core.textColor};
  background-color: ${({ theme }) => theme.core.lightBackground};
  border-radius: 0 0 0.25rem 0.25rem;
`

const BlotterStatusText = styled.span`
  opacity: 0.6;
`

const icons = {
  menu: '<i class="fas fa-filter" aria-hidden="true" />',
  filter: '<i class="fas fa-filter" aria-hidden="true" />',
  sortAscending: '<i class="fas fa-long-arrow-alt-up" aria-hidden="true" />',
  sortDescending: '<i class="fas fa-long-arrow-alt-down" aria-hidden="true" />',
}

export default class Blotter extends React.Component<BlotterProps, BlotterState> {
  private gridApi: GridApi | null = null

  private gridDoc = React.createRef<HTMLDivElement>()

  state = {
    displayedRows: 0,
  }

  render() {
    const { canPopout, rows, onPopoutClick } = this.props
    const { displayedRows } = this.state
    return (
      <BlotterStyle>
        <BlotterHeader
          canPopout={canPopout}
          onPopoutClick={onPopoutClick}
          onExportToExcelClick={this.exportToExcel}
          gridApi={this.gridApi}
        />
        <BlotterGrid ref={this.gridDoc}>
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
            getDocument={() => this.gridDoc.current.ownerDocument}
          />
        </BlotterGrid>
        <BlotterStatus>
          <BlotterStatusText>{`Displaying rows ${displayedRows} of ${rows.length}`}</BlotterStatusText>
        </BlotterStatus>
      </BlotterStyle>
    )
  }

  private exportToExcel = () => {
    if (this.gridApi) {
      this.gridApi.exportDataAsCsv(csvExportSettings)
    }
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
    } else if (data.highlight) {
      return 'rt-blotter__row-highlight'
    }
    return ''
  }
}
