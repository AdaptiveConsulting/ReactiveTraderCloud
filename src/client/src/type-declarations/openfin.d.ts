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

  type ExcelWorksheet = import('./openfin-excel').ExcelWorksheet
  type ExcelWorkbook = import('./openfin-excel').ExcelWorkbook
  type ExcelService = import('./openfin-excel').ExcelService
  type ExcelApplication = import('./openfin-excel').ExcelApplication

  interface OpenFinDesktop {
    ExcelService: ExcelService
    Excel: ExcelApplication
  }
}
