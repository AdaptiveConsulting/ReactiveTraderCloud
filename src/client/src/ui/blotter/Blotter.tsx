import * as React from 'react'
import { AgGridReact } from 'ag-grid-react'
import { DEFAULT_COLUMN_DEFINITION, getColumnDefinitions } from './blotterUtils'
import './blotter.scss'
import './toolbar/blotterToolbar.scss'
import 'ag-grid/dist/styles/ag-grid.css'
import * as classNames from 'classnames'
import { GridApi, ColumnApi } from 'ag-grid'
import BlotterToolbar from './toolbar/BlotterToolbar'
import { TradeStatus } from '../../types'

interface AgGridBlotterProps {
  rows: any[]
  canPopout: boolean
  onPopoutClick: () => void
}

interface AgGridBlotterState {
  displayedRows: number
  quickFilterText: string
}

export default class AgGridBlotter extends React.Component<AgGridBlotterProps, AgGridBlotterState> {

  private gridApi: GridApi
  private columnApi: ColumnApi

  state = {
    displayedRows: 0,
    quickFilterText: null,
  } as AgGridBlotterState

  render () {
    const containerClass = classNames('agGridBlotter-container', 'rt-blotter-shared', 'rt-blotter-dark')
    const newWindowClassName = classNames(
      'glyphicon glyphicon-new-window',
      {
        'blotter__controls--hidden': this.props.canPopout,
      },
    )
    const colDefs = getColumnDefinitions()
    return <div className={containerClass}>
      <div className="rt-blotter__controls popout__controls">
        <i className={newWindowClassName}
           onClick={() => this.props.onPopoutClick()}/>
      </div>
      <BlotterToolbar isQuickFilterApplied={this.state.quickFilterText && this.state.quickFilterText.length !== 0}
                      quickFilterChangeHandler={this.quickFilterChangeHandler}
                      removeQuickFilter={this.removeQuickFilter}
                      filterModel={this.gridApi ? this.gridApi.getFilterModel() : null }
                      columnDefinitions={colDefs} />
      <div className="rt-blotter__grid-wrapper">
        <AgGridReact
          columnDefs={colDefs}
          defaultColDef={DEFAULT_COLUMN_DEFINITION}
          rowData={this.props.rows}
          enableColResize={false}
          suppressMovableColumns={true}
          enableSorting={true}
          enableFilter={true}
          onModelUpdated={this.onModelUpdated}
          onGridReady={this.onGridReady}
          rowSelection="multiple"
          headerHeight={28}
          suppressDragLeaveHidesColumns={true}
          getRowClass={this.getRowClass}
          onColumnResized={this.sizeColumnsToFit}
        />
      </div>
      <div className="rt-blotter__status-bar">
        <div>{`Displaying rows ${ this.state.displayedRows } of ${ this.props.rows.length }`}</div>
      </div>
    </div>
  }

  private sizeColumnsToFit = (param:any = null) => {
    if (this.gridApi) {
      this.gridApi.sizeColumnsToFit()
    }
  }

  private onGridReady = ({ api, columnApi }) => {
    this.gridApi = api
    this.columnApi = this.columnApi
    this.onModelUpdated()
    this.sizeColumnsToFit()
  }

  private onModelUpdated = () => {
    if (!this.gridApi) {
      return
    }
    this.setState({ displayedRows: this.gridApi.getModel().getRowCount() })
  }

  private quickFilterChangeHandler = (event:React.FormEvent<any>) => {
    const target = event.target as HTMLInputElement
    this.setState({ quickFilterText: target.value })
    this.gridApi.setQuickFilter(target.value)
  }

  private removeQuickFilter = () => {
    this.gridApi.setQuickFilter(null)
    this.gridApi.onFilterChanged()
    this.setState({ quickFilterText: null })
  }

  private getRowClass({ data }) {
    if (data.status === TradeStatus.Rejected) {
      return 'rt-blotter__rowStrikeThrough'
    }else if (data.status === TradeStatus.Pending) {
      return 'rt-blotter__row-pending'
    }
    return null
  }
}
