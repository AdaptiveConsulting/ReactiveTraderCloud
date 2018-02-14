import * as React from 'react'
import { AgGridReact } from 'ag-grid-react'
import { COLUMN_DEFINITIONS, DEFAULT_COLUMN_DEFINITION } from './agGridBlotterUtils'
import './agGridBlotter.scss'
import 'ag-grid/dist/styles/ag-grid.css'
// import 'ag-grid/dist/styles/ag-theme-blue.css'
import 'ag-grid/dist/styles/ag-theme-dark.css'
import * as classNames from 'classnames'
import { GridApi, ColumnApi } from 'ag-grid'
import BlotterToolbar from './toolbar/BlotterToolbar'

interface AgGridBlotterProps {
  rows: any[]
  canPopout: boolean
  onPopoutClick: () => void
}

interface AgGridBlotterState {
  displayedRows: number
  themeName: string
  quickFilterText: string
}

export default class AgGridBlotter extends React.Component<AgGridBlotterProps, AgGridBlotterState> {

  private gridApi: GridApi
  private columnApi: ColumnApi

  state = {
    displayedRows: 0,
    themeName: 'rt-blotter-dark',
    quickFilterText: null
  } as AgGridBlotterState

  render () {
    const containerClass = classNames('ag-theme-dark', 'agGridBlotter-container', this.state.themeName)
    const newWindowClassName = classNames(
      'glyphicon glyphicon-new-window',
      {
        'blotter__controls--hidden': this.props.canPopout,
      },
    )

    return <div className={containerClass}>
      <div className="rt-blotter__controls popout__controls">
        <i className={newWindowClassName}
           onClick={() => this.props.onPopoutClick()}/>
      </div>
      <BlotterToolbar isQuickFilterApplied={this.state.quickFilterText && this.state.quickFilterText.length !== 0}
                      quickFilterChangeHandler={this.quickFilterChangeHandler}
                      removeQuickFilter={this.removeQuickFilter}/>
      <div className="rt-blotter__grid-wrapper">
        <AgGridReact
          columnDefs={COLUMN_DEFINITIONS}
          defaultColDef={DEFAULT_COLUMN_DEFINITION}
          rowData={this.props.rows}
          enableColResize={true}
          enableSorting={true}
          enableFilter={true}
          onModelUpdated={this.onModelUpdated}
          onGridReady={this.onGridReady}
          rowSelection="multiple"
          suppressDragLeaveHidesColumns={true}
        />
      </div>
      <div className="rt-blotter__status-bar">
        {`Displaying rows ${ this.state.displayedRows } of ${ this.props.rows.length }`}
        <div className="blotter-toolbar__theme-switch" onClick={this.toggleTheme}>Switch theme</div>
      </div>
    </div>
  }

  private onGridReady = ({ api, columnApi }) => {
    this.gridApi = api
    this.columnApi = this.columnApi
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
}
