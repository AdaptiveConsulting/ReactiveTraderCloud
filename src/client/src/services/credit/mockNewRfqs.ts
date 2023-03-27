import { concat, concatMap, delay, from, of } from "rxjs"
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
} from "@/generated/TradingGateway"

const dealerIdLength = 10
const AmountOfRFQs = 10
const mockRFQs: RfqUpdate[] = []

const startState = () => {
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
        creationTimestamp: Date.now() as unknown as bigint,
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
            type: PENDING_WITH_PRICE_QUOTE_STATE,
            payload: randomNumberGenerator(1, 9999),
          },
        },
        type: QUOTE_UPDATED_RFQ_UPDATE,
      })
    }
  }
}

const constructPassOnRandomRFQ$ = () => {
  const PassRFQs: RfqUpdate[] = []
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
  return from(PassRFQs).pipe(
    concatMap((PassRFQ) => of(PassRFQ).pipe(delay(1000))),
  )
}

const addStateOfTheWorld = () => {
  mockRFQs.unshift({ type: "startOfStateOfTheWorld" })
  mockRFQs.push({ type: "endOfStateOfTheWorld" })
}

const mockCreditPassRFQs$ = constructPassOnRandomRFQ$()
const mockCreditRFQs$__ = startState()
const mockCreditRFQs$_ = concat(mockCreditRFQs$__, mockCreditPassRFQs$)
export const mockCreditRFQS = mockCreditRFQs$_.pipe(delay(1000))
