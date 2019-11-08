import { Action } from 'redux'
import { ofType } from 'redux-observable'
import { from, EMPTY } from 'rxjs'
import { map, mergeMap } from 'rxjs/operators'
import { ApplicationEpic } from 'StoreTypes'
import { SpotTileActions, TILE_ACTION_TYPES } from '../actions'
import { platformHasFeature } from 'rt-platforms'

const { displayCurrencyChart, currencyChartOpened } = SpotTileActions
type DisplayChartAction = ReturnType<typeof displayCurrencyChart>
type ChartOpenedAction = ReturnType<typeof currencyChartOpened>

const CHART_ID = 'ChartIQ'

const createChartConfig = (symbol: string, interval: number): AppConfig => ({
  uuid: CHART_ID,
  url: `http://adaptiveconsulting.github.io/ReactiveTraderCloud/chartiq/template-advanced.html?symbol=${symbol}&period=${interval}`,
  icon: 'http://adaptiveconsulting.github.io/ReactiveTraderCloud/chartiq/icon.png',
  payload: { symbol, interval },
  topic: 'chartiq:main:change_symbol',
})

export const displayCurrencyChartEpic: ApplicationEpic = (action$, state$, { platform }) => {
  if (!platformHasFeature(platform, 'app')) {
    return EMPTY
  }
  return action$.pipe(
    ofType<Action, DisplayChartAction>(TILE_ACTION_TYPES.DISPLAY_CURRENCY_CHART),
    mergeMap<DisplayChartAction, string>((action: DisplayChartAction) =>
      from<string>(platform.app.open(CHART_ID, createChartConfig(action.payload, 5))),
    ),
    map<string, ChartOpenedAction>(symbol => currencyChartOpened(symbol)),
  )
}

interface AppConfig {
  url?: string
  icon?: string
  uuid?: string
  payload?: string | object
  topic?: string
}
