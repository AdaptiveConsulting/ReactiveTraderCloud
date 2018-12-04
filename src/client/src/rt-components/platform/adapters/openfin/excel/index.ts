import { formTable } from './utils'

export interface ExcelInterface {
  workbook: any

  actions: {
    init: () => void
    publishExcel: (topic: string, message: any) => void
    setupSheet: () => void
    openExcel: () => void
  }
}

class Excel implements ExcelInterface {
  workbook: any
  blotterSheet: any
  positionSheet: any

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
            ;[this.blotterSheet, this.positionSheet] = res
          })
        }
      })
    },

    openExcel: () => {
      // @ts-ignore
      fin.desktop.Excel ? fin.desktop.Excel.run() : this.actions.init()
    },

    publishExcel: (topic: string, message: any) => {
      // @ts-ignore
      if (fin.desktop.Excel && this.excelOpen) {
        this.actions.setupSheet()
      }

      if (message.length !== 0) {
        switch (topic) {
          case 'blotter-data':
            if (this.blotterSheet) {
              this.blotterSheet.setCells(formTable.blotter(message), 'A2')
            }
            break
          case 'position-update':
            if (this.positionSheet) {
              this.positionSheet.setCells(formTable.positions(message), 'A2')
              this.positionSheet.setCells(formTable.ccy(message), 'A13')
            }
            break
        }
      }
    },
  }
}

const ExcelServiceInstance = new Excel()
export default ExcelServiceInstance
