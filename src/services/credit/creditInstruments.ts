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

// export const [useCreditInstrumentsByCusip, creditInstrumentsByCusip$] = bind(
//   InstrumentService.subscribe().pipe(
//     withConnection(),
//     scan(reducer, {} as Record<string, InstrumentBody>),
//     shareLatest(),
//     tap((instrument) => console.log(instrument)),
//   ),
//   {},
// )

const instruments = {
  "037833100": {
    id: 0,
    name: "AAPL 4.111 01/12/2024",
    cusip: "037833100",
    ticker: "AAPL",
    maturity: "20240112",
    interestRate: 4.111,
    benchmark: "2Y UST 2.250 01/2024",
  },
  "38259P508": {
    id: 1,
    name: "AAPL 5.550 10/15/2023",
    cusip: "30303M102",
    ticker: "AAPL",
    maturity: "20231015",
    interestRate: 5.55,
    benchmark: "2Y UST 2.875 10/2023",
  },
  "594918104": {
    id: 2,
    name: "AAPL 2.957 08/27/2025",
    cusip: "191216CN8",
    ticker: "AAPL",
    maturity: "20250827",
    interestRate: 2.957,
    benchmark: "3Y UST 2.875 08/2025",
  },
  "023135106": {
    id: 3,
    name: "AAPL 5.122 06/15/2028",
    cusip: "023135106",
    ticker: "AAPL",
    maturity: "20280615",
    interestRate: 5.122,
    benchmark: "7Y UST 1.250 06/2028",
  },
}

export const [useCreditInstrumentsByCusip, creditInstrumentsByCusip$] = bind(
  of(instruments),
  instruments,
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
