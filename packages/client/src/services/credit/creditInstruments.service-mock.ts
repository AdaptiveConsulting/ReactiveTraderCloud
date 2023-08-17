import { bind } from "@react-rxjs/core"
import { InstrumentBody } from "generated/TradingGateway"
import { of } from "rxjs"
import { map, scan } from "rxjs/operators"

const fakeInstruments: InstrumentBody[] = [
  {
    id: 0,
    name: "ORCL 4.755 08/15/2026",
    cusip: "68389X105",
    ticker: "ORCL",
    maturity: "20250815",
    interestRate: 4.755,
    benchmark: "5Y UST 1.500 08/2026",
  },
  {
    id: 1,
    name: "AAPL 4.111 01/12/2024",
    cusip: "037833100",
    ticker: "AAPL",
    maturity: "20240112",
    interestRate: 4.111,
    benchmark: "2Y UST 2.250 01/2024",
  },
  {
    id: 2,
    name: "GOOGL 5.001 01/01/2024",
    cusip: "38259P508",
    ticker: "GOOGL",
    maturity: "20240101",
    interestRate: 5.001,
    benchmark: "2Y UST 2.500 01/2024",
  },
  {
    id: 3,
    name: "MSFT 4.111 10/10/2024",
    cusip: "594918104",
    ticker: "MSFT",
    maturity: "20241010",
    interestRate: 4.111,
    benchmark: "2Y UST 1.500 10/2024",
  },
  {
    id: 4,
    name: "AMZN 5.122 06/15/2028",
    cusip: "023135106",
    ticker: "AMZN",
    maturity: "20280615",
    interestRate: 5.122,
    benchmark: "7Y UST 1.250 06/2028",
  },
  {
    id: 5,
    name: "BRK 3.755 09/01/2024",
    cusip: "084670702",
    ticker: "BRK",
    maturity: "20240901",
    interestRate: 3.755,
    benchmark: "2Y UST 2.125 09/2024",
  },
  {
    id: 6,
    name: "FB 5.550 10/15/2023",
    cusip: "30303M102",
    ticker: "FB",
    maturity: "20231015",
    interestRate: 5.55,
    benchmark: "2Y UST 2.875 10/2023",
  },
  {
    id: 7,
    name: "WMT 4.470 01/07/2024",
    cusip: "931142103",
    ticker: "WMT",
    maturity: "20240107",
    interestRate: 4.47,
    benchmark: "2Y UST 2.750 02/2024",
  },
  {
    id: 8,
    name: "XOM 5.001 04/01/2024",
    cusip: "30231G102",
    ticker: "XOM",
    maturity: "20240401",
    interestRate: 5.001,
    benchmark: "2Y UST 2.250 05/2024",
  },
  {
    id: 9,
    name: "PFE 4.850 07/01/2024",
    cusip: "717081103",
    ticker: "PFE",
    maturity: "20240701",
    interestRate: 4.85,
    benchmark: "2Y UST 2.125 08/2024",
  },
  {
    id: 10,
    name: "KO 2.957 08/27/2025",
    cusip: "191216CN8",
    ticker: "KO",
    maturity: "20250827",
    interestRate: 2.957,
    benchmark: "3Y UST 2.875 08/2025",
  },
]

export const creditInstruments$ = of(fakeInstruments)

export const [useCreditInstrumentsByCusip, creditInstrumentsByCusip$] = bind<
  Record<string, InstrumentBody>
>(
  creditInstruments$.pipe(
    scan((acc, instruments) => {
      instruments.forEach((instrument) => {
        acc[instrument.cusip] = {
          ...acc[instrument.cusip],
          ...instrument,
        }
      })
      return acc
    }, {} as Record<string, InstrumentBody>),
  ),
  {},
)

export const [useCreditInstrumentById, creditInstrumentById$] = bind(
  (instrumentId: number) =>
    creditInstruments$.pipe(
      map((creditInstruments) =>
        creditInstruments.find((instrument) => instrument.id === instrumentId),
      ),
    ),
)
