import { scan } from "rxjs"

import {
  ADDED_INSTRUMENT_UPDATE,
  InstrumentBody,
  InstrumentService,
  InstrumentUpdate,
  REMOVED_INSTRUMENT_UPDATE,
  START_OF_STATE_OF_THE_WORLD_INSTRUMENT_UPDATE,
} from "@/generated/TradingGateway"

import { withConnection } from "./withConnection"

export const creditInstruments$ = InstrumentService.subscribe().pipe(
  withConnection(),
  scan((acc: InstrumentBody[], update: InstrumentUpdate) => {
    switch (update.type) {
      case START_OF_STATE_OF_THE_WORLD_INSTRUMENT_UPDATE: {
        return []
      }
      case ADDED_INSTRUMENT_UPDATE: {
        return [...acc, update.payload]
      }
      case REMOVED_INSTRUMENT_UPDATE: {
        return acc.filter((instrument) => instrument.id !== update.payload)
      }
      // END_OF_STATE_OF_THE_WORLD_INSTRUMENT_UPDATE
      default: {
        return acc
      }
    }
  }, []),
)
