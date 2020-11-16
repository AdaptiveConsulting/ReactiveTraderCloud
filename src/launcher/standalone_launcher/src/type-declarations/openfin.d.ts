// Augment OpenFin types with more precise typings
declare interface OpenFinWindowOptions extends fin.WindowOption {
  accelerator?: {
    devtools?: boolean
    reload?: boolean
    reloadIgnoringCache?: boolean
    zoom?: boolean
  }
  cornerRounding?: {
    width?: number
    height?: number
  }
}

declare namespace fin {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  type ExcelWorksheet = import('./openfin-excel').ExcelWorksheet
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  type WorksheetChangedEventArgs = import('./openfin-excel').WorksheetChangedEventArgs
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  type WorksheetSelectionChangedEventArgs = import('./openfin-excel').WorksheetSelectionChangedEventArgs
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  type ExcelWorkbook = import('./openfin-excel').ExcelWorkbook
  type ExcelService = import('./openfin-excel').ExcelService
  type ExcelApplication = import('./openfin-excel').ExcelApplication

  interface OpenFinDesktop {
    ExcelService: ExcelService
    Excel: ExcelApplication
  }
}
