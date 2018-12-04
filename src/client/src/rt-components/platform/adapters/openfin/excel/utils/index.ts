export async function styleWorksheet(worksheet: any) {
  await worksheet.formatRange('A1:K1', {
    border: { color: '0,0,0,1', style: 'continuous' },
    font: { color: '100,100,100,1', size: 12, bold: true, name: 'Verdana' },
    AutoFit: true,
  })
}

export function logCells(worksheet: any) {
  worksheet.getCells('A1', 3, 2).then((res: any) => console.log(res))
}

export const formTable = {
  positions: (data: any, initialBid = 10000, initialOffer = 100000) =>
    data.map((item: any) => [item.symbol, initialBid, initialOffer, item.baseTradedAmount, item.basePnl]),
  ccy: (data: any) => data.map((item: any) => [item.symbol.slice(0, 3), item.baseTradedAmount]),
  blotter: (data: any) =>
    data.map((item: any) => [
      item.tradeId,
      item.tradeDate,
      item.direction,
      item.symbol,
      item.notional,
      ,
      item.spotRate,
      item.status,
      item.valueDate,
      item.traderName,
    ]),
}
