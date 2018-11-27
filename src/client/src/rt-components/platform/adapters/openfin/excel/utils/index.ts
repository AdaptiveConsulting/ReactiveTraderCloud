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
