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
  interface OpenFinDesktop {
    ExcelService: {
      init(): Promise<void>
    }
    Excel: {
      getWorksheets(callback: Function): Promise<any>
      getWorksheetByName(name: string): ExcelWorksheet
      close(): Promise<any>
      openWorkbook(path: string, callback?: Function): Promise<any>
      addWorkbook(callback?: Function): Promise<any>
      getConnectionStatus(callback?: Function): Promise<any>
      getWorkbooks(callback?: Function): Promise<any>
      addEventListener(type: string, listener: (data?: any) => any): void
      run(callback?: Function): Promise<any>
    }
  }
}
