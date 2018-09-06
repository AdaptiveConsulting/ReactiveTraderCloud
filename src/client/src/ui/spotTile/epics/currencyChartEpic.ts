import { Action } from 'redux'
import { ofType } from 'redux-observable'
import { from } from 'rxjs'
import { map, mergeMap } from 'rxjs/operators'
import { ApplicationEpic } from 'StoreTypes'
import { SpotTileActions, TILE_ACTION_TYPES } from '../actions'

const { displayCurrencyChart, currencyChartOpened } = SpotTileActions
type DisplayChartAction = ReturnType<typeof displayCurrencyChart>
type ChartOpenedAction = ReturnType<typeof currencyChartOpened>

export const connectCurrencyChartToOpenFinEpic: ApplicationEpic = (action$, state$, { openFin }) =>
  action$.pipe(
    ofType<Action, DisplayChartAction>(TILE_ACTION_TYPES.DISPLAY_CURRENCY_CHART),
    mergeMap<DisplayChartAction, string>((action: DisplayChartAction) =>
      from<string>(openFin.displayCurrencyChart(action.payload))
    ),
    map<string, ChartOpenedAction>(symbol => currencyChartOpened(symbol))
  )
