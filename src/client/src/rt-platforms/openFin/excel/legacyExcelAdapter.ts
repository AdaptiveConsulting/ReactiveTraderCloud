/* eslint-disable no-undef */

import { CurrencyPairPositionWithPrice, Trade } from 'rt-types'

import { InteropTopics } from '../../types'
import { ExcelApp } from '../../excelApp'

class LegacyExcelAdapter implements ExcelApp {
  readonly name = 'legacy'
  isOpen = () => {
    // Assume it's open - data published to the bus will be just ignored if not
    // Process could be improved and actually check if ReactiveTraderExcel.xlsx is open
    return true
  }

  open = async () => {
    // Legacy adapter just assumes it's running.
    // Process could be improved and actually try to launch ReactiveTraderExcel.xlsx from here
  }

  publishPositions = async (positions: CurrencyPairPositionWithPrice[]) => {
    fin.desktop.InterApplicationBus.publish(InteropTopics.Analytics, positions)
  }

  publishBlotter = async (blotterData: any) => {
    fin.desktop.InterApplicationBus.publish(InteropTopics.Blotter, blotterData as Trade[])
  }
}

export default LegacyExcelAdapter
