import { Glue42Office } from 'glue4office'

let sheet: Glue42Office.Excel.Sheet
let dataLength: number

export interface BlotterData {
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
  window.glue4office ? window.glue4office.excel.addinStatus : false

export const openSheet = async (blotterData: BlotterData[] = []) => {
  const options = {
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
  sheet = await window.glue4office.excel.openSheet(options)
  dataLength = blotterData.length
  return sheet
}

export const updateSheet = async (blotterData: BlotterData[]) => {
  if (dataLength === blotterData.length) {
    // don't update if the number of rows is the same
    return
  }
  if (!sheet) {
    await openSheet(blotterData)
    return
  }

  // TODO Send deltas only?
  await sheet.update(convertBlotterData(blotterData))
  dataLength = blotterData.length
}

/**
 * Converts the blotter data in human readable format where necessary.
 * New record is displayed on top.
 */
const convertBlotterData = (blotterData: BlotterData[]) =>
  blotterData
    .map(data => {
      data.status = `${data.status.charAt(0).toUpperCase()}${data.status.slice(1)}`
      data.tradeDate = convertTradeDate(data.tradeDate)
      return data
    })
    .reverse()

const convertTradeDate = (tradeDate: string) => {
  const date = new Date(tradeDate)
  const months = [
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
  const hours = date.getHours() < 10 ? `0${date.getHours()}` : `${date.getHours()}`
  const minutes = date.getMinutes() < 10 ? `0${date.getMinutes()}` : `${date.getMinutes()}`
  const seconds = date.getSeconds() < 10 ? `0${date.getSeconds()}` : `${date.getSeconds()}`

  return `${date.getDate()}-${months[date.getMonth()]} ${hours}:${minutes}:${seconds}`
}
