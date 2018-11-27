import { styleWorksheet } from './utils'

export interface ExcelInterface {
  workbook: any
  worksheet: any
  actions: {
    init: () => void
    publishExcel: (message: any) => void
  }
}

class Excel implements ExcelInterface {
  workbook: any
  worksheet: any
  excelOpen: boolean

  actions = {
    init: () => {
      // @ts-ignore
      if (!fin.desktop.Excel) {
        // @ts-ignore
        const { ExcelService } = fin.desktop
        ExcelService.init().catch((err: string) => console.log(err))
      }
      // @ts-ignore
      fin.desktop.ExcelService.addEventListener('excelConnected', () => (this.excelOpen = true))
    },

    setupSheet: () => {
      // @ts-ignore
      const excelInstance = fin.desktop.Excel
      excelInstance.getWorkbooks((workbooks: any) => {
        if (workbooks[0]) {
          this.workbook = workbooks[0]
          this.workbook.getWorksheets((res: any) => {
            styleWorksheet(res[0])
            this.worksheet = res[0]
          })
        }
      })
    },

    publishExcel: (message: any) => {
      // @ts-ignore
      if (fin.desktop.Excel && this.excelOpen) {
        this.actions.setupSheet()
      }

      if (this.worksheet && message.length !== 0) {
        const keys = Object.keys(message[0])
        const values = message.map((item: any) => Object.values(item))
        this.worksheet.setCells([keys, ...values], 'A1')
      }
    },
  }
}

const ExcelServiceInstance = new Excel()
export default ExcelServiceInstance
