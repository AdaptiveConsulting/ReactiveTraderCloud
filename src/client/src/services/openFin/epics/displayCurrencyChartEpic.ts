import { Action } from 'redux'
import { ofType } from 'redux-observable'
import { from } from 'rxjs'
import { map, mergeMap } from 'rxjs/operators'
import { ApplicationEpic } from '../../../ApplicationEpic'
import { ACTION_TYPES, SpotTileActions } from '../../../ui/spotTile'

type DisplayChartAction = ReturnType<typeof SpotTileActions.displayCurrencyChart>
type ChartOpenedAction = ReturnType<typeof SpotTileActions.currencyChartOpened>

export const displayCurrencyChartEpic: ApplicationEpic = (action$, state$, { openFin }) =>
  action$.pipe(
    ofType<Action, DisplayChartAction>(ACTION_TYPES.DISPLAY_CURRENCY_CHART),
    mergeMap<DisplayChartAction, string>((action: DisplayChartAction) =>
      from<string>(openFin.displayCurrencyChart(action.payload))
    ),
    map<string, ChartOpenedAction>(symbol => SpotTileActions.currencyChartOpened(symbol))
  )
