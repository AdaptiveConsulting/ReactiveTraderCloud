import { bind } from "@react-rxjs/core"
import { BlotterService } from "generated/TradingGateway"
import { map, scan } from "rxjs/operators"

import {
  ACCEPTED_QUOTE_STATE,
  AcceptedQuoteState,
} from "@/generated/TradingGateway"

import { withIsStaleData } from "../connection"
import { creditRfqsById$ } from "../credit"
import { withConnection } from "../withConnection"
import { CreditTrade, FxTrade } from "./types"

const tradesStream$ = BlotterService.getTradeStream().pipe(
  withConnection(),
  map(({ isStateOfTheWorld, updates }) => ({
    isStateOfTheWorld,
    updates: updates.map((rawTrade) => ({
      tradeId: Number(rawTrade.tradeId),
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

export const [useTrades, trades$] = bind<FxTrade[]>(
  tradesStream$.pipe(
    scan(
      (acc, { isStateOfTheWorld, updates }) => ({
        ...(isStateOfTheWorld ? {} : acc),
        ...Object.fromEntries(
          updates.map((trade) => [trade.tradeId, trade] as const),
        ),
      }),
      {} as Record<number, FxTrade>,
    ),
    map((trades) => Object.values(trades).reverse()),
  ),
)

export const isBlotterDataStale$ = withIsStaleData(trades$)

export const [useCreditTrades, creditTrades$] = bind(
  creditRfqsById$.pipe(
    map((update) => {
      const acceptedRfqs = Object.values(update)
        .filter((rfq) => {
          return rfq.quotes?.find(
            (quote) => quote.state.type === ACCEPTED_QUOTE_STATE,
          )
        })
        .map((rfq) => ({ ...rfq, status: rfq.state }))
      return acceptedRfqs
        .map((rfq) => {
          const acceptedQuote = rfq.quotes?.find(
            (quote) => quote.state.type === ACCEPTED_QUOTE_STATE,
          )

          return {
            tradeId: rfq.id,
            status: ACCEPTED_QUOTE_STATE,
            tradeDate: new Date(Date.now()),
            direction: rfq.direction,
            counterParty: rfq.dealers.find(
              (dealer) => dealer.id === acceptedQuote?.dealerId,
            )?.name,
            cusip: rfq.instrument?.cusip,
            security: rfq.instrument?.ticker,
            quantity: rfq.quantity,
            orderType: "AON",
            unitPrice: (acceptedQuote?.state as AcceptedQuoteState)?.payload,
          }
        })
        .reverse() as CreditTrade[]
    }),
  ),
  [],
)
