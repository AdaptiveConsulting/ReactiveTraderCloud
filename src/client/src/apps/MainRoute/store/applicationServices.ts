import { ExcelApp, LimitChecker, Platform } from 'rt-platforms'
import { WsConnection } from 'rt-system'
import { User } from 'rt-types'
import { connection$, referenceDataService$, serviceClient, serviceStatus$ } from './singleServices'

export interface ApplicationProps {
  broker: WsConnection
  platform: Platform
  limitChecker: LimitChecker
  excelApp: ExcelApp
  user: User
}

export function createApplicationServices({ limitChecker, excelApp, platform }: ApplicationProps) {
  return {
    referenceDataService$,
    platform,
    limitChecker,
    excelApp,
    serviceClient,
    serviceStatus$,
    connection$,
  }
}

export type ApplicationDependencies = ReturnType<typeof createApplicationServices>
