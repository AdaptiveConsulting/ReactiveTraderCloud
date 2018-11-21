import { GridApi } from 'ag-grid'
import { AgGridReact } from 'ag-grid-react'
// tslint:disable-next-line:no-submodule-imports
import 'ag-grid/dist/styles/ag-grid.css'
import React from 'react'
import { styled, ThemeProvider } from 'rt-theme'
import { Trade, TradeStatus } from 'rt-types'
import BlotterGrid from './BlotterGrid'
import BlotterHeader from './BlotterHeader'
import { columnDefinitions, DEFAULT_COLUMN_DEFINITION } from './blotterUtils'

export interface BlotterProps {
  rows: Trade[]
  canPopout: boolean
  onPopoutClick?: () => void
}

interface BlotterState {
  displayedRows: number
}

const BlotterStyleInMainWindow = styled('div')`
  height: 100%;
  width: 100%;
  min-height: 1.25rem;
  background-color: ${({ theme }) => theme.backgroundColor};
  color: ${({ theme }) => theme.textColor};
  font-size: 0.8125rem;
`

interface BlotterStyleProps {
  children: JSX.Element
  canPopOut: boolean
}
const BlotterStyleInStandAloneWindow = styled(BlotterStyleInMainWindow)`
  padding: 16px;
`
const BlotterStyle: React.SFC<BlotterStyleProps> = ({ canPopOut, children }) =>
  canPopOut ? (
    <BlotterStyleInMainWindow>{children}</BlotterStyleInMainWindow>
  ) : (
    <BlotterStyleInStandAloneWindow>{children}</BlotterStyleInStandAloneWindow>
  )

const BlotterStatus = styled('div')`
  height: 2rem;
  padding: 0 0.5rem;
  font-size: 0.625rem;
  line-height: 1rem;
  display: flex;
  align-items: center;
  opacity: 0.6;
  color: ${({ theme }) => theme.textColor};
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
      <ThemeProvider theme={theme => theme.blotter}>
        <BlotterStyle canPopOut={canPopout}>
          <React.Fragment>
            <BlotterHeader canPopout={canPopout} onPopoutClick={onPopoutClick} gridApi={this.gridApi} />
            <BlotterGrid innerRef={this.gridDoc}>
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
            <BlotterStatus>{`Displaying rows ${displayedRows} of ${rows.length}`}</BlotterStatus>
          </React.Fragment>
        </BlotterStyle>
      </ThemeProvider>
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
