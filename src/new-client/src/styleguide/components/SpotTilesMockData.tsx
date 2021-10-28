import { PriceMovementType } from "@/services/prices"
import { QuoteStateStage } from "@/App/LiveRates/Tile/Rfq"
export interface MockProps {
  isAnalytics?: boolean
  spotTileData: any
  currencyPair: any
  supportsTearOut?: boolean
  hover?: boolean
  activeColorLeft?: boolean
  activeColorRight?: boolean
  disabledInput?: boolean
  isStale?: boolean
  isExecuting?: boolean
  faded?: boolean
  resetInput?: boolean
  buttonText?: string
  awaiting?: boolean
  inputTimer?: boolean
  startTimer?: number
  rfqStateRight?: any
  rfqStateLeft?: any
  isExpired?: boolean
}

interface SpotPriceTick {
  ask: number
  bid: number
  mid: number
  creationTimestamp: number
  symbol: string
  valueDate: string
  priceMovementType?: PriceMovementType
  priceStale?: boolean
}

const priceTick: SpotPriceTick = {
  ask: 12.5,
  bid: 14.0,
  mid: 13.0,
  creationTimestamp: 20052,
  symbol: "EURCAD",
  valueDate: "2018-08-04T00:00:00Z",
  priceMovementType: PriceMovementType.UP,
  priceStale: true,
}

export const generateHistoricPrices: (
  totalPricePrick: number,
) => SpotPriceTick[] = (totalPricePrick) => {
  const historicPrices = []
  for (let counter = 0; counter < totalPricePrick; counter++) {
    const mid = Math.random() * priceTick.mid
    const finalMid = Math.random() < 0.3 ? mid * -1 + 0.5 : mid
    historicPrices.push({ ...priceTick, mid: finalMid })
  }

  return historicPrices
}

export const spotTileData = {
  notional: "1,000,000",
  isTradeExecutionInFlight: false,
  price: {
    ask: 184.775,
    bid: 184.767,
    creationTimestamp: 31566750203189236,
    mid: 184.771,
    priceMovementType: PriceMovementType.DOWN,
    symbol: "GBPJPY",
    valueDate: "2018-08-04T00:00:00Z",
  },
  // historicPrices: generateHistoricPrices(20),
  rfqState: "none",
  rfqPrice: null,
  rfqReceivedTime: null,
  rfqTimeout: null,
  lastTradeExecutionStatus: null,
}

export const currencyPair = {
  base: "EUR",
  pipsPosition: 2,
  ratePrecision: 3,
  symbol: "EURUSD",
  terms: "USD",
}

export const rfqStateReceived = {
  stage: QuoteStateStage.Received,
}
