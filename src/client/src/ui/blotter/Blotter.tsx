import * as React from 'react'
import { AgGridReact } from 'ag-grid-react'
import { DEFAULT_COLUMN_DEFINITION, getColumnDefinitions } from './blotterUtils'
import 'ag-grid/dist/styles/ag-grid.css'
import * as classNames from 'classnames'
import { GridApi, ColumnApi } from 'ag-grid'
import BlotterToolbar from './toolbar/BlotterToolbar'
import { TradeStatus } from '../../types'

interface AgGridBlotterProps {
  rows: any[]
  canPopout: boolean
  onPopoutClick: () => void
  gridDocument: Element
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
                      removeAllFilters={this.removeAllFilters}
                      removeFilter={this.removeFilter}
                      filterModel={this.gridApi ? this.gridApi.getFilterModel() : null }
                      columnDefinitions={colDefs} />
      <div className="rt-blotter__grid-wrapper">
        <AgGridReact
          columnDefs={colDefs}
          defaultColDef={DEFAULT_COLUMN_DEFINITION}
          rowData={this.props.rows}
          enableColResize={true}
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
          getDocument={this.getGridDocument}
          postProcessPopup={this.postProcessPopup}
        />
      </div>
      <div className="rt-blotter__status-bar">
        <div>{`Displaying rows ${ this.state.displayedRows } of ${ this.props.rows.length }`}</div>
      </div>
    </div>
  }

  private getGridDocument = () => {
    return this.props.gridDocument ? this.props.gridDocument.ownerDocument : null
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
    const newLeft = oldLeft - 145
    ePopup.style.top = newTop + 'px'
    ePopup.style.left = newLeft + 'px'

    // make sure the tab's layout is correct within the boundaries of the grid
    // and re-adjust for reposition and offset
    const rect = ePopup.getBoundingClientRect()
    const anchorRect = params.eventSource.getBoundingClientRect()
    const xDelta = anchorRect.left - rect.left
    const yDelta = anchorRect.top - rect.top

    if (rect.left < 0) {
      ePopup.classList.add('filter-menu__layout-right')
      ePopup.style.left = (params.column.actualWidth - 20/* tab width offset */) + 'px'
    } else {
      // re-adjust the position of the tab, if it's moved relative to the right edge of the grid
      if (xDelta > anchorRect.width) {
        let prevleft = ePopup.style.left
        prevleft = prevleft.substring(0, prevleft.indexOf('px'))
        const prevLeftPos = parseInt(prevleft, 10)
        ePopup.style.left  = (prevLeftPos + xDelta - (rect.width - anchorRect.width)) + 'px'
      }
    }

    if (yDelta > 5) {
      let prevTopStyle = ePopup.style.top
      prevTopStyle = prevTopStyle.substring(0, prevTopStyle.indexOf('px'))
      const prevTopPos = parseInt(prevTopStyle, 10)
      ePopup.style.top = (prevTopPos + (yDelta)) + 'px'
    }
  }
}
