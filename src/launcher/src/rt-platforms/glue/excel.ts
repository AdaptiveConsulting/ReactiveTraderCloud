/* eslint-disable no-undef */

import { CurrencyPairPositionWithPrice } from 'rt-types'
import { ExcelApp } from '../excelApp'
import { openSheet, getAddinStatus, updateSheet } from './utils/excel'

class GlueExcelAdapter implements ExcelApp {
  readonly name = 'glue'
  open(): Promise<void> {
    return openSheet()
  }

  isOpen(): boolean {
    return getAddinStatus()
  }

  async publishPositions(positions: CurrencyPairPositionWithPrice[]): Promise<void> {
    return Promise.resolve()
  }

  async publishBlotter(blotterData: any): Promise<void> {
    return updateSheet(blotterData)
  }
}

export default GlueExcelAdapter
