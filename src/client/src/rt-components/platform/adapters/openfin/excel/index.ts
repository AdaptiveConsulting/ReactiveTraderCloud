interface ExcelInterface {
  workbook: any
  worksheet: any
  publishExcel: (message: any) => void
  initExcel: () => void
}

const Excel: ExcelInterface = {
  workbook: null,
  worksheet: null,

  initExcel: () => {
    // @ts-ignore
    fin.desktop.ExcelService.init().then(() => {
      // @ts-ignore
      const ExcelInstance = fin.desktop.Excel
      ExcelInstance.addWorkbook().then((res: any) => (this.workbook = res))
    })
  },

  publishExcel: (message: any) => {
    if (this.workbook) {
      this.workbook.getWorksheets((res: any) => (this.worksheet = res[0]))
    }
    if (this.worksheet && message) {
      const keys = Object.keys(message[0])
      const values = message.map((item: any) => Object.values(item))
      this.worksheet.setCells([keys, ...values], 'A1')
    }
  },
}

export default Excel
