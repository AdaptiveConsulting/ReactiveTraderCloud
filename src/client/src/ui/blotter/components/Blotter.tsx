import { GridApi } from 'ag-grid'
import { AgGridReact } from 'ag-grid-react'
import 'ag-grid/dist/styles/ag-grid.css'
import React from 'react'
import ReactDOM from 'react-dom'
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
  gridDocument: Element
}

const BlotterShellStyle = styled('div')`
  height: 100%;
  width: 100%;
  min-height: 20px;
  background-color: ${({ theme: { palette } }) => palette.backgroundPrimary};
`

const BlotterStyle = styled('div')`
  color: #fff;
  font-family: BrandonLight;
  position: relative;
  width: 100%;
  height: 100%;
  font-size: 13px;
`

export default class Blotter extends React.Component<BlotterProps, BlotterState> {
  private gridApi: GridApi

  state = {
    displayedRows: 0,
    gridDocument: null
  }

  render() {
    const { canPopout, rows, onPopoutClick } = this.props
    const { displayedRows, gridDocument } = this.state

    return (
      <BlotterShellStyle ref={el => this.updateGridDocument(ReactDOM.findDOMNode(el) as Element)}>
        <BlotterStyle>
          <BlotterHeader canPopout={canPopout} onPopoutClick={onPopoutClick} gridApi={this.gridApi} />
          <div className="rt-blotter__grid-wrapper">
            <AgGridReact
              columnDefs={columnDefinitions}
              defaultColDef={DEFAULT_COLUMN_DEFINITION}
              rowData={rows}
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
              getDocument={() => (gridDocument && gridDocument.ownerDocument) || null}
              postProcessPopup={this.postProcessPopup}
            />
          </div>
          <div className="rt-blotter__status-bar">
            <div>{`Displaying rows ${displayedRows} of ${rows.length}`}</div>
          </div>
        </BlotterStyle>
      </BlotterShellStyle>
    )
  }

  private updateGridDocument = (doc: Element) => {
    if (doc && !this.state.gridDocument) {
      this.setState({ gridDocument: doc })
    }
  }

  private sizeColumnsToFit = () => this.gridApi && this.gridApi.sizeColumnsToFit()

  private onGridReady = ({ api }) => {
    this.gridApi = api
    this.onModelUpdated()
    this.sizeColumnsToFit()
  }

  private onModelUpdated = () => this.gridApi && this.setState({ displayedRows: this.gridApi.getModel().getRowCount() })

  private getRowClass({ data }) {
    if (data.status === TradeStatus.Rejected) {
      return 'rt-blotter__rowStrikeThrough'
    } else if (data.status === TradeStatus.Pending) {
      return 'rt-blotter__row-pending'
    }
    return null
  }

  private postProcessPopup = (params: any) => {
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
      ePopup.style.left = params.column.actualWidth - 20 /* tab width offset */ + 'px'
    } else {
      // re-adjust the position of the tab, if it's moved relative to the right edge of the grid
      if (xDelta > anchorRect.width) {
        let prevleft = ePopup.style.left
        prevleft = prevleft.substring(0, prevleft.indexOf('px'))
        const prevLeftPos = parseInt(prevleft, 10)
        ePopup.style.left = prevLeftPos + xDelta - (rect.width - anchorRect.width) + 'px'
      }
    }

    if (yDelta > 5) {
      let prevTopStyle = ePopup.style.top
      prevTopStyle = prevTopStyle.substring(0, prevTopStyle.indexOf('px'))
      const prevTopPos = parseInt(prevTopStyle, 10)
      ePopup.style.top = prevTopPos + yDelta + 'px'
    }
  }
}
