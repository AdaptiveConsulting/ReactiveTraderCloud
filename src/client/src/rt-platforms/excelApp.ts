import { CurrencyPairPositionWithPrice } from '../rt-types'
import { getOpenFinPlatform } from './platform'

export type ExcelAdapterName = 'legacy' | 'JS'

/**
 * Feature flag to switch between JS and legacy adapter.
 * In theory both could coexist creating a 'composed excel adapter' aggregating both adapters.
 *
 * As of Apr 2019 OpenFin Excel JS API does not fully meet our needs so we revert back to the legacy .NET one
 */
export const EXCEL_ADAPTER_NAME: ExcelAdapterName = 'legacy' as ExcelAdapterName

export interface ExcelApp {
  readonly name: string

  open(): Promise<void>

  isOpen(): boolean

  publishPositions(positions: CurrencyPairPositionWithPrice[]): Promise<void>

  publishBlotter<T extends any>(blotterData: T): Promise<void>
}

class NoopExcelAppImpl implements ExcelApp {
  readonly name = 'NoopExcelAppImpl'

  isOpen(): boolean {
    return false
  }

  open(): Promise<void> {
    return Promise.resolve()
  }

  publishBlotter<T extends any>(blotterData: T): Promise<void> {
    return Promise.resolve()
  }

  publishPositions(positions: CurrencyPairPositionWithPrice[]): Promise<void> {
    return Promise.resolve()
  }
}

export const createExcelApp = async (platformName: string) => {
  if (platformName === 'openfin') {
    const { JSExcelAdapter, LegacyExcelAdapter } = await getOpenFinPlatform()
    return EXCEL_ADAPTER_NAME === 'legacy' ? new LegacyExcelAdapter() : new JSExcelAdapter()
  }

  return new NoopExcelAppImpl()
}
