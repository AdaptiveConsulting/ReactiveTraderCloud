/* eslint-disable no-restricted-globals */
/* eslint-disable no-undef */

import { formTable, delay } from './utils/index'
import { Trade, CurrencyPairPositionWithPrice } from 'rt-types'
import { platform } from 'rt-components'
import { InteropTopics } from '../../../types'
import { ExcelAdapter } from './types'

const EXCEL_HOST_URL = `${location.protocol}//${location.host}/static/excel`
const EXCEL_FILE_NAME = 'RTExcel.xlsx'
// const EXCEL_FILE_NAME = 'RTExcel.xlsm' // xlsm contains VBA macros

const RTExcelConfig = {
  Blotter: 'A2',
  Positions: 'A2',
  CcyPairs: 'H2',
  ClosePositionButton: 'F',
  ClosePositionButtonColumn: 6, // Index of 'F'
  ClosePositionPlaceholder: 'M',
  ClosePositionPlaceholderColumn: 13, // Index of 'M'
}

class JSExcelAdapter implements ExcelAdapter {
  rtWorkbook: fin.ExcelWorkbook
  blotterSheet: fin.ExcelWorksheet
  positionsSheet: fin.ExcelWorksheet
  readonly name = 'JS'

  isSpreadsheetOpen = () => {
    return !!this.rtWorkbook && !!this.positionsSheet
  }

  /**
   * Ensure the OpenFin Excel service is initialized and the spreadsheet loaded
   */
  openExcel = async () => {
    if (typeof fin.desktop.ExcelService === 'undefined' || !fin.desktop.ExcelService) {
      throw Error('fin.desktop.ExcelService not available! Make sure the library is loaded')
    }

    await fin.desktop.ExcelService.init()
    await fin.desktop.Excel.run()

    try {
      this.rtWorkbook = await fin.desktop.Excel.openWorkbook(`${EXCEL_HOST_URL}/${EXCEL_FILE_NAME}`)
    } catch {
      const wbs = await fin.desktop.Excel.getWorkbooks()
      this.rtWorkbook = wbs.find(wb => wb.name === EXCEL_FILE_NAME)
    }

    const worksheets = await this.rtWorkbook.getWorksheets()
    this.blotterSheet = worksheets.find(ws => ws.name === 'Blotter')
    this.positionsSheet = worksheets.find(ws => ws.name === 'Positions')
    fin.desktop.Excel.addEventListener('workbookClosed', this.onWorkbookClosed)
    this.positionsSheet.addEventListener('sheetChanged', this.onPositionsSheetChanged)
    this.positionsSheet.addEventListener('selectionChanged', this.onPositionsSheetSelectionChanged)
  }

  onWorkbookClosed = ({ workbook }: { workbook: fin.ExcelWorkbook }) => {
    if (workbook && workbook.name === EXCEL_FILE_NAME) {
      if (this.positionsSheet) {
        this.positionsSheet.removeEventListener('sheetChanged', this.onWorkbookClosed)
        this.positionsSheet.removeEventListener(
          'selectionChanged',
          this.onPositionsSheetSelectionChanged,
        )
      }
      this.blotterSheet = null
      this.positionsSheet = null
      this.rtWorkbook = null
    }
  }

  /**
   * Triggered when the user changes the selection of cell(s) in Excel
   * We are simulating the 'Close position' buttons with plain cells so we detect clicks this way
   */
  onPositionsSheetSelectionChanged = async ({ data }: fin.WorksheetSelectionChangedEventArgs) => {
    if (!this.positionsSheet || !platform.hasFeature('interop')) {
      return
    }

    if (
      // Make sure only one cell from the Trade column is selected
      data.height !== 1 ||
      data.width !== 1 ||
      data.column !== RTExcelConfig.ClosePositionButtonColumn ||
      data.row < 2
    ) {
      return
    }

    if (data.value !== 'Close position') {
      // Empty cell (i.e. row with no data) or already closing
      return
    }

    await this.positionsSheet.setCells(
      [['Closing']],
      `${RTExcelConfig.ClosePositionPlaceholder}${data.row}`,
    )
    const [positionData] = await this.positionsSheet.getCells(`A${data.row}`, 4, 0)
    const symbol = positionData[0].value
    const amount = Number(positionData[3].value) || 0
    if (amount !== 0) {
      platform.interop.publish(InteropTopics.ClosePosition, { amount, symbol })
      // Give enough time to execute the trade and the position to go to 0 before displaying the 'Close position' button again
      await delay(5000)
      await this.positionsSheet.setCells(
        [['']],
        `${RTExcelConfig.ClosePositionPlaceholder}${data.row}`,
      )
    }
  }

  /* 
    Alternative approach: ActiveX button in excel to change the value of a particular cell via
    VBA macros and pick up the change here. Currently the favoured approach is to detect the
    selection of the "Close position" cell (styled as a button in Excel)
  */
  onPositionsSheetChanged = ({ data }: fin.WorksheetChangedEventArgs) => {
    if (!this.positionsSheet) {
      return
    }
    if (
      data.height === 1 &&
      data.width === 1 &&
      data.column === RTExcelConfig.ClosePositionPlaceholderColumn
    ) {
    }
  }

  publishPositions = async (positions: CurrencyPairPositionWithPrice[]) => {
    if (!this.isSpreadsheetOpen() || !this.positionsSheet) {
      return
    }

    await this.positionsSheet.setCells(formTable.positions(positions), RTExcelConfig.Positions)
    await this.positionsSheet.setCells(formTable.ccy(positions), RTExcelConfig.CcyPairs)
  }

  publishBlotter = async (blotterData: any) => {
    if (!this.isSpreadsheetOpen() || !this.blotterSheet) {
      return
    }

    // Clear entire table to remove rogue entries after blotter resets
    await this.blotterSheet.clearRangeContents('A2:J200')

    const blotterCellsData = formTable.blotter(blotterData as Trade[])
    await this.blotterSheet.setCells(blotterCellsData, RTExcelConfig.Blotter)
  }
}

export default JSExcelAdapter
