import {
  DealerBody,
  InstrumentBody,
  QuoteBody,
  RfqBody,
} from "@/generated/TradingGateway"

export interface RfqDetails extends RfqBody {
  instrument: InstrumentBody | null
  dealers: DealerBody[]
  quotes: QuoteBody[]
}