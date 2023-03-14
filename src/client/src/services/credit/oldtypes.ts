import {
  DealerBody,
  Direction,
  InstrumentBody,
  QuoteBody,
  RfqBody,
} from "@/generated/TradingGateway"

export interface RfqDetails extends RfqBody {
  instrument: InstrumentBody | null
  dealers: DealerBody[]
  quotes: QuoteBody[]
}

export interface QuoteDetails extends QuoteBody {
  instrument: InstrumentBody | null
  dealer: DealerBody | null
  direction: Direction
  quantity: number
}
