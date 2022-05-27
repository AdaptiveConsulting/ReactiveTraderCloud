import { bind } from "@react-rxjs/core"
import { scan } from "rxjs/operators"
import { InstrumentBody } from "@/generated/TradingGateway"
import { from } from "rxjs"

const fakeInstruments: InstrumentBody[] = [
  {
    id: 0,
    name: "KHC 3.875 02/15/27 ",
    cusip: "10077LBC9",
    ticker: "KHC",
    maturity: "20270215",
    interestRate: 0.03875,
  },
  {
    id: 1,
    name: "MCF 7.875 02/15/30 ",
    cusip: "20077LBC9",
    ticker: "MCF",
    maturity: "20300215",
    interestRate: 0.07875,
  },
  {
    id: 2,
    name: "TWX 4.875 02/15/27 ",
    cusip: "30077LBC9",
    ticker: "TWX",
    maturity: "20270215",
    interestRate: 0.04875,
  },
]

const creditInstruments$ = from(fakeInstruments)

export const [useCreditInstrumentsByCusip, creditInstrumentsByCusip$] = bind<
  Record<string, InstrumentBody>
>(
  creditInstruments$.pipe(
    scan(
      (acc, instrument) => ({
        ...acc,
        [instrument.cusip]: instrument,
      }),
      {},
    ),
  ),
  {},
)
