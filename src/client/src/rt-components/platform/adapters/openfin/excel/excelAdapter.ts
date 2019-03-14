import { formTable } from './utils/index'
import { InteropTopics } from 'rt-components'

/*
  ACTIONS
    init           - initializes the Excel object - called on application connect/through rt-launcher
    openExcel      - opens the Excel, exits Menu view then opens the template
    publishToExcel - cells set here + polling incase of Excel open after/before launch

  addOnCloseListener - cleans up, sets Excel variables to null on Excel close
  setWorkVariables   - the only location where Excel variables are set
  isAlreadyRunning   - 1. checks if Excel object initialized
                       2. checks if Excel connected (opened)
                       3. returns Excel workbook object if name matches EXCEL_SHEET_NAME
  pollForExcelOpen   - called repeatedly if no workbook exists - if the correct workbook
                       is found the Excel variables are set            
*/

const EXCEL_HOST_URL = 'http://adaptiveconsulting.github.io/ReactiveTraderCloud/excel'
const EXCEL_SHEET_NAME = 'RTExcel.xlsx'

enum ExcelPageSetup {
  Blotter = 'A2',
  Positions = 'A2',
  CcyPairs = 'G2',
}

class ExcelAdapter {
  blotterSheet: fin.ExcelWorksheet
  positionalSheet: fin.ExcelWorksheet
  excelWorkbook: fin.ExcelWorkbook

  actions = {
    init: async () => {
      await fin.desktop.ExcelService.init()
      this.addOnCloseListener()
    },

    openExcel: async () => {
      await fin.desktop.Excel.run()
      const menuView = await fin.desktop.Excel.addWorkbook()
      menuView.close()

      const RTExcel = await fin.desktop.Excel.openWorkbook(`${EXCEL_HOST_URL}/${EXCEL_SHEET_NAME}`)
      this.setWorkVariables(RTExcel)
    },

    publishToExcel: async <T = string | object>(topic: string, message: T) => {
      if (!this.excelWorkbook) {
        this.pollForExcelOpen()
      }

      switch (topic) {
        case InteropTopics.Blotter:
          if (this.blotterSheet) {
            //@ts-ignore
            await this.blotterSheet.setCells(formTable.blotter(message), ExcelPageSetup.Blotter)
          }
        case InteropTopics.Analytics:
          if (this.positionalSheet) {
            //@ts-ignore
            await this.positionalSheet.setCells(formTable.positions(message), ExcelPageSetup.Positions)
            //@ts-ignore
            await this.positionalSheet.setCells(formTable.ccy(message), ExcelPageSetup.CcyPairs)
          }
      }
    },
  }

  private addOnCloseListener = () => {
    fin.desktop.Excel.addEventListener(
      'workbookClosed',
      ({ workbook: { name } }: any): void => {
        if (name === EXCEL_SHEET_NAME) {
          this.blotterSheet = null
          this.positionalSheet = null
          this.excelWorkbook = null
        }
      },
    )
  }

  private setWorkVariables = async (RTExcel: fin.ExcelWorkbook) => {
    this.excelWorkbook = RTExcel
    const worksheets = await this.excelWorkbook.getWorksheets()
    this.blotterSheet = worksheets[0]
    this.positionalSheet = worksheets[1]
    this.addOnCloseListener()
  }

  private isAlreadyRunning = async () => {
    if (typeof fin.desktop.Excel === 'undefined' || !fin.desktop.Excel) {
      await fin.desktop.ExcelService.init()
      return
    }

    const connected = await fin.desktop.Excel.getConnectionStatus()
    if (!connected) {
      return
    }

    const workbooks = await fin.desktop.Excel.getWorkbooks()
    const RTExcel = workbooks.filter((workbook: any) => (workbook.name === EXCEL_SHEET_NAME ? workbook : null))
    return RTExcel[0]
  }

  private pollForExcelOpen = async () => {
    const RTExcel = await this.isAlreadyRunning()
    if (RTExcel) {
      this.setWorkVariables(RTExcel)
    }
  }
}

const excelAdapter = new ExcelAdapter()
export default excelAdapter
