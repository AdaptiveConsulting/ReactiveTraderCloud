import { WorkerInfo } from "@playwright/test"

export const isOpenFin = (workerInfo: WorkerInfo) =>
  workerInfo.project.name === "openfin"

export const isRfqTilesResponsive = (workerInfo: WorkerInfo) =>
  workerInfo.project.name === "webResponsive"

export enum ExpectTimeout {
  MEDIUM = 15000,
  LONG = 30000,
}
export enum TestTimeout {
  NORMAL = 60000,
  EXTENDED = 90000,
}
