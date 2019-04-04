import { CurrencyPairPositionWithPrice } from 'rt-types';

export interface ExcelAdapter {
  openExcel(): Promise<void>
  isSpreadsheetOpen(): boolean
  publishPositions(positions: CurrencyPairPositionWithPrice[]): Promise<void>
  publishBlotter<T extends any>(blotterData: T): Promise<void>
}
