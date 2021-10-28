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

export const mockValues = {
  bigFigure: "184.",
  pip: "76",
  tenth: "7",
  symbol: "eurusd",
  price: true,
  persist: true,
}

export const FXSpotHoritzontalVariants = [
  {
    title: "Normal",
    props: {},
  },
  {
    title: "Hover",
    props: {
      supportsTearOut: true,
      hover: true,
    },
  },
  {
    title: "Price Unavailable",
    props: {
      disabledInput: true,
      isStale: true,
    },
  },
  {
    title: "Executing",
    props: {
      disabledInput: true,
      hover: true,
      isExecuting: true,
      faded: true,
    },
  },
]

export const FXRFQHoritzontalVariants = [
  {
    title: "Begin Price Request",
    props: {
      hover: true,
      faded: true,
      resetInput: true,
      buttonText: "Initiate RFQ",
    },
  },
  {
    title: "Awaiting Price",
    props: {
      hover: true,
      awaiting: true,
      disabledInput: true,
      buttonText: "Cancel RFQ",
    },
  },
  {
    title: "Price Announced",
    props: {
      hover: false,
      activeColorLeft: true,
      activeColorRight: true,
      disabledInput: true,
      startTImer: 60,
    },
  },
  {
    title: "Priced",
    props: {
      disabledInput: true,
      hover: false,
      startTimer: 49,
      rfqStateLeft: rfqStateReceived,
      rfqStateRight: rfqStateReceived,
    },
  },
  {
    title: "Priced Hover",
    props: {
      disabledInput: true,
      hover: false,
      startTimer: 49,
      activeColorLeft: true,
      rfqStateRight: rfqStateReceived,
    },
  },
  {
    title: "Priced Expired",
    props: {
      hover: true,
      faded: true,
      buttonText: "Requote",
      resetInput: true,
      isExpired: true,
    },
  },
]

export const FXSpotVerticalVariants = [
  {
    title: "Normal",
    props: {},
  },
  {
    title: "Hover",
    props: {
      supportsTearOut: true,
      hover: true,
    },
  },
  {
    title: "Price Unavailable",
    props: {
      disabledInput: true,
      isStale: true,
    },
  },
  {
    title: "Executing",
    props: {
      disabledInput: true,
      hover: true,
      isExecuting: true,
      faded: true,
    },
  },
]

export const FXRFQVerticalVariants = [
  {
    title: "Begin Price Request",
    props: {
      hover: true,
      faded: true,
      resetInput: true,
      buttonText: "Initiate RFQ",
    },
  },
  {
    title: "Awaiting Price",
    props: {
      hover: true,
      awaiting: true,
      disabledInput: true,
      buttonText: "Cancel RFQ",
    },
  },
  {
    title: "Price Announced",
    props: {
      hover: false,
      activeColorLeft: true,
      activeColorRight: true,
      disabledInput: true,
      startTImer: 60,
    },
  },
  {
    title: "Priced",
    props: {
      disabledInput: true,
      hover: false,
      startTimer: 49,
      rfqStateLeft: rfqStateReceived,
      rfqStateRight: rfqStateReceived,
    },
  },
  {
    title: "Priced Hover",
    props: {
      disabledInput: true,
      hover: false,
      startTimer: 49,
      activeColorLeft: true,
      rfqStateRight: rfqStateReceived,
    },
  },
  {
    title: "Priced Expired",
    props: {
      hover: true,
      faded: true,
      buttonText: "Requote",
      resetInput: true,
      isExpired: true,
    },
  },
]
