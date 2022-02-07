import {
  CLISearchListenerRequest,
  CLISearchListenerResponse,
  CLISearchResponse,
  CLISearchResult,
  CLITemplate
} from '@openfin/workspace'
import { App, Page } from '@openfin/workspace-platform'
import { filter, Subscription, take, takeUntil } from 'rxjs'
import { getApps } from '../apps'
import { getPages } from '../browser'
import { VITE_RT_URL } from '../consts'
import { Direction, PriceTick } from '../generated/TradingGateway'
import { executing$, executionResponse$ } from '../services/executions'
import { getNlpIntent, NlpIntentType } from '../services/nlpService'
import { getPriceForSymbol$, prices$ } from '../services/prices'
import { tradesStream$ } from '../services/trades'

export const HOME_ACTION_DELETE_PAGE = 'Delete Page'
export const HOME_ACTION_LAUNCH_PAGE = 'Launch Page'

const mapAppEntriesToSearchEntries = (apps: App[]): CLISearchResult<any>[] =>
  apps.map(app => {
    let entry: any = {
      key: app.appId,
      title: app.title,
      data: app,
      actions: [],
      template: CLITemplate.Plain
    }
    let action = { name: 'Launch View', hotkey: 'enter' }

    if (app.manifestType === 'view') {
      entry.label = 'View'
      entry.actions = [action]
    }
    if (app.manifestType === 'snapshot') {
      entry.label = 'Snapshot'
      action.name = 'Launch Snapshot'
      entry.actions = [action]
    }
    if (app.manifestType === 'manifest') {
      entry.label = 'App'
      action.name = 'Launch App'
      entry.actions = [action]
    }
    if (app.manifestType === 'external') {
      action.name = 'Launch Native App'
      entry.actions = [action]
      entry.label = 'Native App'
    }

    if (Array.isArray(app.icons) && app.icons.length > 0) {
      entry.icon = app.icons[0].src
    }

    if (app.description !== undefined) {
      entry.description = app.description
      entry.shortDescription = app.description
      entry.template = CLITemplate.SimpleText
      entry.templateContent = app.description
    }

    return entry
  })

const mapPageEntriesToSearchEntries = (pages: Page[]): CLISearchResult<any>[] =>
  pages.map(page => {
    let entry: any = {
      key: page.pageId,
      title: page.title,
      label: 'Page',
      actions: [
        { name: HOME_ACTION_DELETE_PAGE, hotkey: 'CmdOrCtrl+D' },
        { name: HOME_ACTION_LAUNCH_PAGE, hotkey: 'Enter' }
      ],
      data: { tags: ['page'], pageId: page.pageId },
      template: CLITemplate.Plain
    }

    if (page.description !== undefined) {
      entry.description = page.description
      entry.shortDescription = page.description
      entry.template = CLITemplate.SimpleText
      entry.templateContent = page.description
    }

    return entry
  })

export const getAppsAndPages = async (query?: string): Promise<CLISearchResponse> => {
  let apps = await getApps()
  let pages = await getPages()

  let appSearchEntries = mapAppEntriesToSearchEntries(apps)
  let pageSearchEntries = mapPageEntriesToSearchEntries(pages)

  let initialResults: CLISearchResult<any>[] = [...appSearchEntries, ...pageSearchEntries]

  if (query === undefined || query === null || query.length === 0) {
    return {
      results: initialResults
    }
  }

  if (initialResults.length > 0) {
    const finalResults = initialResults.filter(entry => {
      let targetValue = entry.title

      if (targetValue !== undefined && targetValue !== null && typeof targetValue === 'string') {
        return targetValue.toLowerCase().indexOf(query) > -1
      }
      return false
    })

    return {
      results: finalResults
    }
  } else {
    return {
      results: []
    }
  }
}

const constructSpotResult = ({ symbol, bid, ask, mid }: PriceTick) => ({
  key: `spot-${symbol}`,
  title: symbol,
  label: 'Currency Pair',
  data: {
    symbol,
    manifestType: 'url',
    manifest: `${VITE_RT_URL}/spot/${symbol}`
  },
  actions: [
    { name: `Launch ${symbol} tile`, hotkey: 'enter' },
    { name: `Trade ${symbol}`, hotkey: 'CmdOrCtrl+T' }
  ],
  template: CLITemplate.List,
  templateContent: [
    ['Symbol', symbol],
    ['Bid', bid],
    ['Ask', ask],
    ['Mid', mid]
  ]
})

