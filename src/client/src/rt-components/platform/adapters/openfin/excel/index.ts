import { default as JSExcelAdapter } from './jsExcelAdapter'
import { default as LegacyExcelAdapter } from './legacyExcelAdapter'
import { ExcelAdapter, ExcelAdapterName } from './types'

export type ExcelAdapter = ExcelAdapter
export type ExcelAdapterName = ExcelAdapterName

/**
 * Feature flag to switch between JS and legacy adapter.
 * In theory both could coexist creating a 'composed excel adapter' aggregating both adapters.
 * 
 * As of Apr 2019 OpenFin Excel JS API does not fully meet our needs so we revert back to the legacy .NET one
 */
const  EXCEL_ADAPTER_NAME: ExcelAdapterName = 'legacy' as ExcelAdapterName

export const excelAdapter: ExcelAdapter = EXCEL_ADAPTER_NAME === 'legacy'
  ? new LegacyExcelAdapter()
  : new JSExcelAdapter()
