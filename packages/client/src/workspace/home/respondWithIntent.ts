/* eslint-disable @typescript-eslint/ban-ts-comment */
import {
  CLITemplate,
  SearchListenerRequest,
  SearchListenerResponse,
  SearchResult,
} from "@openfin/workspace"
import { ACK_CREATE_RFQ_RESPONSE, Direction } from "generated/TradingGateway"
import {
  combineLatest,
  filter,
  map,
  of,
  scan,
  Subscription,
  switchMap,
  take,
  takeUntil,
  withLatestFrom,
} from "rxjs"
import { getCreditRfqDetails$ } from "services/credit"
import { creditInstruments$ } from "services/credit/creditInstruments"
import {
  currencyPairs$,
  currencyPairSymbols$,
  getCurrencyPair$,
} from "services/currencyPairs"
import { executions$ } from "services/executions"
import { getPrice$, Price } from "services/prices"
import { trades$ } from "services/trades"

import {
  CreditRfqIntent,
  NlpIntent,
  NlpIntentType,
  TradeExecutionIntent,
  TradesInfoIntent,
} from "@/services/nlp"

import { VITE_RT_URL } from "../constants"
import { createContainer, createText } from "../templates"
import {
  constructMarketTemplateContent,
  constructRfqRaisedTemplateContent,
  constructSpotResult,
  constructTradeExecutedTemplateContent,
  constructTradeExecutionTemplateContent,
} from "./templates"
import { ADAPTIVE_LOGO, executing$, rfqResponse$ } from "./utils"

const nf = new Intl.NumberFormat("default")

