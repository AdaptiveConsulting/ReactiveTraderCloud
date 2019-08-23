import { AgGridReact } from 'ag-grid-react'
import { GridApi } from 'ag-grid'
// tslint:disable-next-line:no-submodule-imports
import 'ag-grid/dist/styles/ag-grid.css'
import React, { useState, useCallback } from 'react'
import { styled } from 'rt-theme'
import { Trade, TradeStatus } from 'rt-types'
import BlotterGrid from './BlotterGrid'
import BlotterHeader from './BlotterHeader'
import { columnDefinitions, DEFAULT_COLUMN_DEFINITION, csvExportSettings } from './blotterUtils'
import { Context } from 'openfin-fdc3'
import { usePlatform } from 'rt-components'

export interface BlotterProps {
  rows: Trade[]
  canPopout: boolean
  onPopoutClick?: () => void
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
  sortDescending: '<i class="fas fa-long-arrow-alt-down" aria-hidden="true" />',
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
  const { canPopout, rows, onPopoutClick } = props
  const [displayedRows, setDisplayedRows] = useState(0)
  const [gridDoc] = useState(React.createRef<HTMLDivElement>())
  const [gridApi, setGridApi] = useState(null)
  const platform = usePlatform()
  const onModelUpdated = useCallback(
    () => gridApi && setDisplayedRows(gridApi.getDisplayedRowCount()),
    [gridApi],
  )

  const getCurrencyPairContext = (currencyPair: string): Context => {
    const formattedCurrencyPair = `${currencyPair.slice(0, 3)}/${currencyPair.slice(3, 6)}`
    return {
      type: 'fdc3.security',
      name: formattedCurrencyPair,
      id: {},
      market: 'CURRENCY',
    }
  }

  const broadcastContext = (currencyPair: string) => {
    if (!currencyPair) {
      return
    }
    platform.fdc3.broadcast(getCurrencyPairContext(currencyPair))
  }

  const onGridReady = useCallback(({ api }: { api: GridApi }) => {
    setGridApi(api)
    onModelUpdated()
    api.sizeColumnsToFit()
  }, [])

  const exportToExcel = useCallback(() => {
    if (gridApi) {
      gridApi.exportDataAsCsv(csvExportSettings)
    }
  }, [gridApi])

  return (
    <BlotterStyle>
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
          enableColResize={true}
          suppressMovableColumns={true}
          enableSorting={true}
          enableFilter={true}
          rowSelection="multiple"
          suppressDragLeaveHidesColumns={true}
          getRowClass={getRowClass}
          onRowClicked={params => broadcastContext(params.data.symbol)}
          headerHeight={38}
          rowHeight={28}
          onModelUpdated={onModelUpdated}
          onGridReady={onGridReady}
          icons={icons}
          getDocument={() => gridDoc.current.ownerDocument}
        />
      </BlotterGrid>
      <BlotterStatus>
        <BlotterStatusText>{`Displaying rows ${displayedRows} of ${
          rows.length
        }`}</BlotterStatusText>
      </BlotterStatus>
    </BlotterStyle>
  )
}

export default Blotter
