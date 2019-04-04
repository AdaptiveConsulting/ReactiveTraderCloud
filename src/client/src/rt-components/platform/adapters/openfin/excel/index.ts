import { default as JSExcelAdapter } from './excelAdapter'
import { default as LegacyExcelAdapter } from './legacyExcelAdapter'
import { ExcelAdapter } from './types'

export type ExcelAdapter = ExcelAdapter

/**
 * Feature flag to switch between JS and legacy adapter.
 * In theory both could coexist creating a 'composed excel adapter' aggregating both adapters.
 * 
 * As of Apr 2019 OpenFin Excel JS API does not fully meet our needs so we revert back to the legacy .NET one
 */
const USE_LEGACY_EXCEL_ADAPTER = true

export const excelAdapter: ExcelAdapter = USE_LEGACY_EXCEL_ADAPTER
  ? new LegacyExcelAdapter()
  : new JSExcelAdapter()
