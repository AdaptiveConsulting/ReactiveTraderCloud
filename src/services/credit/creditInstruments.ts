import { bind, shareLatest } from "@react-rxjs/core"
import {
  ADDED_INSTRUMENT_UPDATE,
  AddedInstrumentUpdate,
  InstrumentBody,
  InstrumentService,
  InstrumentUpdate,
  REMOVED_INSTRUMENT_UPDATE,
  RemovedInstrumentUpdate,
  START_OF_STATE_OF_THE_WORLD_INSTRUMENT_UPDATE,
} from "generated/TradingGateway"
import { of } from "rxjs"
import { map, scan, tap } from "rxjs/operators"

import { withConnection } from "../withConnection"

const isAddedInstrumentUpdate = (
  update: InstrumentUpdate,
): update is AddedInstrumentUpdate =>
  typeof (update as AddedInstrumentUpdate).payload === "object"

const isRemovedInstrumentUpdate = (
  update: InstrumentUpdate,
): update is RemovedInstrumentUpdate =>
  typeof (update as AddedInstrumentUpdate).payload === "number"

const reducer = (
  accum: Record<string, InstrumentBody>,
  update: InstrumentUpdate,
) => {
  if (update.type === START_OF_STATE_OF_THE_WORLD_INSTRUMENT_UPDATE) {
    return {}
  }
  if (
    update.type === ADDED_INSTRUMENT_UPDATE &&
    isAddedInstrumentUpdate(update)
  ) {
    return {
      ...accum,
      [update.payload.cusip]: update.payload,
    }
  }
  if (
    update.type === REMOVED_INSTRUMENT_UPDATE &&
    isRemovedInstrumentUpdate(update)
  ) {
    return Object.values(accum)
      .filter((instrument) => instrument.id !== update.payload)
      .reduce(
        (innerAccum, instrument) => ({
          ...innerAccum,
          [instrument.cusip]: instrument,
        }),
        {},
      )
  }
  return accum
}

export const [useCreditInstrumentsByCusip, creditInstrumentsByCusip$] = bind(
  InstrumentService.subscribe().pipe(
    withConnection(),
    scan(reducer, {} as Record<string, InstrumentBody>),
    shareLatest(),
  ),
  {},
)

export const [useCreditInstruments, creditInstruments$] = bind(
  creditInstrumentsByCusip$.pipe(
    map((creditInstrumentsByCusip) => Object.values(creditInstrumentsByCusip)),
  ),
  [],
)

export const [useCreditInstrumentById, creditInstrumentById$] = bind(
  (instrumentId: number) =>
    creditInstruments$.pipe(
      map((creditInstruments) =>
        creditInstruments.find((instrument) => instrument.id === instrumentId),
      ),
    ),
)
