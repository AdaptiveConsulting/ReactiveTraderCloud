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

const BlotterStyle = styled('div')`
  height: 100%;
  width: 100%;
  min-height: 20px;
  background-color: ${({ theme: { palette } }) => palette.backgroundPrimary};
  color: ${({ theme: { palette } }) => palette.textPrimary};
  font-size: 13px;
`

const BlotterGrid = styled('div')`
  height: 100%;
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

  .rt-blotter__rowStrikeThrough:before {
    content: ' ';
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
`

const BlotterStatus = styled('div')`
  color: ${({ theme: { palette } }) => palette.textMeta};
  font-size: 10px;
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
      <BlotterStyle ref={el => this.updateGridDocument(ReactDOM.findDOMNode(el) as Element)}>
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
            onModelUpdated={this.onModelUpdated}
            onGridReady={this.onGridReady}
            rowSelection="multiple"
            headerHeight={38}
            suppressDragLeaveHidesColumns={true}
            getRowClass={this.getRowClass}
            onColumnResized={this.sizeColumnsToFit}
            getDocument={() => (gridDocument && gridDocument.ownerDocument) || null}
            postProcessPopup={this.postProcessPopup}
            gridAutoHeight={true}
            rowHeight={28}
          />
        </BlotterGrid>
        <BlotterStatus>{`Displaying rows ${displayedRows} of ${rows.length}`}</BlotterStatus>
      </BlotterStyle>
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
