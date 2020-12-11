import { ICellRendererParams } from "ag-grid-community"

export const CellRenderer: React.FC<ICellRendererParams> = ({
  colDef,
  valueFormatted,
  value,
  data,
}: ICellRendererParams) =>
  data ? (
    <span data-qa={`${data.tradeId}-${colDef.field}`}>
      {valueFormatted ?? value}
    </span>
  ) : null
