import { useRef } from "react"
import { ValueFormatterParams } from "ag-grid-community"
import { AgGridReact } from "ag-grid-react"
import { AgGridColumn } from "ag-grid-react/lib/agGridColumn"
import { Subject } from "rxjs"
import { bind } from "@react-rxjs/core"
import { Trade, TradeStatus, useTrades } from "services/trades"
import { gridApiSubj$, filterChangesSubj$, COL_FIELD } from "../services"
import {
  significantDigitsNumberFormatter,
  formatAsWholeNumber,
} from "utils/formatNumber"
import { capitalize } from "utils/capitalize"
import { SetFilter } from "./SetFilter"
import { CellRenderer } from "./CellRenderer"
import { TradesGridWrapper } from "./styled"
import { format as formatDate } from "date-fns"

type TradesGridRow = {
  data: Trade
}

const DATE_FORMAT = "dd-MMM-yyyy"

const formatTo6Digits = significantDigitsNumberFormatter(6)

const displayRowsSubj$ = new Subject<number>()
export const [useDisplayRows, displayRows$] = bind(displayRowsSubj$, 0)

const FaIcon = (faName: string) =>
  `<i class="fas fa-${faName}" aria-hidden="true" />`

const StatusClassRules = (classSpecifier: string) => ({
  [`rt-blotter__${classSpecifier}--rejected`]: ({ data }: TradesGridRow) =>
    data.status === TradeStatus.Rejected,
  [`rt-blotter__${classSpecifier}--done`]: ({ data }: TradesGridRow) =>
    data.status === TradeStatus.Done,
  [`rt-blotter__${classSpecifier}--pending`]: ({ data }: TradesGridRow) =>
    data.status === TradeStatus.Pending,
})

export const TradesGrid: React.FC = () => {
  const trades = useTrades()
  const parentRef = useRef<HTMLDivElement>(null)
  return (
    <TradesGridWrapper ref={parentRef}>
      <AgGridReact
        rowData={trades ?? []}
        defaultColDef={{
          menuTabs: ["filterMenuTab"],
          suppressSizeToFit: true,
          filter: false,
          minWidth: 40,
          resizable: true,
          sortable: true,
        }}
        suppressMovableColumns={true}
        rowSelection={"multiple"}
        suppressDragLeaveHidesColumns={true}
        rowClassRules={{
          ...StatusClassRules("row"),
          /* 'rt-blotter__row--highlight': ({ data }: BlotterRow ) => data.highlight */
        }}
        headerHeight={38}
        rowHeight={28}
        onFilterChanged={(event) => filterChangesSubj$.next(event)}
        onModelUpdated={({ api }) =>
          displayRowsSubj$.next(api.getDisplayedRowCount())
        }
        onGridReady={(event) => {
          event.api.sizeColumnsToFit()
          gridApiSubj$.next(event.api)
          displayRowsSubj$.next(event.api.getDisplayedRowCount())
        }}
        icons={{
          menu: FaIcon("filter"),
          filter: FaIcon("filter"),
          sortAscending: FaIcon("long-arrow-alt-up"),
          sortDescending: FaIcon("fa-long-arrow-alt-down"),
        }}
        getDocument={() => parentRef.current?.ownerDocument ?? document}
      >
        <AgGridColumn
          colId={COL_FIELD.STATUS_INDICATOR}
          field={COL_FIELD.STATUS_INDICATOR}
          headerName=""
          width={13}
          maxWidth={13}
          minWidth={13}
          cellClassRules={StatusClassRules("status-indicator")}
          cellRendererFramework={CellRenderer}
          sortable={false}
          suppressMenu={true}
          headerClass="rt-status-indicator__header"
          valueFormatter={() => ""}
        />
        <AgGridColumn
          colId={COL_FIELD.TRADE_ID}
          headerName="Trade ID"
          field={COL_FIELD.TRADE_ID}
          width={100}
          filter="agNumberColumnFilter"
          cellRendererFramework={CellRenderer}
        />
        <AgGridColumn
          colId={COL_FIELD.STATUS}
          headerName="Status"
          field={COL_FIELD.STATUS}
          width={110}
          filterFramework={SetFilter}
          valueFormatter={(params: ValueFormatterParams) =>
            capitalize(params.value)
          }
          cellRendererFramework={CellRenderer}
        />
        <AgGridColumn
          colId={COL_FIELD.TRADE_DATE}
          headerName="Trade Date"
          field={COL_FIELD.TRADE_DATE}
          width={130}
          valueFormatter={(params: ValueFormatterParams) =>
            formatDate(params.value, DATE_FORMAT)
          }
          cellRendererFramework={CellRenderer}
        />
        <AgGridColumn
          colId={COL_FIELD.DIRECTION}
          headerName="Direction"
          field={COL_FIELD.DIRECTION}
          width={110}
          filterFramework={SetFilter}
          cellRendererFramework={CellRenderer}
        />
        <AgGridColumn
          colId={COL_FIELD.SYMBOL}
          headerName="CCYCCY"
          field={COL_FIELD.SYMBOL}
          width={110}
          filterFramework={SetFilter}
          cellRendererFramework={CellRenderer}
        />
        <AgGridColumn
          colId={COL_FIELD.DEALT_CURRENCY}
          headerName="Dealt CCY"
          field={COL_FIELD.DEALT_CURRENCY}
          width={90}
          filterFramework={SetFilter}
          cellRendererFramework={CellRenderer}
        />
        <AgGridColumn
          colId={COL_FIELD.NOTIONAL}
          headerName="Notional"
          field={COL_FIELD.NOTIONAL}
          cellClass="rt-blotter__numeric-cell"
          headerClass="rt-header__numeric"
          width={110}
          filter="agNumberColumnFilter"
          valueFormatter={(params: ValueFormatterParams) =>
            formatAsWholeNumber(params.value)
          }
          cellRendererFramework={CellRenderer}
        />
        <AgGridColumn
          colId={COL_FIELD.SPOT_RATE}
          headerName="Rate"
          field={COL_FIELD.SPOT_RATE}
          width={100}
          cellClass="rt-blotter__numeric-cell"
          headerClass="rt-header__numeric"
          filter="agNumberColumnFilter"
          valueFormatter={(params: ValueFormatterParams) =>
            formatTo6Digits(params.value)
          }
          cellRendererFramework={CellRenderer}
        />
        <AgGridColumn
          colId={COL_FIELD.VALUE_DATE}
          headerName="Value Date"
          field={COL_FIELD.VALUE_DATE}
          width={120}
          valueFormatter={(params: ValueFormatterParams) =>
            formatDate(params.value, DATE_FORMAT)
          }
          cellRendererFramework={CellRenderer}
        />
        <AgGridColumn
          colId={COL_FIELD.TRADER_NAME}
          field={COL_FIELD.TRADER_NAME}
          headerName="Trader"
          width={110}
          filterFramework={SetFilter}
        />
        <AgGridColumn
          colId="empty"
          field="empty"
          headerName=""
          width={80}
          suppressSizeToFit={false}
          filter
        />
      </AgGridReact>
    </TradesGridWrapper>
  )
}
