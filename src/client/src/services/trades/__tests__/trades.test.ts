import { Direction, QuoteState, RfqState } from "@/generated/TradingGateway"
import { RfqDetails } from "@/services/credit/creditRfqs"
import { BehaviorSubject } from "rxjs"
import * as creditService from "../../credit"
import * as tradesService from "../../trades"

jest.mock("../../credit")

const rfqs: Record<number, RfqDetails> = {
  "2": {
    id: 2,
    instrumentId: 0,
    dealerIds: [10, 0, 6, 9],
    quantity: 44000,
    direction: Direction.Buy,
    state: RfqState.Closed,
    expirySecs: 120,
    creationTimestamp: BigInt("1666006087128"),
    instrument: {
      id: 0,
      name: "ORCL 4.755 08/15/2026",
      cusip: "68389X105",
      ticker: "ORCL",
      maturity: "2036-03-18",
      interestRate: 10,
      benchmark: "5Y UST 1.500 08/2026",
    },
    dealers: [
      {
        id: 6,
        name: "TD Bank",
      },
      {
        id: 9,
        name: "Capital One",
      },
      {
        id: 10,
        name: "Adaptive Bank",
      },
      {
        id: 0,
        name: "J.P. Morgan",
      },
    ],
    quotes: [
      {
        id: 8,
        rfqId: 2,
        dealerId: 9,
        price: 95,
        state: QuoteState.Rejected,
      },
      {
        id: 9,
        rfqId: 2,
        dealerId: 6,
        price: 101,
        state: QuoteState.Rejected,
      },
      {
        id: 10,
        rfqId: 2,
        dealerId: 10,
        price: 22,
        state: QuoteState.Accepted,
      },
    ],
  },
  "3": {
    id: 3,
    instrumentId: 1,
    dealerIds: [10, 0, 1],
    quantity: 99000,
    direction: Direction.Buy,
    state: RfqState.Open,
    expirySecs: 120,
    creationTimestamp: BigInt("1666010922569"),
    instrument: {
      id: 1,
      name: "AAPL 4.111 01/12/2024",
      cusip: "037833100",
      ticker: "AAPL",
      maturity: "2036-03-18",
      interestRate: 10,
      benchmark: "2Y UST 2.250 01/2024",
    },
    dealers: [
      {
        id: 0,
        name: "J.P. Morgan",
      },
      {
        id: 10,
        name: "Adaptive Bank",
      },
      {
        id: 1,
        name: "Wells Fargo",
      },
    ],
    quotes: [
      {
        id: 11,
        rfqId: 3,
        dealerId: 10,
        price: 88,
        state: QuoteState.Accepted,
      },
      {
        id: 12,
        rfqId: 3,
        dealerId: 0,
        price: 93,
        state: QuoteState.Rejected,
      },
    ],
  },
}

describe("trades", () => {
  describe("credit", () => {
    beforeEach(() => {
      const creditRfqs$ = new BehaviorSubject<Record<number, RfqDetails>>(rfqs)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const creditServiceMock = creditService as any
      creditServiceMock.__creditRfqsById(creditRfqs$)
    })
    it("should convert RFQ and Quote details to trades stream", (done) => {
      tradesService.creditTrades$.subscribe((value) => {
        expect(value).toEqual([
          {
            tradeId: "3",
            status: "Accepted",
            tradeDate: expect.any(Date),
            direction: "Buy",
            counterParty: "Adaptive Bank",
            cusip: "037833100",
            security: "AAPL",
            quantity: 99000,
            orderType: "AON",
            unitPrice: 88,
          },
          {
            tradeId: "2",
            status: "Accepted",
            tradeDate: expect.any(Date),
            direction: "Buy",
            counterParty: "Adaptive Bank",
            cusip: "68389X105",
            security: "ORCL",
            quantity: 44000,
            orderType: "AON",
            unitPrice: 22,
          },
        ])
        done()
      })
    })
  })
})
