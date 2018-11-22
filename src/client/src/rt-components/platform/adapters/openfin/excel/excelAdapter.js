let workbook
let worksheet

export const initExcel = () => {
  fin.desktop.ExcelService.init().then(() => {
    const ExcelInstance = fin.desktop.Excel
    ExcelInstance.addWorkbook().then(res => (workbook = res))
  })
}

export const publishExcel = message => {
  if (workbook) {
    workbook.getWorksheets(res => (worksheet = res[0]))
  }
  if (worksheet && message) {
    const keys = Object.keys(message[0])
    const values = message.map(item => Object.values(item))
    worksheet.setCells([keys, ...values], 'A1')
  }
}
