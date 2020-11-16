import { AgGridReact } from 'ag-grid-react'
import { GridApi } from 'ag-grid-community'
// tslint:disable-next-line:no-submodule-imports
import 'ag-grid-community/dist/styles/ag-grid.css'
import React, { useState, useCallback } from 'react'
import { useInterop } from 'rt-interop'
import styled from 'styled-components/macro'
import { Trade, TradeStatus } from 'rt-types'
import BlotterGrid from './BlotterGrid'
import BlotterHeader from './BlotterHeader'
import { columnDefinitions, DEFAULT_COLUMN_DEFINITION, csvExportSettings } from './blotterUtils'

export interface BlotterProps {
  rows: Trade[]
  canPopout: boolean
  onPopoutClick?: (x: number, y: number) => void
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
  sortDescending: '<i class="fas fa-long-arrow-alt-down" aria-hidden="true" />'
}

const getRowClass = ({ data }: { data: Trade }) => {
  let cssClass = ''
  if (data.status === TradeStatus.Rejected) {
    cssClass = 'rt-blotter__row-rejected'
  }
  if (data.status === TradeStatus.Pending) {
    cssClass = 'rt-blotter__row-pending'
  }
  if (data.highlight) {
    cssClass += ' rt-blotter__row-highlight'
  }
  return cssClass
}

const Blotter: React.FC<BlotterProps> = props => {
  const { canPopout, rows } = props
  const [displayedRows, setDisplayedRows] = useState(0)
  const [gridDoc] = useState(React.createRef<HTMLDivElement>())
  const [gridApi, setGridApi] = useState<GridApi>()
  const onModelUpdated = useCallback(
    () => gridApi && setDisplayedRows(gridApi.getDisplayedRowCount()),
    [gridApi]
  )
  const interop = useInterop()

  const broadcastContext = (currencyPair: string) => {
    if (interop === null || !currencyPair) {
      return
    }

    const { currencyPairSelected } = interop

    currencyPairSelected(currencyPair)
  }

  const onGridReady = useCallback(
    ({ api }: { api: GridApi }) => {
      setGridApi(api)
      onModelUpdated()
      api.sizeColumnsToFit()
    },
    [onModelUpdated]
  )

  const exportToExcel = useCallback(() => {
    if (gridApi) {
      gridApi.exportDataAsCsv(csvExportSettings)
    }
  }, [gridApi])

  const onPopoutClick = useCallback(
    (x: number, y: number) => props.onPopoutClick && props.onPopoutClick(x, y),
    [props]
  )

  const getDocument = useCallback(
    () => (gridDoc.current && gridDoc.current.ownerDocument) || document,
    [gridDoc]
  )

  return (
    <BlotterStyle data-qa="blotter__blotter-content">
      <BlotterHeader
        canPopout={canPopout}
        onPopoutClick={onPopoutClick}
        onExportToExcelClick={exportToExcel}
        gridApi={gridApi}
      />
      <BlotterGrid ref={gridDoc}>
        <AgGridReact
          columnDefs={columnDefinitions}
          defaultColDef={DEFAULT_COLUMN_DEFINITION}
          rowData={rows}
          suppressMovableColumns
          rowSelection="multiple"
          suppressDragLeaveHidesColumns
          getRowClass={getRowClass}
          onRowClicked={params => broadcastContext(params.data.symbol)}
          headerHeight={38}
          rowHeight={28}
          onModelUpdated={onModelUpdated}
          onGridReady={onGridReady}
          icons={icons}
          getDocument={getDocument}
        />
      </BlotterGrid>
      <BlotterStatus>
        <BlotterStatusText data-qa="blotter__blotter-status-text">
          {`Displaying rows ${displayedRows} of ${rows.length}`}
        </BlotterStatusText>
      </BlotterStatus>
    </BlotterStyle>
  )
}

export default React.memo(Blotter)