export const respondWithIntent = (
  intent: NlpIntent | null,
  response: SearchListenerResponse,
  request: SearchListenerRequest,
) => {
  let loadingRevoked = false

  const revokeLoading = () => {
    if (!loadingRevoked) {
      response.revoke("loading")
      loadingRevoked = true
    }
  }

  if (!intent) {
    return revokeLoading()
  }

  switch (intent.type) {
    case NlpIntentType.SpotQuote: {
      const { symbol } = intent.payload

      if (!symbol) {
        return revokeLoading()
      }

      const sub = getPrice$(symbol)
        .pipe(withLatestFrom(getCurrencyPair$(symbol)))
        .subscribe(([priceTick, currencyPair]) => {
          const result = constructSpotResult(priceTick, currencyPair)
          revokeLoading()
          response.respond([result])
        })

      request.onClose(() => {
        if (sub) {
          sub.unsubscribe()
        }
      })

      break
    }

    case NlpIntentType.MarketInfo: {
      const result = {
        key: `market`,
        title: "Market",
        label: "Live Rates",
        icon: ADAPTIVE_LOGO,
        data: {
          manifestType: "url",
          manifest: `${VITE_RT_URL}/fx-tiles`,
        },
        actions: [{ name: `Launch Live Rates`, hotkey: "enter" }],
        template: CLITemplate.Custom,
        templateContent: {},
      }

      const sub = currencyPairSymbols$
        .pipe(
          switchMap((symbols) => {
            const priceUpdates$ = symbols.map((symbol) => getPrice$(symbol))
            return combineLatest(priceUpdates$).pipe(
              scan((acc, prices) => {
                prices.forEach((price) => {
                  acc.set(price.symbol, price)
                })

                return acc
              }, new Map<string, Price>()),
            )
          }),
        )
        .pipe(withLatestFrom(currencyPairs$))
        .subscribe(([prices, currencyPairs]) => {
          result.templateContent = constructMarketTemplateContent(
            [...prices.values()],
            currencyPairs,
          )

          revokeLoading()
          response.respond([result])
        })

      request.onClose(() => {
        if (sub) {
          sub.unsubscribe()
        }
      })

      break
    }

    case NlpIntentType.TradeInfo: {
      const sub = trades$.subscribe((trades) => {
        trades.reverse()
        const trimmedTrades = (intent as TradesInfoIntent).payload.count
          ? trades.splice(0, (intent as TradesInfoIntent).payload.count)
          : trades
        const results = trimmedTrades.map((trade) => ({
          key: `trade-${trade.tradeId}`,
          title: `${trade.tradeId}`,
          label: "Trade",
          icon: ADAPTIVE_LOGO,
          data: {
            manifestType: "url",
            manifest: `${VITE_RT_URL}/fx-blotter`,
          },
          actions: [{ name: `Launch trades`, hotkey: "enter" }],
          template: CLITemplate.List,
          templateContent: [
            ["Trade ID", trade.tradeId],
            ["Status", trade.status],
            ["Trade Date", trade.tradeDate],
            ["Direction", trade.direction],
            ["CCYCCY", trade.currencyPair],
            ["Deal CCY", trade.dealtCurrency],
            ["Notional", nf.format(trade.notional)],
            ["Rate", trade.spotRate],
            ["Value Date", trade.valueDate],
            ["Trade", trade.tradeName],
          ],
        }))

        revokeLoading()
        response.respond(results)
      })

      request.onClose(() => {
        if (sub) {
          sub.unsubscribe()
        }
      })

      break
    }

    case NlpIntentType.TradeExecution: {
      const { direction, notional, symbol } = (intent as TradeExecutionIntent)
        .payload

      if (!symbol || !notional) {
        return revokeLoading()
      }

      const key = `trade-execution-${symbol}`
      const subs: Subscription[] = []
      let result: SearchResult

      subs.push(
        getPrice$(symbol)
          .pipe(
            withLatestFrom(getCurrencyPair$(symbol)),
            takeUntil(executing$.pipe(filter((value) => !!value))),
          )
          .subscribe(([price, currencyPair]) => {
            const { bid, ask } = price
            const formattedNotional = nf.format(notional)

            const data = {
              manifestType: "trade-execution",
              currencyPair: symbol,
              spotRate: direction === Direction.Buy ? ask : bid,
              valueDate: new Date().toISOString().substr(0, 10),
              direction,
              notional,
              dealtCurrency:
                direction === Direction.Buy
                  ? symbol.substr(0, 3)
                  : symbol.substr(3, 3),
            }

            result = {
              key,
              title: `${direction} ${formattedNotional} ${symbol}`,
              label: "Trade Execution",
              icon: ADAPTIVE_LOGO,
              data,
              actions: [{ name: `Execute`, hotkey: "enter" }],
              // @ts-ignore
              template: CLITemplate.Custom,
              templateContent: constructTradeExecutionTemplateContent(
                price,
                currencyPair,
                formattedNotional,
                direction,
              ),
            }

            revokeLoading()
            response.respond([result])
          }),
      )

      subs.push(
        executing$.pipe(take(1)).subscribe(() => {
          const newResult: SearchResult = { ...result }
          newResult.actions = []
          //@ts-ignore
          newResult.templateContent = {
            //@ts-ignore
            ...newResult.templateContent,
            layout: createContainer("column", [
              //@ts-ignore
              newResult.templateContent.layout,
              createContainer(
                "column",
                [
                  createText("executingLoader", 12, {
                    background: "rgb(95, 148, 245)",
                    padding: "16px 32px",
                    borderRadius: "32px",
                    margin: "auto ",
                  }),
                ],
                {
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: "rgba(0,0,0,.3)",
                  zIndex: 2,
                },
              ),
            ]),
          }
          response.respond([newResult])
        }),
      )

      subs.push(
        executions$.pipe(take(1)).subscribe((trade) => {
          response.respond([
            {
              key,
              title: `Trade ${trade.status}`,
              label: "Trade Execution",
              icon: ADAPTIVE_LOGO,
              data: {
                manifestType: "url",
                manifest: `${VITE_RT_URL}/fx-blotter`,
              },
              actions: [{ name: `Launch Trades`, hotkey: "enter" }],
              // @ts-ignore
              template: CLITemplate.Custom,
              templateContent: constructTradeExecutedTemplateContent(trade),
            },
          ])
        }),
      )

      request.onClose(() => {
        if (subs.length) {
          subs.forEach((sub) => sub.unsubscribe())
        }
      })

      break
    }

    case NlpIntentType.CreditRfq: {
      const { symbol, direction, notional, maturity } = (
        intent as CreditRfqIntent
      ).payload

      if (!symbol || !direction || !notional) {
        return revokeLoading()
      }

      const formattedNotional = nf.format(notional)

      const key = `rfq-execution-${symbol}`
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let result: any

      const subs = creditInstruments$
        .pipe(
          map((instruments) => {
            const symbolInstruments = instruments.filter(
              (instrument) => instrument.ticker === symbol,
            )

            if (maturity) {
              return (
                symbolInstruments.find(
                  (instrument) => maturity === instrument.maturity.slice(0, 4),
                ) ?? symbolInstruments[0]
              )
            }

            return symbolInstruments[0]
          }),
        )
        .subscribe((instrument) => {
          if (!instrument) {
            return revokeLoading()
          }

          const { cusip, maturity, interestRate, benchmark, ticker } =
            instrument

          const data = {
            manifestType: "rfq-execution",
            instrumentId: instrument.id,
            quantity: notional,
            direction,
          }

          result = {
            key,
            title: `Raise RFQ: ${direction} ${formattedNotional} ${symbol}`,
            label: "RFQ Execution",
            icon: ADAPTIVE_LOGO,
            data,
            actions: [{ name: `Execute`, hotkey: "enter" }],
            // @ts-ignore
            template: CLITemplate.List,
            templateContent: [
              ["Ticker", ticker],
              ["Cusip", cusip],
              ["Maturity", maturity],
              ["Interest Rate", interestRate],
              ["Benchmark", benchmark],
            ],
          }

          revokeLoading()
          response.respond([result])
        })

      subs.add(
        rfqResponse$
          .pipe(
            switchMap((response) => {
              if (response.type === ACK_CREATE_RFQ_RESPONSE) {
                return getCreditRfqDetails$(response.payload)
              }
              return of(null)
            }),
          )
          .subscribe((rfqDetails) => {
            response.respond([
              {
                key,
                title: `RFQ ${rfqDetails ? "Raised" : "Failed to Raise"}`,
                label: "RFQ Execution",
                icon: ADAPTIVE_LOGO,
                data: {
                  manifestType: "url",
                  manifest: `${VITE_RT_URL}/credit-rfqs`,
                },
                actions: [{ name: `Launch RFQs`, hotkey: "enter" }],
                // @ts-ignore
                template: CLITemplate.Custom,
                templateContent: constructRfqRaisedTemplateContent(rfqDetails),
              },
            ])
          }),
      )

      request.onClose(() => {
        subs.unsubscribe()
      })

      break
    }

    default:
      return revokeLoading()
  }
}
