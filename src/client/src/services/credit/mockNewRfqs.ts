import { concat, from } from "rxjs"
import {
  PASSED_QUOTE_STATE,
  QUOTE_PASSED_RFQ_UPDATE,
  RfqUpdate,
  Direction,
  RfqState,
  QUOTE_UPDATED_RFQ_UPDATE,
  RFQ_CREATED_RFQ_UPDATE,
  PENDING_WITH_PRICE_QUOTE_STATE,
  PENDING_WITHOUT_PRICE_QUOTE_STATE,
} from "@/generated/NewTradingGateway"

const dealerIdLength = 10
const AmountOfRFQs = 10
const mockRFQs: RfqUpdate[] = []

const StartState = () => {
  return from(constructMockStartStateRFQS())
}
const constructMockStartStateRFQS = () => {
  constructRfqCreatedRfqUpdate()
  constructRfqUpdate()
  addStateOfTheWorld()
  return mockRFQs
}

const randomNumberGenerator = (min: number, max: number) => {
  //min and max are inclusive
  return Math.floor(Math.random() * (max - min + 1) + min)
}
const randomQuoteBodyState = () => {
  const State = randomNumberGenerator(1, 2)
  switch (State) {
    case 1:
      return PENDING_WITH_PRICE_QUOTE_STATE
      break
    case 2:
      return PENDING_WITHOUT_PRICE_QUOTE_STATE
      break
    default:
      break
  }
}

const constructRfqCreatedRfqUpdate = () => {
  for (let i = 0; i < AmountOfRFQs; i++) {
    mockRFQs.push({
      payload: {
        id: i,
        instrumentId: i,
        quantity: randomNumberGenerator(1, 10000),
        direction: Direction.Buy,
        state: RfqState.Open,
        expirySecs: 120,
        creationTimestamp: BigInt(Date.now()),
      },
      type: RFQ_CREATED_RFQ_UPDATE,
    })
  }
}

const constructRfqUpdate = () => {
  for (let i = 0; i < AmountOfRFQs; i++) {
    for (let j = 0; j <= dealerIdLength; j++) {
      mockRFQs.push({
        payload: {
          id: Number(`${i}` + `${j}`),
          rfqId: i,
          dealerId: j,
          state: {
            type: randomQuoteBodyState() || PENDING_WITHOUT_PRICE_QUOTE_STATE,
            payload: randomNumberGenerator(1, 9999),
          },
        },
        type: QUOTE_UPDATED_RFQ_UPDATE,
      })
    }
  }
}

const constructPassOnRandomRFQ$ = () => {
  const PassRFQs = []
  for (let i = 0; i < AmountOfRFQs; i++) {
    for (let j = 0; j <= dealerIdLength; j += 2) {
      PassRFQs.push({
        payload: {
          id: Number(`${i}` + `${j}`),
          rfqId: i,
          dealerId: j,
          state: { type: PASSED_QUOTE_STATE },
        },
        type: QUOTE_PASSED_RFQ_UPDATE,
      })
    }
  }
  return from(PassRFQs)
}

const addStateOfTheWorld = () => {
  mockRFQs.unshift({ type: "startOfStateOfTheWorld" })
  mockRFQs.push({ type: "endOfStateOfTheWorld" })
}

export const Dealers = [
  {
    type: "added",
    payload: {
      id: 0,
      name: "J.P. Morgan",
    },
  },
  {
    type: "added",
    payload: {
      id: 1,
      name: "Wells Fargo",
    },
  },
  {
    type: "added",
    payload: {
      id: 2,
      name: "Bank of America",
    },
  },
  {
    type: "added",
    payload: {
      id: 3,
      name: "Morgan Stanley",
    },
  },
  {
    type: "added",
    payload: {
      id: 4,
      name: "Goldman Sachs",
    },
  },
  {
    type: "added",
    payload: {
      id: 5,
      name: "Citigroup",
    },
  },
  {
    type: "added",
    payload: {
      id: 6,
      name: "Ally",
    },
  },
  {
    type: "added",
    payload: {
      id: 7,
      name: "Bank of New York Mellon",
    },
  },
  {
    type: "added",
    payload: {
      id: 8,
      name: "TD Bank",
    },
  },
  {
    type: "added",
    payload: {
      id: 9,
      name: "UBS",
    },
  },
  {
    type: "added",
    payload: {
      id: 10,
      name: "Adaptive Bank",
    },
  },
]

export const mockCreditRFQS = concat(StartState(), constructPassOnRandomRFQ$())

export const mockCreditDealers$ = () => {
  return from(Dealers)
}
