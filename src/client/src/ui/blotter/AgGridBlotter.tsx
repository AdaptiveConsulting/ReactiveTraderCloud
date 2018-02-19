import * as React from 'react'
import { AgGridReact } from 'ag-grid-react'
import { DEFAULT_COLUMN_DEFINITION, getColumnDefinitions } from './agGridBlotterUtils'
import './agGridBlotter.scss'
import 'ag-grid/dist/styles/ag-grid.css'
//import 'ag-grid/dist/styles/ag-theme-dark.css'
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
  themeName: string
  quickFilterText: string
  useCustomNumericRenderer: boolean
}

export default class AgGridBlotter extends React.Component<AgGridBlotterProps, AgGridBlotterState> {

  private gridApi: GridApi
  private columnApi: ColumnApi

  state = {
    displayedRows: 0,
    themeName: 'rt-blotter-dark',
    quickFilterText: null,
    useCustomNumericRenderer: false
  } as AgGridBlotterState

  render () {
    const containerClass = classNames('agGridBlotter-container', 'rt-blotter-shared', this.state.themeName)
    const newWindowClassName = classNames(
      'glyphicon glyphicon-new-window',
      {
        'blotter__controls--hidden': this.props.canPopout,
      },
    )

    const colDefs = getColumnDefinitions(this.state.useCustomNumericRenderer)
    return <div className={containerClass}>
      <div className="rt-blotter__controls popout__controls">
        <i className={newWindowClassName}
           onClick={() => this.props.onPopoutClick()}/>
      </div>
      <BlotterToolbar isQuickFilterApplied={this.state.quickFilterText && this.state.quickFilterText.length !== 0}
                      quickFilterChangeHandler={this.quickFilterChangeHandler}
                      removeQuickFilter={this.removeQuickFilter}
                      filterModel={this.gridApi ? this.gridApi.getFilterModel() : null }
                      columnDefinitions={colDefs} removeAllFilters={this.removeAllFilters} removeFilter={this.removeFilter}/>
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
          postProcessPopup={this.postProcessPopup}
        />
      </div>
      <div className="rt-blotter__status-bar">
        <div>{`Displaying rows ${ this.state.displayedRows } of ${ this.props.rows.length }`}</div>
        <div style={{ display: 'flex' }}>
          <div className="blotter-toolbar__numeric-renderer-switch" onClick={this.toggleNumericRenderer}>Switch renderers</div>
          <div className="blotter-toolbar__theme-switch" onClick={this.toggleTheme}>Switch theme</div>
        </div>
      </div>
    </div>
  }

  private postProcessPopup = (params:any) => {
    if (params.type !== 'columnMenu') {
      return
    }
    const ePopup = params.ePopup
    let oldTopStr = ePopup.style.top
    oldTopStr = oldTopStr.substring(0, oldTopStr.indexOf('px'))
    let oldLeftStr = ePopup.style.left
    oldLeftStr = oldLeftStr.substring(0, oldLeftStr.indexOf('px'))
    const oldTop = parseInt(oldTopStr, 10)
    const oldLeft = parseInt(oldLeftStr, 10)
    const newTop = oldTop - 23
    const newLeft = oldLeft - 103
    ePopup.style.top = newTop + 'px'
    ePopup.style.left = newLeft + 'px'
  }

  private sizeColumnsToFit = (param:any = null) => {
    if (this.gridApi) {
      this.gridApi.sizeColumnsToFit()
    }
  }

  private onGridReady = ({ api, columnApi }) => {
    this.gridApi = api
    this.columnApi = this.columnApi
    this.sizeColumnsToFit()
  }

  private onModelUpdated = () => {
    if (!this.gridApi) {
      return
    }
    this.setState({ displayedRows: this.gridApi.getModel().getRowCount() })
  }

  private toggleTheme = () => {
    const newTheme = this.state.themeName === 'rt-blotter' ? 'rt-blotter-dark' : 'rt-blotter'
    this.setState({ themeName: newTheme })
  }

  private toggleNumericRenderer = () => {
    this.setState({ useCustomNumericRenderer: !this.state.useCustomNumericRenderer })
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

  private removeAllFilters = () => {
    this.gridApi.setFilterModel(null)
  }

  private removeFilter = (key:string) => {
    this.gridApi.destroyFilter(key)
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
