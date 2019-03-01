declare namespace fin {
  interface WindowOptions {
    shadow?: boolean
  }

  interface ApplicationOptions {
    nonPersistent?: boolean
  }

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
