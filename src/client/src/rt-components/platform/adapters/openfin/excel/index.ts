interface ExcelInterface {
  workbook: any
  worksheet: any
  publishExcel: (message: any) => void
  initExcel: () => void
}

const ExcelModule: ExcelInterface = {
  workbook: null,
  worksheet: null,

  initExcel: () => {
    // @ts-ignore
    const { ExcelService } = fin.desktop

    // @ts-ignore
    if (!fin.desktop.Excel) {
      ExcelService.init().catch((err: string) => console.log(err))
    }

    ExcelService.addEventListener('excelConnected', () => {
      console.log('excel init')
      // @ts-ignore
      const { Excel } = fin.desktop
      Excel.getWorkbooks((workbooks: any) => {
        if (!workbooks.length) {
          Excel.addWorkbook().then((res: any) => {
            this.workbook = res
          })
        } else {
          this.workbook = workbooks[0]
        }
      })
    })

    ExcelService.addEventListener('excelDisconnected', (data: any) => {
      console.log('Excel Disconnected: ' + data.connectionUuid)
    })
  },

  publishExcel: (message: any) => {
    // Forming worksheet if a workbook exist
    if (!this.worksheet && this.workbook) {
      this.workbook.getWorksheets((res: any) => {
        this.worksheet = res[0]
        styleWorksheet(this.worksheet)
      })
    }

    // If a worksheet exists and a message is received
    if (this.worksheet && message) {
      const keys = Object.keys(message[0])
      const values = message.map((item: any) => Object.values(item))
      this.worksheet.setCells([keys, ...values], 'A1')
    }
  },
}

async function styleWorksheet(worksheet: any) {
  await worksheet.formatRange('A1:K1', {
    border: { color: '0,0,0,1', style: 'continuous' },
    font: { color: '100,100,100,1', size: 12, bold: true, name: 'Verdana' },
    fill: { color: '#4472C4' },
  })
}

export default ExcelModule
