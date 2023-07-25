import { bind } from "@react-rxjs/core"
import { DealerBody } from "generated/TradingGateway"
import { from } from "rxjs"
import { scan } from "rxjs/operators"

const fakeDealers: DealerBody[] = [
  {
    id: 0,
    name: "J.P. Morgan",
  },
  {
    id: 1,
    name: "Wells Fargo",
  },
  {
    id: 2,
    name: "Bank of America",
  },
  {
    id: 3,
    name: "Morgan Stanley",
  },
  {
    id: 4,
    name: "Goldman Sachs",
  },
  {
    id: 5,
    name: "Citigroup",
  },
  {
    id: 6,
    name: "TD Bank",
  },
  {
    id: 7,
    name: "UBS",
  },
  {
    id: 8,
    name: "Bank of New York Mellon",
  },
  {
    id: 9,
    name: "Capital One",
  },
]

const fakeCreditDealers$ = from(fakeDealers)

export const [useCreditDealers, creditDealers$] = bind<DealerBody[]>(
  fakeCreditDealers$.pipe(
    scan<DealerBody, DealerBody[]>((acc, dealer) => {
      return [...acc, dealer]
    }, []),
  ),
  [],
)
