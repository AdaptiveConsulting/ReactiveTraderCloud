import { setupLayout, LayoutActions } from './layoutActions'
import { switchMapTo, map } from 'rxjs/operators'
import { ApplicationEpic } from 'StoreTypes'
import { platform } from 'rt-platforms'

export const layoutEpic: ApplicationEpic = (action$, state$) => {
  return action$.pipe(
    setupLayout,
    switchMapTo(
      platform.setupWorkspaces().pipe(map(LayoutActions.updateContainerVisibilityAction)),
    ),
  )
}
