let worksheet
let connectionStatus = false

fin.desktop.ExcelService.addEventListener('excelConnected', excelConnected)

export const initExcel = () => {
  fin.desktop.ExcelService.init()
}

const excelConnected = () => {
  const excelInstance = fin.desktop.Excel
  fin.desktop.Excel.addWorkbook()
  excelInstance.addEventListener('workbookAdded', onWorkbookAdded)
}

const onWorkbookAdded = event => {
  const workbook = event.workbook
  workbook.addWorksheet()
  workbook.addEventListener('sheetAdded', onWorksheetAdded)
}

const onWorksheetAdded = event => {
  worksheet = event.worksheet
}

export const publishExcel = message => {
  if (worksheet && message) {
    const keys = Object.keys(message[0])
    const values = message.map(item => Object.values(item))
    worksheet.setCells([keys, ...values], 'A1')
  }
}
