import { BlotterService, QuoteState } from "@/generated/TradingGateway"
import { CreditTrade, Direction } from "./types"
import { bind } from "@react-rxjs/core"
import { map, scan } from "rxjs/operators"
import { withIsStaleData } from "../connection"
import { creditRfqsById$ } from "../credit"
import { withConnection } from "../withConnection"
import { Trade } from "./types"

const tradesStream$ = BlotterService.getTradeStream().pipe(
  withConnection(),
  map(({ isStateOfTheWorld, updates }) => ({
    isStateOfTheWorld,
    updates: updates.map((rawTrade) => ({
      tradeId: rawTrade.tradeId.toString(10),
      symbol: rawTrade.currencyPair, // TODO: talk with hydra team about this
      traderName: rawTrade.tradeName,
      notional: rawTrade.notional,
      dealtCurrency: rawTrade.dealtCurrency,
      direction: rawTrade.direction,
      status: rawTrade.status,
      spotRate: rawTrade.spotRate,
      tradeDate: new Date(rawTrade.tradeDate), // TODO: talk with hydra team about this
      valueDate: new Date(rawTrade.valueDate), // TODO: talk with hydra team about this
    })),
  })),
)

export const [useTrades, trades$] = bind<Trade[]>(
  tradesStream$.pipe(
    scan(
      (acc, { isStateOfTheWorld, updates }) => ({
        ...(isStateOfTheWorld ? {} : acc),
        ...Object.fromEntries(
          updates.map((trade) => [trade.tradeId, trade] as const),
        ),
      }),
      {} as Record<number, Trade>,
    ),
    map((trades) => {
      return Object.values(trades).reverse()
    }),
  ),
)

export const isBlotterDataStale$ = withIsStaleData(trades$)

export const [useCreditTrades, creditTrades$] = bind(
  creditRfqsById$.pipe(
    map((update, idx) => {
      const acceptedRfqs = Object.values(update).filter((rfq) => {
        return rfq.quotes?.find((quote) => quote.state === QuoteState.Accepted)
      })
      return acceptedRfqs
        .map((rfq) => {
          const acceptedQuote = rfq.quotes[0]
          return {
            tradeId: rfq.id.toString(),
            state: QuoteState.Accepted,
            tradeDate: new Date(Date.now()),
            direction: Direction.Buy,
            counterParty: rfq.dealers.find(
              (dealer) => dealer.id === acceptedQuote?.dealerId,
            )?.name,
            cusip: rfq.instrument?.cusip,
            security: rfq.instrument?.ticker,
            quantity: rfq.quantity.toString(),
            orderType: "AON",
            unitPrice: acceptedQuote?.price.toString(),
          }
        })
        .reverse() as CreditTrade[]
    }),
  ),
  [],
)