export const getNlpResults = async (
  query: string,
  request: CLISearchListenerRequest,
  response: CLISearchListenerResponse
) => {
  let loadingRevoked = false
  const intent = await getNlpIntent(query)

  const revokeLoading = () => {
    if (!loadingRevoked) {
      response.revoke('loading')
      loadingRevoked = true
    }
  }

  if (!intent) {
    return revokeLoading()
  }

  console.log('Intent', intent)

  switch (intent.type) {
    case NlpIntentType.SpotQuote: {
      const { symbol } = intent.payload

      if (!symbol) {
        return revokeLoading()
      }

      let sub = getPriceForSymbol$(symbol).subscribe(priceTick => {
        const result = constructSpotResult(priceTick)
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
        title: 'Market',
        label: 'Live Rates',
        data: {
          manifestType: 'url',
          manifest: `${VITE_RT_URL}/liverates`
        },
        actions: [{ name: `Launch Live Rates`, hotkey: 'enter' }],
        template: CLITemplate.List,
        templateContent: [] as any
      }

      let sub = prices$.subscribe(priceTicks => {
        result.templateContent = priceTicks.map(priceTick => [priceTick.symbol, priceTick.mid])

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
      let sub = tradesStream$.subscribe(trades => {
        trades.reverse()
        // @ts-ignore
        const trimmedTrades = intent.payload.count ? trades.splice(0, intent.payload.count) : trades
        const results = trimmedTrades.map(trade => ({
          key: `trade-${trade.tradeId}`,
          title: `${trade.tradeId}`,
          label: 'Trade',
          data: {
            manifestType: 'url',
            manifest: `${VITE_RT_URL}/trades`
          },
          actions: [{ name: `Launch trades`, hotkey: 'enter' }],
          template: CLITemplate.List,
          templateContent: [
            ['Trade ID', trade.tradeId],
            ['Status', trade.status],
            ['Trade Date', trade.tradeDate],
            ['Direction', trade.direction],
            ['CCYCCY', trade.currencyPair],
            ['Deal CCY', trade.dealtCurrency],
            ['Notional', trade.notional],
            ['Rate', trade.spotRate],
            ['Value Date', trade.valueDate],
            ['Trade', trade.tradeName]
          ]
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
      const { direction, notional, symbol } = intent.payload as any

      if (!symbol) {
        return revokeLoading()
      }

      const key = `trade-execution-${symbol}`;
      let subs: Subscription[] = []

      subs.push(
        getPriceForSymbol$(symbol)
          .pipe(takeUntil(executing$.pipe(filter(value => !!value))))
          .subscribe(({ bid, ask, mid }) => {
            const data = {
              manifestType: 'trade-execution',
              currencyPair: symbol,
              spotRate: direction === Direction.Buy ? ask : bid,
              valueDate: new Date().toISOString().substr(0, 10),
              direction,
              notional,
              dealtCurrency: direction === Direction.Buy ? symbol.substr(0, 3) : symbol.substr(3, 3)
            }
            const result = {
              key,
              title: `${direction} ${notional} ${symbol}`,
              label: 'Trade Execution',
              data,
              actions: [{ name: `Execute`, hotkey: 'enter' }],
              template: CLITemplate.List,
              templateContent: [
                ['Symbol', symbol],
                ['Notional', notional],
                ['Bid', bid],
                ['Ask', ask],
                ['Mid', mid]
              ]
            }

            revokeLoading()
            response.respond([result])
          })
      )

      subs.push(
        executing$.pipe(take(1)).subscribe(execution => {
          response.respond([
            {
              key,
              title: `Executing...`,
              label: 'Trade Execution',
              data: {},
              actions: [],
              // @ts-ignore
              template: CLITemplate.List,
              templateContent: [
                ['Symbol', execution.currencyPair],
                ['Notional', execution.notional],
                [direction, execution.spotRate]
              ]
            }
          ])
        })
      )

      subs.push(
        executionResponse$.pipe(take(1)).subscribe(({ trade }) => {
          response.respond([
            {
              key,
              title: `Trade ${trade.status}`,
              label: 'Trade Execution',
              data: {},
              actions: [],
              // @ts-ignore
              template: CLITemplate.List,
              templateContent: [
                [trade.tradeId, trade.status],
                ['Symbol', trade.currencyPair],
                ['Notional', trade.notional],
                [trade.direction, trade.spotRate],
                ['Date', new Date(trade.tradeDate)]
              ]
            }
          ])
        })
      )

      request.onClose(() => {
        if (subs.length) {
          subs.forEach(sub => sub.unsubscribe())
        }
      })

      break
    }

    default:
      return revokeLoading()
  }
}
