import { concat, delay, from } from "rxjs"
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
    case 2:
      return PENDING_WITHOUT_PRICE_QUOTE_STATE
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

const mockCreditRFQS_ = concat(StartState(), constructPassOnRandomRFQ$())

export const mockCreditRFQS = mockCreditRFQS_.pipe(delay(1000))
