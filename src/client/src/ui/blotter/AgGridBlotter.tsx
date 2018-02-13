import * as React from 'react'
import { AgGridReact } from 'ag-grid-react'
import { COLUMN_DEFINITIONS, DEFAULT_COLUMN_DEFINITION } from './agGridBlotterUtils'
import './agGridBlotter.scss'
import 'ag-grid/dist/styles/ag-grid.css'
import 'ag-grid/dist/styles/ag-theme-blue.css'
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
}

export default class AgGridBlotter extends React.Component<AgGridBlotterProps, AgGridBlotterState> {

  private gridApi: GridApi
  private columnApi: ColumnApi

  state = {
    displayedRows: 0
  }

  render () {
    const containerClass = classNames('ag-theme-dark', 'agGridBlotter-container', 'rt-blotter')
    const newWindowClassName = classNames(
      'glyphicon glyphicon-new-window',
      {
        'blotter__controls--hidden': this.props.canPopout,
      },
    )

    return <div className={containerClass}>
      <div className="blotter__controls popout__controls">
        <i className={newWindowClassName}
           onClick={() => this.props.onPopoutClick()}/>
      </div>
      <BlotterToolbar/>
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
        />
      </div>
      <div className="rt-blotter__status-bar">{`Displaying rows ${ this.state.displayedRows } of ${ this.props.rows.length }`}</div>
    </div>
  }

  private onGridReady = ({ api, columnApi }) => {
    console.log(' :::: onGridReady, gridApi, columnApi  : ', api, columnApi)
    this.gridApi = api
    this.columnApi = this.columnApi
  }

  private onModelUpdated = () => {
    if (!this.gridApi) {
      return
    }
    this.setState({ displayedRows: this.gridApi.getModel().getRowCount()})
  }
}
