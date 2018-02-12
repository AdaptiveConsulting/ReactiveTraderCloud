import * as React from 'react'
import { AgGridReact } from 'ag-grid-react'
import { COLUMN_DEFINITIONS } from './agGridBlotterUtils'
import './agGridBlotter.scss'
import 'ag-grid/dist/styles/ag-grid.css'
import 'ag-grid/dist/styles/ag-theme-blue.css'
import 'ag-grid/dist/styles/ag-theme-dark.css'
import * as classNames from 'classnames'

interface AgGridBlotterProps {
  rows: any[]
  canPopout: boolean
  onPopoutClick: () => void
}

export default class AgGridBlotter extends React.Component<AgGridBlotterProps, {}> {

  render () {
    const containerClass = classNames('ag-theme-dark', 'agGridBlotter-container')
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
      <AgGridReact
        columnDefs={COLUMN_DEFINITIONS}
        rowData={this.props.rows}
        enableColResize={true}
        enableSorting={true}
        enableRangeSelection={true}/>
    </div>
  }
}
