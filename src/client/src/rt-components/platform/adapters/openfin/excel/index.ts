import { formTable } from './utils'
import { ExcelWorkbook, ExcelWorksheet, ExcelInterface } from './types'
import { InteropTopics } from 'rt-components'

/*
  ACTIONS
  init           - initializes the Excel object - called on application connect/through rt-launcher
  openExcel      - opens the Excel, exits Menu view then opens the template
  publishToExcel - cells set here + polling incase of Excel open after/before launch

  UTILS
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
  Poisitins = 'A2',
  CcyPairs = 'G2',
}

class ExcelAdapter implements ExcelInterface {
  blotterSheet: ExcelWorksheet
  positionalSheet: ExcelWorksheet
  excelWorkbook: ExcelWorkbook

  actions = {
    init: async () => {
      await fin.desktop.ExcelService.init()
      this.utils.addOnCloseListener()
    },

    openExcel: async () => {
      const { Excel } = fin.desktop

      await Excel.run()
      const menuView = await Excel.addWorkbook()
      menuView.close()

      const RTExcel = await Excel.openWorkbook(`${EXCEL_HOST_URL}/${EXCEL_SHEET_NAME}`)
      this.utils.setWorkVariables(RTExcel)
    },

    publishToExcel: async (topic: string, message: any) => {
      if (!this.excelWorkbook) {
        this.utils.pollForExcelOpen()
      }

      switch (topic) {
        case InteropTopics.Blotter:
          return this.blotterSheet && this.blotterSheet.setCells(formTable.blotter(message), ExcelPageSetup.Blotter)
        case InteropTopics.Analytics:
          return (
            this.positionalSheet &&
            (this.positionalSheet.setCells(formTable.positions(message), ExcelPageSetup.Poisitins),
            this.positionalSheet.setCells(formTable.ccy(message), ExcelPageSetup.CcyPairs))
          )
      }
    },
  }

  private utils = {
    addOnCloseListener: () => {
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
    },

    setWorkVariables: async (RTExcel: ExcelWorkbook) => {
      this.excelWorkbook = RTExcel
      const worksheets = await this.excelWorkbook.getWorksheets()
      this.blotterSheet = worksheets[0]
      this.positionalSheet = worksheets[1]
      this.utils.addOnCloseListener()
    },

    isAlreadyRunning: async () => {
      const { Excel } = fin.desktop
      if (!Excel) {
        await fin.desktop.ExcelService.init()
        return
      }

      const connected = await Excel.getConnectionStatus()
      if (!connected) {
        return
      }

      const workbooks = await Excel.getWorkbooks()
      const RTExcel = workbooks.filter((workbook: any) => (workbook.name === EXCEL_SHEET_NAME ? workbook : null))
      return RTExcel[0]
    },

    pollForExcelOpen: async () => {
      const RTExcel = await this.utils.isAlreadyRunning()
      if (RTExcel) {
        this.utils.setWorkVariables(RTExcel)
      }
    },
  }
}

const ExcelServiceInstance = new ExcelAdapter()
export default ExcelServiceInstance
