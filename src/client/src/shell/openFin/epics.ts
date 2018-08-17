import { combineEpics } from 'redux-observable'

import { openLinkWithOpenFinEpic } from './epics/openLink'

export const openfinEpic = combineEpics(openLinkWithOpenFinEpic)
