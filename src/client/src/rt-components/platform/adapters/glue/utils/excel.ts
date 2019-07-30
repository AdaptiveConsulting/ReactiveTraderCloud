import { Glue42Office } from 'glue4office'

let sheet: Glue42Office.Excel.Sheet
let dataLength: number

interface IBlotterData {
  dealtCurrency: string
  direction: string
  notional: string
  spotRate: number
  status: string
  symbol: string
  termsCurrency: string
  tradeDate: string
  tradeId: string
  traderName: string
  valueDate: string
}

export const getAddinStatus = () =>
  (window as any).glue4office ? (window as any).glue4office.excel.addinStatus : false

/**
 * Opens a new sheet in excel with the provided blotter data
 * @param {IBlotterData[]} blotterData
 * @return {Promise<Glue42Office.Excel.Sheet>}
 */
export const openSheet = async (blotterData: IBlotterData[] = []) => {
  const options: any = {
    columnConfig: [
      { header: 'Trade ID', fieldName: 'tradeId', width: 11 },
      { header: 'Status', fieldName: 'status', width: 10 },
      { header: 'Date', fieldName: 'tradeDate', width: 19 },
      { header: 'Direction', fieldName: 'direction', width: 12 },
      { header: 'CCYCCY', fieldName: 'symbol', width: 11 },
      { header: 'Dealt CCY', fieldName: 'dealtCurrency', width: 12 },
      { header: 'Notional', fieldName: 'notional', width: 11 },
      { header: 'Rate', fieldName: 'spotRate', width: 9 },
      { header: 'Value Date', fieldName: 'valueDate', width: 13 },
      { header: 'Trader', fieldName: 'traderName', width: 13 },
    ],
    data: convertBlotterData(blotterData),
    options: {
      worksheet: 'Executed Trades',
      workbook: 'ReactiveTrader',
      tableHeaders: true,
      tableRowStripes: true,
      tableStyle: 'Business Table',
      sendAsTable: true,
    },
  }
  sheet = await (window as any).glue4office.excel.openSheet(options)
  dataLength = blotterData.length
  return sheet
}

/**
 * Updates the sheet in excel with the provided blotter data
 * @param {IBlotterData[]} blotterData
 * @return {Promise<void>}
 */
export const updateSheet = async (blotterData: IBlotterData[]) => {
  if (dataLength === blotterData.length) {
    return
  }
  if (!sheet) {
    openSheet(blotterData)
    return
  }

  // TODO Send deltas only?
  await sheet.update(convertBlotterData(blotterData))
  dataLength = blotterData.length
}

/**
 * Converts the blotter data in human readable format where necessary
 * New record is displayed on top
 * @param {IBlotterData[]} blotterData
 * @return {IBlotterData[]}
 */
const convertBlotterData = (blotterData: IBlotterData[]) => {
  return blotterData
    .map((data: any) => {
      data.status = data.status.charAt(0).toUpperCase() + data.status.slice(1)
      data.tradeDate = convertTradeDate(data.tradeDate)
      return data
    })
    .reverse()
}

const convertTradeDate = (tradeDate: string): string => {
  const date = new Date(tradeDate)
  const months: string[] = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ]
  const hours: string = date.getHours() < 10 ? `0${date.getHours()}` : `${date.getHours()}`
  const minutes: string = date.getMinutes() < 10 ? `0${date.getMinutes()}` : `${date.getMinutes()}`
  const seconds: string = date.getSeconds() < 10 ? `0${date.getSeconds()}` : `${date.getSeconds()}`
  return `${date.getDate()}-${months[date.getMonth()]} ${hours}:${minutes}:${seconds}`
}
