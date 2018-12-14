import { Action } from 'redux'
import { ofType } from 'redux-observable'
import { from } from 'rxjs'
import { map, mergeMap } from 'rxjs/operators'
import { ApplicationEpic } from 'StoreTypes'
import { SpotTileActions, TILE_ACTION_TYPES } from '../actions'

const { displayCurrencyChart, currencyChartOpened } = SpotTileActions
type DisplayChartAction = ReturnType<typeof displayCurrencyChart>
type ChartOpenedAction = ReturnType<typeof currencyChartOpened>

const CHART_ID = 'ChartIQ'

const createChartConfig = (symbol: string, interval: number): AppConfig => ({
  uuid: CHART_ID,
  url: `http://adaptiveconsulting.github.io/ReactiveTraderCloud/chartiq/chartiq-shim.html?symbol=${symbol}&period=${interval}`,
  icon: 'http://adaptiveconsulting.github.io/ReactiveTraderCloud/chartiq/icon.png',
  payload: { symbol, interval },
  topic: 'chartiq:main:change_symbol',
})

export const displayCurrencyChartEpic: ApplicationEpic = (action$, state$, { platform }) =>
  action$.pipe(
    ofType<Action, DisplayChartAction>(TILE_ACTION_TYPES.DISPLAY_CURRENCY_CHART),
    mergeMap<DisplayChartAction, string>((action: DisplayChartAction) =>
      from<string>(
        platform.name === 'openfin' // this epic is only pushed if the openfin platform is present, if there is another platform present it is assumed to be Finsemble
          ? platform.app!.open!(CHART_ID, createChartConfig(action.payload, 5))
          : platform.app!.open!(CHART_ID, createChartConfig(action.payload, 5)),
      ),
    ),
    map<string, ChartOpenedAction>(symbol => currencyChartOpened(symbol)),
  )

interface AppConfig {
  url?: string
  icon?: string
  uuid?: string
  payload?: string | object
  topic?: string
}
